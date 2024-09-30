<template>
  <div id="map" class="relative z-0 h-screen w-screen">
    <map-controls />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import useMap from "../composables/useMap";
import useGeolocation from "../composables/useGeolocation";
import useAdsbData from "../composables/useAdsbData";
import useAircraftData from "../composables/useAircraftData.js";
import MapControls from "./MapControls.vue";

const { map, initializeMap, currentCenter, vectorSource } = useMap();

const { initializeGeolocation } = useGeolocation(map, vectorSource);

const {
  createOrUpdateAircraftFeature,
  removeStaleAircraftFeatures,
  selectAircraft,
  deselectAircraft,
} = useAircraftData(vectorSource);

const updateAircraftData = (newData) => {
  const newAircraftHexes = new Set();

  newData.forEach((aircraft) => {
    newAircraftHexes.add(aircraft.hex);
    createOrUpdateAircraftFeature(aircraft);
  });

  removeStaleAircraftFeatures(newAircraftHexes);
};

const { startFetching, stopFetching } = useAdsbData(
  currentCenter,
  updateAircraftData,
);

const handleMapClick = (event) => {
  let clickedAircraft = false;

  map.value.forEachFeatureAtPixel(event.pixel, (feature) => {
    const aircraftData = feature.getProperties();
    selectAircraft(aircraftData.meta);
    clickedAircraft = true;
  });

  if (!clickedAircraft) {
    deselectAircraft();
  }
};

onMounted(async () => {
  const initialCenter = { lat: 54.576459, lon: -1.246257 };

  await initializeMap("map", initialCenter, 8);
  initializeGeolocation();

  startFetching(); // Start the fetch loop

  map.value.on("click", handleMapClick);
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.un("click", handleMapClick);
    map.value.setTarget(null);
  }
  stopFetching(); // Stop the fetch loop when component unmounts
});
</script>

<style scoped>
.ol-zoom {
  right: 8px;
}
</style>
