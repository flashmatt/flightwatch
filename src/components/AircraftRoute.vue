<template>
  <div class="flex justify-between bg-white rounded-xl py-2 px-4">
    <route-airport-tile :value="route[0].iata" :label="route[0].location" />
    <route-airport-tile :value="route[1].iata" :label="route[1].location" />
  </div>
</template>

<script setup>
import RouteAirportTile from "./RouteAirportTile.vue";

defineProps({
  route:{
    type: Array,
    required: true
  }
})
</script>

<style scoped></style>
