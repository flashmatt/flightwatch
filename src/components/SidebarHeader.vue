<template>
  <div class="bg-white">
    <div @click="$emit('expand')" class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2"></div>

    <div class="grid grid-cols-2 pt-4 px-4 pb-1">
      <div class="flex justify-start w-full gap-4">
        <airline-logo :icaoCode="aircraft.getPotentialAirlineCode()" class="py-2" />

        <div class = "flex flex-col">
          <span class="font-bold text-xl">{{aircraft.flight}}</span>
          <div>
            <span class="font-light text-neutral-600">Reg: </span>{{aircraft.registration}}
          </div>
            <div>
              <span class="font-light text-neutral-600">Type: </span>{{aircraft.aircraftType}}
            </div>



        </div>


      </div>
      <planespotters-photo :icao-code="aircraft.hex || ''" />
    </div>
    <aircraft-route
      v-if="route.length > 1"
      :route="route"
      :current-location="{ lat: aircraft.lat, lon: aircraft.lon }"
    />
  </div>




</template>

<script setup>

import PlanespottersPhoto from "./PlanespottersPhoto.vue";
import BaseInfoTile from "./BaseInfoTile.vue";
import AirlineLogo from "./AirlineLogo.vue";
import AircraftRoute from "./AircraftRoute.vue";

defineProps({
  aircraft: Object,
  route: Array,
});
defineEmits(["expand"]);
</script>

<style scoped>

</style>