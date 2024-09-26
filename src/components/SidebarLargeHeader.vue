<template>
  <planespotters-photo :icao-code="aircraft.hex || ''" />
  <div
    class="grid grid-cols-3 divide-x divide-solid divide-neutral-300 bg-white sticky top-0 mb-4 shadow-lg z-10 max-h-16 border-b border-neutral-300"
  >
    <airline-logo :icaoCode="aircraft.getPotentialAirlineCode()" class="p-4" />
    <base-info-tile :value="aircraft.flight" label="Callsign" />
    <base-info-tile :value="aircraft.registration" label="Registration" />
  </div>
</template>

<script setup>

import PlanespottersPhoto from "./PlanespottersPhoto.vue";
import BaseInfoTile from "./BaseInfoTile.vue";
import AirlineLogo from "./AirlineLogo.vue";

defineProps({
  aircraft: Object,
});
</script>

<style scoped>

</style>