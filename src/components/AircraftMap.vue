<template>
  <div id="map" class="w-screen h-screen"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import "ol/ol.css";
import useMap from "../composables/useMap";
import useGeolocation from "../composables/useGeolocation";
import useAdsbData from "../composables/useAdsbData";
import useAircraftFeatures from "../composables/useAircraftFeatures";
import useAircraft from "../composables/useAircraft";

const { map, initializeMap, currentCenter, vectorSource } = useMap();

const { initializeGeolocation } = useGeolocation(map, vectorSource);

const { createOrUpdateAircraftFeature, removeStaleAircraftFeatures } =
  useAircraftFeatures(vectorSource);

const {
  selectAircraft,
  isAircraftSelected,
  getSelectedAircraft: selectedAircraft,
  updateSelectedAircraft,
  deselectAircraft,
} = useAircraft();

const updateAircraftData = (newData) => {
  const newAircraftHexes = new Set();

  newData.forEach((aircraft) => {
    newAircraftHexes.add(aircraft.hex);
    createOrUpdateAircraftFeature(aircraft);

    if (
      isAircraftSelected.value &&
      aircraft.hex === selectedAircraft.value.hex
    ) {
      updateSelectedAircraft(aircraft);
    }
  });

  removeStaleAircraftFeatures(newAircraftHexes);

  map.value.render();
};

const { fetchAdsbData } = useAdsbData(currentCenter, updateAircraftData);

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

  fetchAdsbData();

  map.value.on("click", handleMapClick);
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.un("click", handleMapClick);
    map.value.setTarget(null);
  }
});
</script>

<style scoped></style>
