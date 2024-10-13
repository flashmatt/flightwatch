<template>
  <div id="map" class="relative z-0 h-screen w-screen">
    <map-controls />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import useMap from "../composables/useMap";
import useGeolocation from "../composables/useGeolocation";
import useAdsbData from "../composables/useAdsbData";
import useAircraftData from "../composables/useAircraftData.js";
import MapControls from "./MapControls.vue";
import useMapSettings from "../composables/useMapSettings.js";
import useWeatherLayer from "../composables/useWeatherLayer.js";

const { map, initializeMap, currentCenter, vectorSource } = useMap();

const { initializeGeolocation } = useGeolocation(map, vectorSource);

const { mapSettings } = useMapSettings();

const hoveredAircraftHex = ref(null);

const {
  createOrUpdateAircraftFeature,
  removeStaleAircraftFeatures,
  selectAircraft,
  deselectAircraft,
} = useAircraftData(vectorSource, hoveredAircraftHex);

const {
  radarTimestamp,
  satellitePath,
  getWeatherSnapshot,
  addWeatherLayerToMap,
  removeWeatherLayerFromMap,
} = useWeatherLayer();

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

const handlePointerMove = (event) => {
  const pixel = map.value.getEventPixel(event.originalEvent);
  let featureFound = false;

  map.value.forEachFeatureAtPixel(
    pixel,
    (feature) => {
      const aircraft = feature.get("meta");
      hoveredAircraftHex.value = aircraft.hex;
      featureFound = true;
      return true; // Stop iteration after finding the first feature
    },
    {
      hitTolerance: 10,
    },
  );

  if (!featureFound) {
    hoveredAircraftHex.value = null;
  }
};

onMounted(async () => {
  const initialCenter = { lat: 54.576459, lon: -1.246257 };

  await initializeMap("map", initialCenter, 8);
  initializeGeolocation();

  startFetching(); // Start the fetch loop

  getWeatherSnapshot().then(() => {
    if (mapSettings.showRainRadar) {
      addWeatherLayerToMap(map.value, "radar", radarTimestamp.value);
    }

    if (mapSettings.showCloudSatellite) {
      addWeatherLayerToMap(map.value, "satellite", satellitePath.value);
    }
  });

  map.value.on("click", handleMapClick);

  map.value.on("pointermove", handlePointerMove);
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.un("click", handleMapClick);
    map.value.setTarget(null);
  }
  stopFetching(); // Stop the fetch loop when component unmounts
});

watch(
  () => mapSettings.showRainRadar,
  (newValue) => {
    if (newValue) {
      addWeatherLayerToMap(map.value, "radar", radarTimestamp.value);
    } else {
      removeWeatherLayerFromMap(map.value, "radar");
    }
  },
);

watch(
  () => mapSettings.showCloudSatellite,
  (newValue) => {
    if (newValue) {
      addWeatherLayerToMap(map.value, "satellite", satellitePath.value);
    } else {
      removeWeatherLayerFromMap(map.value, "satellite");
    }
  },
);
</script>

<style scoped>
.ol-zoom {
  right: 8px;
}
</style>
