<template>
  <div class="flex items-start lg:items-center lg:max-h-16 w-1/4 lg:w-full lg:justify-center">
    <img
      :src="airlineLogoUrl"
      alt="Airline logo"
      class="max-h-full object-contain"
    />
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  icaoCode: {
    type: String,
    required: true,
  },
});

const airlineLogoUrl = computed(() => {
  return `/logos/airline/${props.icaoCode}.svg`;
});
</script>

<style scoped></style>
