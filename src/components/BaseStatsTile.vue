<template>
  <div class="flex flex-col px-4 py-2">
    <span class="font-light text-neutral-600 text-sm">{{ label }}</span>
    <div class="relative overflow-hidden h-6">
      <span
        class="inline-block relative transition-transform duration-800 ease-out"
        ref="odometer"
      >
        {{ animatedValue }} {{ units }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  value: {
    type: [String, Number, null, Boolean],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  units: {
    type: String,
    default: "",
  },
});

const animatedValue = ref(props.value); // The displayed value with animation

// Watch for changes in the value prop and animate the change
watch(
  () => props.value,
  (newValue) => {
    // Update the animated value after detecting the change
    requestAnimationFrame(() => {
      animatedValue.value = newValue;
    });
  },
);
</script>

<style scoped></style>
