<template>
  <div
    class="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col space-y-4 z-10"
  >
    <map-control-button
      icon="mdi:crosshairs-gps"
      aria-label="Set to User Location"
      :on-click="setToUserLocation"
    />

    <div class="flex flex-col space-y-2">
      <map-control-button
        icon="mdi:plus"
        aria-label="Zoom In"
        :on-click="zoomIn"
      />

      <map-control-button
        icon="mdi:minus"
        ariaLabel="Zoom Out"
        :on-click="zoomOut"
      />
    </div>
    <map-control-button
      aria-label="settings"
      :on-click="openSettings"
      icon="material-symbols:settings"
    />
  </div>
</template>

<script setup>
import MapControlButton from "./MapControlButton.vue";
import useMap from "../composables/useMap.js";
import useGeolocation from "../composables/useGeolocation.js";
import useAircraftData from "../composables/useAircraftData.js";

const { zoomIn, zoomOut, setCenter } = useMap();
const { getGeolocation } = useGeolocation();
const { stopFollowingAircraft } = useAircraftData();

const setToUserLocation = () => {
  let lonlat = getGeolocation.value.getPosition();
  stopFollowingAircraft();
  setCenter(lonlat);
};

const openSettings = () => {
  console.log("open settings");
};
</script>

<style scoped></style>
