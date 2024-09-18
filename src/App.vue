<template>
  <div class="relative h-screen w-screen">
    <navigation-bar />
    <aircraft-map />
    <aircraft-sidebar />
  </div>
</template>

<script setup>
import AircraftSidebar from "./components/AircraftSidebar.vue";
import AircraftMap from "./components/AircraftMap.vue";
import NavigationBar from "./components/NavigationBar.vue";
</script>
