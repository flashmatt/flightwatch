import { computed, reactive, ref } from "vue";
import axios from "axios";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import useSprites from "../composables/useSprites";

const selectedAircraft = ref({});
const aircraftSelected = ref(false);
const routeSet = ref([]);
export default function useAircraftData(vectorSource) {
  const { getSvgFromAircraft } = useSprites();
  const aircraftFeatures = {};


  const createOrUpdateAircraftFeature = (aircraft) => {
    if (aircraftFeatures[aircraft.hex]) {
      // Update existing feature
      const feature = aircraftFeatures[aircraft.hex];
      const geometry = new Point(fromLonLat([aircraft.lon, aircraft.lat]));
      feature.setGeometry(geometry);

      // Update style rotation
      const style = feature.getStyle();
      if (style && style.getImage()) {
        style.getImage().setRotation((aircraft.trueHeading * Math.PI) / 180);
      }
      feature.setStyle(style);

      if (aircraftSelected.value && selectedAircraft.value.hex === aircraft.hex) {
        selectedAircraft.value = aircraft;
      }
    } else {
      // Create new feature
      const feature = new Feature({
        geometry: new Point(fromLonLat([aircraft.lon, aircraft.lat])),
        hex: aircraft.hex,
        meta: aircraft,
      });

      const iconStyle = new Style({
        image: new Icon({
          src: getSvgFromAircraft(aircraft.aircraftType),
          scale: 1,
          rotation: (aircraft.track * Math.PI) / 180,
        }),
      });

      feature.setStyle(iconStyle);

      vectorSource.addFeature(feature);
      aircraftFeatures[aircraft.hex] = feature;
    }
  };

  const removeStaleAircraftFeatures = (newAircraftHexes) => {
    for (const hex in aircraftFeatures) {
      if (!newAircraftHexes.has(hex)) {
        vectorSource.removeFeature(aircraftFeatures[hex]);
        delete aircraftFeatures[hex];
      }
    }
  };

  const loadRouteSet = (flight, lat, lon) => {
    axios
      .post(`https://api.adsb.lol/api/0/routeset`, {
        planes: [
          {
            callsign: flight.replace(/\s+/g, ""),
            lat: lat,
            lng: lon,
          },
        ],
      })
      .then((response) => {
        routeSet.value = response.data[0]._airports;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectAircraft = (aircraft) => {
    selectedAircraft.value = aircraft;
    loadRouteSet(aircraft.flight, aircraft.lat, aircraft.lon);
    aircraftSelected.value = true;
  };

  const deselectAircraft = () => {
    aircraftSelected.value = false;
    selectedAircraft.value = {};
    routeSet.value = [];
  };

  const isAircraftSelected = computed(() => aircraftSelected.value);
  const getSelectedAircraft = computed(() => selectedAircraft.value);
  const getRouteSet = computed(() => routeSet.value);

  return {
    createOrUpdateAircraftFeature,
    removeStaleAircraftFeatures,
    selectAircraft,
    deselectAircraft,
    isAircraftSelected,
    getSelectedAircraft,
    getRouteSet,
  };
}
