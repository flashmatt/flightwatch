<template>
  <div class="bg-white">
    <div
      @click="$emit('expand')"
      class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2"
    ></div>

    <div class="grid grid-cols-2 pt-4 px-4 pb-1">
      <div class="flex justify-start w-full gap-4">
        <airline-logo
          :icaoCode="aircraft.getPotentialAirlineCode()"
          class="py-2"
        />

        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <span class="font-bold text-xl">{{ aircraft.flight }}</span>
            <span
              class="text-xs font-light bg-green-200 rounded-xl py-0.5 px-2"
            >
              {{ aircraft.squawk }}</span
            >
          </div>

          <div>
            <span class="font-light text-neutral-600">Reg: </span
            >{{ aircraft.registration }}
          </div>
          <div>
            <span class="font-light text-neutral-600">Type: </span
            >{{ aircraft.aircraftType }}
          </div>
        </div>
      </div>
      <planespotters-photo :icao-code="aircraft.hex || ''" />
    </div>
    <div>
      <div
        class="grid grid-cols-3 divide-x divide-neutral-300 border-t border-neutral-300"
      >
        <div class="flex gap-2 items-center justify-center py-2">
          <Icon icon="material-symbols:altitude-rounded" class="w-5 h-5" />
          <span>{{ aircraft.getAltitude() }} ft</span>
        </div>
        <div class="flex gap-2 items-center justify-center">
          <Icon icon="mdi:compass-outline" class="w-5 h-5" />
          <span>{{ aircraft.trueHeading }} °</span>
        </div>
        <div class="flex gap-2 items-center justify-center">
          <Icon icon="material-symbols:speed-outline" class="w-5 h-5" />
          <span>{{ aircraft.gs }} kts</span>
        </div>
      </div>
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
import { Icon } from "@iconify/vue";

defineProps({
  aircraft: Object,
  route: Array,
});
defineEmits(["expand"]);
</script>

<style scoped></style>
