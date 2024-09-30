<template>
  <div class="flex items-center max-h-16 w-full justify-center">
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
  symbol: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const airlineLogoUrl = computed(() => {
  if (props.symbol) {
    return `/logos/airline_symbol/${props.icaoCode}.svg`;
  }
  return `/logos/airline/${props.icaoCode}.svg`;
});
</script>

<style scoped></style>
