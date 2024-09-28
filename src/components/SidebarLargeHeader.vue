<template>
  <div
    v-if="actAsExpandable"
    @click="$emit('compact')"
    class="absolute w-full flex justify-center"
  >
    <div class="w-12 h-1.5 bg-gray-300 rounded-full mt-2 z-10"></div>
  </div>
  <planespotters-photo :icao-code="aircraft.hex || ''" :expanded="isExpanded" />
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
import { computed } from "vue";

const props = defineProps({
  aircraft: Object,
  expanded: Boolean,
  isDesktop: Boolean,
});
defineEmits(["compact"]);

const actAsExpandable = computed(() => {
  return !props.isDesktop && props.expanded;
});

const isExpanded = computed(() => props.isDesktop || props.expanded);
</script>

<style scoped></style>
