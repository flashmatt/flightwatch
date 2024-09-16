<template>
  <div id="map" class="w-screen h-screen"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { fromLonLat } from "ol/proj";
import axios from "axios";
import { Icon, Style } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { XYZ } from "ol/source";
import useSprites from "../composables/useSprites";
import useAircraft from "../composables/useAircraft";

const map = ref(null);
let vectorSource = null;
let aircraftFeatures = {};

const { getSvgFromAircraft } = useSprites();
const { selectAircraft, isAircraftSelected, getSelectedAircraft:selectedAircraft, updateSelectedAircraft, deselectAircraft } = useAircraft();


onMounted(() => {
  initializeMap();
  startDataPolling();
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.setTarget(null);
  }
});

const initializeMap = () => {
  const centerLat = 54.576459;
  const centerLon = -1.246257;

  map.value = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          attributions:
            '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
        }),
      }),
    ],
    view: new View({
      center: fromLonLat([centerLon, centerLat]),
      zoom: 8,
    }),
  });

  vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map.value.addLayer(vectorLayer);
  map.value.on('click', handleMapClick);
};

const handleMapClick = (event) => {
  let clickedAircraft = false;

  map.value.forEachFeatureAtPixel(event.pixel, (feature) => {
    const aircraftData = feature.getProperties();
    selectAircraft(aircraftData.meta); // Select the aircraft
    clickedAircraft = true;
  });

  if (!clickedAircraft) {
    deselectAircraft();
  }
}

const startDataPolling = () => {
  fetchAdsbData();
};

const fetchAdsbData = async () => {
  try {
    const centerLat = 54.576459;
    const centerLon = -1.246257;
    const response = await axios.get(
      `/api/v2/lat/${centerLat}/lon/${centerLon}/dist/100`,
    );

    const newData = processApiResponse(response.data);
    updateAircraftData(newData);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setTimeout(fetchAdsbData, 1500);
  }
};

const processApiResponse = (data) => {
  if (!data.ac) {
    return [];
  }

  return data.ac
      .filter((aircraft) => aircraft.lat != null && aircraft.lon != null)
      .map((aircraft) => ({
        lat: aircraft.lat ?? 0, // Default to 0 if null/undefined
        lon: aircraft.lon ?? 0,
        hex: aircraft.hex ?? "",
        flight: aircraft.flight ?? "Unknown", // Provide defaults for missing flight info
        track: aircraft.track ?? 0,
        speed: aircraft.gs ?? 0,

        type: aircraft.type ?? "Unknown Type",
        registration: aircraft.r ?? "Unknown Registration",
        aircraftType: aircraft.t ?? "Unknown Aircraft",

        altBaro: aircraft.alt_baro ?? 0,
        altGeom: aircraft.alt_geom ?? 0,

        gs: aircraft.gs ?? 0,
        ias: aircraft.ias ?? 0,
        tas: aircraft.tas ?? 0,
        mach: aircraft.mach ?? 0,

        wd: aircraft.wd ?? 0,
        ws: aircraft.ws ?? 0,
        oat: aircraft.oat ?? 0,
        tat: aircraft.tat ?? 0,

        trackRate: aircraft.track_rate ?? 0,
        roll: aircraft.roll ?? 0,
        magHeading: aircraft.mag_heading ?? 0,
        trueHeading: aircraft.true_heading ?? 0,

        baroRate: aircraft.baro_rate ?? 0,
        geomRate: aircraft.geom_rate ?? 0,

        squawk: aircraft.squawk ?? "0000",
        emergency: aircraft.emergency ?? "None",
        category: aircraft.category ?? "Unknown",

        navQnh: aircraft.nav_qnh ?? 0,
        navAltitudeMcp: aircraft.nav_altitude_mcp ?? 0,
        navAltitudeFms: aircraft.nav_altitude_fms ?? 0,
        navModes: aircraft.nav_modes ?? [],

        nic: aircraft.nic ?? 0,
        rc: aircraft.rc ?? 0,
        nicBaro: aircraft.nic_baro ?? 0,
        nacP: aircraft.nac_p ?? 0,
        nacV: aircraft.nac_v ?? 0,

        sil: aircraft.sil ?? 0,
        silType: aircraft.sil_type ?? "Unknown",

        gva: aircraft.gva ?? 0,
        sda: aircraft.sda ?? 0,

        alert: aircraft.alert ?? false,
        spi: aircraft.spi ?? false,

        mlat: aircraft.mlat ?? "N/A",
        tisb: aircraft.tisb ?? "N/A",

        messages: aircraft.messages ?? 0,
        seen: aircraft.seen ?? 0,
        rssi: aircraft.rssi ?? 0,

        dst: aircraft.dst ?? 0,
        dir: aircraft.dir ?? 0,
        rr_lat: aircraft.rr_lat ?? 0,
        rr_lon: aircraft.rr_lon ?? 0,

        lastPosition: aircraft.lastPosition
            ? {
              lat: aircraft.lastPosition.lat ?? 0,
              lon: aircraft.lastPosition.lon ?? 0,
              nic: aircraft.lastPosition.nic ?? 0,
              rc: aircraft.lastPosition.rc ?? 0,
              seen_pos: aircraft.lastPosition.seen_pos ?? 0,
            }
            : {
              lat: 0,
              lon: 0,
              nic: 0,
              rc: 0,
              seen_pos: 0,
            },

        dbFlags: aircraft.dbFlags
            ? {
              military: (aircraft.dbFlags & 1) !== 0,
              interesting: (aircraft.dbFlags & 2) !== 0,
              PIA: (aircraft.dbFlags & 4) !== 0,
              LADD: (aircraft.dbFlags & 8) !== 0,
            }
            : {
              military: false,
              interesting: false,
              PIA: false,
              LADD: false,
            },

        acasRa: aircraft.acas_ra ?? "None",
        gpsOkBefore: aircraft.gpsOkBefore ?? 0,
      }));
};


const updateAircraftData = (newData) => {
  const newAircraftHexes = new Set();

  newData.forEach((aircraft) => {
    newAircraftHexes.add(aircraft.hex);

    if (aircraftFeatures[aircraft.hex]) {
      // Update existing feature
      const feature = aircraftFeatures[aircraft.hex];
      const geometry = new Point(fromLonLat([aircraft.lon, aircraft.lat]));
      feature.setGeometry(geometry);

      // Retrieve the existing style
      const style = feature.getStyle();

      // Update the rotation of the Icon
      if (style && style.getImage()) {
        style.getImage().setRotation((aircraft.track * Math.PI) / 180);
      }

      // Apply the updated style
      feature.setStyle(style);

      if (isAircraftSelected.value && aircraft.hex === selectedAircraft.value.hex) {
          updateSelectedAircraft(aircraft);
      }

    } else {
      // Create new feature
      const feature = new Feature({
        geometry: new Point(fromLonLat([aircraft.lon, aircraft.lat])),
        hex: aircraft.hex,
        meta: aircraft
      });



      const iconStyle = new Style({
        image: new Icon({
          src: getSvgFromAircraft(aircraft.aircraftType),
          scale: 1, // Adjust scale as needed
          rotation: (aircraft.track * Math.PI) / 180, // Rotation in radians
        }),
      });

      feature.setStyle(iconStyle);

      vectorSource.addFeature(feature);
      aircraftFeatures[aircraft.hex] = feature;
    }
  });

  // Remove features for aircraft that are no longer present
  for (const hex in aircraftFeatures) {
    if (!newAircraftHexes.has(hex)) {
      vectorSource.removeFeature(aircraftFeatures[hex]);
      delete aircraftFeatures[hex];
    }
  }
};

</script>

<style scoped>

</style>
