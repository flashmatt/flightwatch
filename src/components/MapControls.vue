<template>
  <div
    class="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col space-y-4 z-10"
  >
    <button
      @click="setToUserLocation"
      aria-label="Zoom In"
      class="bg-white rounded-lg p-2 shadow-md hover:bg-gray-100 focus:outline-none mb-2"
    >
      <Icon icon="mdi:crosshairs-gps" />
    </button>
    <div class="flex flex-col space-y-2">
      <button
        @click="zoomIn"
        aria-label="Zoom In"
        class="bg-white rounded-lg p-2 shadow-md hover:bg-gray-100 focus:outline-none"
      >
        <Icon icon="mdi:plus" />
      </button>

      <button
        @click="zoomOut"
        aria-label="Zoom Out"
        class="bg-white rounded-lg p-2 shadow-md hover:bg-gray-100 focus:outline-none"
      >
        <Icon icon="mdi:minus" />
      </button>
    </div>

  </div>
</template>

<script setup>

import { Icon } from "@iconify/vue";
import useMap from "../composables/useMap.js";
import useGeolocation from "../composables/useGeolocation.js";

const { zoomIn, zoomOut, setCenter } = useMap();
const { getGeolocation } = useGeolocation();

const setToUserLocation = () => {
  let lonlat = getGeolocation.value.getPosition();
  setCenter(lonlat);
};

</script>

<style scoped>

</style>