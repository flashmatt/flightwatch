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
});

const airlineLogoUrl = computed(() => {
  return `/logos/airline/${props.icaoCode}.svg`;
});
</script>

<style scoped></style>
