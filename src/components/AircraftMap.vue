<template>
  <div id="map" class="w-screen h-screen"></div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.glify';
import axios from 'axios';
import useAircraft from '../composables/useAircraft';

const map = ref(null);
const pointsLayer = ref(null);
let updateTimeout = null;
let dataInterval = null;

const { updateSelectedAircraft, selectAircraft, isAircraftSelected, getSelectedAircraft:selected} = useAircraft();

onMounted(() => {
  initializeMap();
  initializePointsLayer();
  startDataPolling();
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove();
  }
  if (dataInterval) {
    clearInterval(dataInterval);
  }
});

const initializeMap = () => {
  map.value = L.map('map').setView([54.576459, -1.246257], 8);
  map.value.zoomControl.setPosition('bottomright');
  L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
            '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
      }
  ).addTo(map.value);
};

const initializePointsLayer = () => {

  pointsLayer.value = L.glify.points({
    map: map.value,
    click: (e, point) => {
      updateSelectedAircraft(point);
      selectAircraft();
    },
    data: [], // Initialize with empty array
    size: 20,
    color: [0, 0, 1, 1],
  });

};

const startDataPolling = () => {
  fetchAdsbData();
  dataInterval = setInterval(fetchAdsbData, 10000); // Fetch every 10 seconds
};

const fetchAdsbData = async () => {
  try {
    const response = await axios.get(
        '/api/v2/lat/54.576459/lon/-1.246257/dist/100'
    );

    const newData = processApiResponse(response.data);

    updateAircraftData(newData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const processApiResponse = (data) => {
  if (!data.ac) {
    return [];
  }

  // Map aircraft data into a structured format
  return data.ac
      .filter((aircraft) => aircraft.lat != null && aircraft.lon != null)
      .map((aircraft) => [
        aircraft.lat,                  // Latitude
        aircraft.lon,                  // Longitude
        aircraft.hex,                  // ICAO identifier (hex)
        aircraft.type,                 // Type of data (e.g. adsb_icao, mlat)
        aircraft.flight,               // Callsign/Flight name
        aircraft.r,                    // Aircraft registration (optional db field)
        aircraft.t,                    // Aircraft type (optional db field)
        aircraft.alt_baro,             // Barometric altitude
        aircraft.alt_geom,             // Geometric altitude
        aircraft.gs,                   // Ground speed
        aircraft.ias,                  // Indicated air speed
        aircraft.tas,                  // True air speed
        aircraft.mach,                 // Mach number
        aircraft.wd,                   // Wind direction
        aircraft.ws,                   // Wind speed
        aircraft.oat,                  // Outer air temperature
        aircraft.tat,                  // Total air temperature
        aircraft.track,                // True track over ground
        aircraft.track_rate,           // Rate of change of track
        aircraft.roll,                 // Roll
        aircraft.mag_heading,          // Magnetic heading
        aircraft.true_heading,         // True heading
        aircraft.baro_rate,            // Rate of change of barometric altitude
        aircraft.geom_rate,            // Rate of change of geometric altitude
        aircraft.squawk,               // Squawk code
        aircraft.emergency,            // Emergency status
        aircraft.category,             // Emitter category
        aircraft.nav_qnh,              // Altimeter setting (QNH/QNE)
        aircraft.nav_altitude_mcp,     // Selected altitude from MCP/FCU
        aircraft.nav_altitude_fms,     // Selected altitude from FMS
        aircraft.nav_modes,            // Engaged automation modes
        aircraft.nic,                  // Navigation Integrity Category
        aircraft.rc,                   // Radius of Containment
        aircraft.seen_pos,             // Time since position was last updated
        aircraft.version,              // ADS-B Version
        aircraft.nic_baro,             // NIC for Barometric Altitude
        aircraft.nac_p,                // Navigation Accuracy for Position
        aircraft.nac_v,                // Navigation Accuracy for Velocity
        aircraft.sil,                  // Source Integrity Level
        aircraft.sil_type,             // Interpretation of SIL (perhour, persample)
        aircraft.gva,                  // Geometric Vertical Accuracy
        aircraft.sda,                  // System Design Assurance
        aircraft.alert,                // Flight status alert bit
        aircraft.spi,                  // Special position identification bit
        aircraft.mlat,                 // Fields derived from MLAT data
        aircraft.tisb,                 // Fields derived from TIS-B data
        aircraft.messages,             // Total number of messages received
        aircraft.seen,                 // Time since a message was last received
        aircraft.rssi,                 // Recent average RSSI
        aircraft.rr_lat,               // Rough estimated latitude (if no ADS-B or MLAT available)
        aircraft.rr_lon,               // Rough estimated longitude (if no ADS-B or MLAT available)
        aircraft.dst,                  // Distance (optional field)
        aircraft.dir,                  // Direction (optional field)
        aircraft.lastPosition?.lat,    // Last known valid latitude
        aircraft.lastPosition?.lon,    // Last known valid longitude
        aircraft.lastPosition?.nic,    // Last known valid NIC
        aircraft.lastPosition?.rc,     // Last known valid Radius of Containment
        aircraft.lastPosition?.seen_pos, // Time since last known position
        aircraft.dbFlags,              // Bitfield for specific database flags
        aircraft.acas_ra,              // ACAS/TCAS Resolution Advisory (experimental)
        aircraft.gpsOkBefore           // GPS degraded/lost timestamp (experimental)
      ]);


};


const updateAircraftData = (newData) => {

  if (!updateTimeout) {
    updateTimeout = setTimeout(() => {

      pointsLayer.value.setData(newData);
      if (isAircraftSelected) {
        const aircraftToUpdate = newData.find((point) => point[2] === selected.value.hex);
        if (aircraftToUpdate) {
          updateSelectedAircraft(aircraftToUpdate);
        }
      }

      updateTimeout = null;
    }, 500);
  }
};
</script>

<style scoped>

</style>
