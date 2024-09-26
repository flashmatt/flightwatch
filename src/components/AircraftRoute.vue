<template>
  <div class="flex flex-col items-center bg-white lg:rounded-xl py-2 px-4 max-lg:border-t border-neutral-300">
    <div class="flex justify-between w-full">
      <span class="font-light text-sm">{{ route[0].location }}</span>
      <span class="font-light text-sm">{{ route[1].location }}</span>
    </div>
    <div class="flex w-full items-center">
      <span class="text-3xl font-extrabold">{{ route[0].iata }}</span>

      <div class="flex items-center justify-center flex-grow p-4">
        <div class="w-3 h-3 rounded-full bg-green-400"></div>

        <div
          class="flex-grow border-t-2 border-gray-400 border-dashed mx-2 relative"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 rotate-90 absolute -top-4"
            :style="{ left: `${percentage}%` }"
            viewBox="0 0 32 32"
          >
            <path
              d="M16 1c-.17 0-.67.58-.9 1.03-.6 1.21-.6 1.15-.65 5.2-.04 2.97-.08 3.77-.18 3.9-.15.17-1.82 1.1-1.98 1.1-.08 0-.1-.25-.05-.83.03-.5.01-.92-.05-1.08-.1-.25-.13-.26-.71-.26-.82 0-.86.07-.78 1.5.03.6.08 1.17.11 1.25.05.12-.02.2-.25.33l-8 4.2c-.2.2-.18.1-.19 1.29 3.9-1.2 3.71-1.21 3.93-1.21.06 0 .1 0 .13.14.08.3.28.3.28-.04 0-.25.03-.27 1.16-.6.65-.2 1.22-.35 1.28-.35.05 0 .12.04.15.17.07.3.27.27.27-.08 0-.25.01-.27.7-.47.68-.1.98-.09 1.47-.1.18 0 .22 0 .26.18.06.34.22.35.27-.01.04-.2.1-.17 1.06-.14l1.07.02.05 4.2c.05 3.84.07 4.28.26 5.09.11.49.2.99.2 1.11 0 .19-.31.43-1.93 1.5l-1.93 1.26v1.02l4.13-.95.63 1.54c.05.07.12.09.19.09s.14-.02.19-.09l.63-1.54 4.13.95V29.3l-1.93-1.27c-1.62-1.06-1.93-1.3-1.93-1.49 0-.12.09-.62.2-1.11.19-.81.2-1.25.26-5.09l.05-4.2 1.07-.02c.96-.03 1.02-.05 1.06.14.05.36.21.35.27 0 .04-.17.08-.16.26-.16.49 0 .8-.02 1.48.1.68.2.69.21.69.46 0 .35.2.38.27.08.03-.13.1-.17.15-.17.06 0 .63.15 1.28.34 1.13.34 1.16.36 1.16.61 0 .35.2.34.28.04.03-.13.07-.14.13-.14.22 0 .03 0 3.93 1.2-.01-1.18.02-1.07-.19-1.27l-8-4.21c-.23-.12-.3-.21-.25-.33.03-.08.08-.65.11-1.25.08-1.43.04-1.5-.78-1.5-.58 0-.61.01-.71.26-.06.16-.08.58-.05 1.08.04.58.03.83-.05.83-.16 0-1.83-.93-1.98-1.1-.1-.13-.14-.93-.18-3.9-.05-4.05-.05-3.99-.65-5.2C16.67 1.58 16.17 1 16 1z"
            />
          </svg>
        </div>

        <div class="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      <span class="text-3xl font-extrabold">{{ route[1].iata }}</span>
    </div>
    <div class="flex justify-between w-full">
      <span class="font-light text-sm"
        >{{ departureDistance.toFixed(2) }} NM</span
      >
      <span class="font-light text-sm"
        >{{ arrivalDistance.toFixed(2) }} NM</span
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  route: {
    type: Array,
    required: true,
  },
  currentLocation: {
    type: Object,
    required: true,
  },
});

const departureDistance = computed(() => {
  const departure = props.route[0];
  return haversineDistance(
    departure.lat,
    departure.lon,
    props.currentLocation.lat,
    props.currentLocation.lon,
  );
});

const arrivalDistance = computed(() => {
  const arrival = props.route[1];
  return haversineDistance(
    arrival.lat,
    arrival.lon,
    props.currentLocation.lat,
    props.currentLocation.lon,
  );
});

const initialDistance = computed(() => {
  const departure = props.route[0];
  const arrival = props.route[1];
  return haversineDistance(
    departure.lat,
    departure.lon,
    arrival.lat,
    arrival.lon,
  );
});

const percentage = computed(() => {
  if (initialDistance.value === 0) return 0;
  let percentage =
    ((initialDistance.value - arrivalDistance.value) / initialDistance.value) *
    100;

  return Math.min(Math.max(percentage, 0), 100);
});

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3440.065; //NM
  const toRadians = (angle) => angle * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
</script>

<style scoped></style>
