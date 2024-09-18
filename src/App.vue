<template>
  <div class="container relative h-screen w-screen">
    <aircraft-map class="z-0" />
    <aircraft-sidebar class="z-10" />
  </div>
</template>

<script setup>
import AircraftSidebar from "./components/AircraftSidebar.vue";
import AircraftMap from "./components/AircraftMap.vue";
</script>
