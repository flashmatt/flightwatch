<template>
  <button
    @click="onClick"
    :aria-label="ariaLabel"
    class="bg-white rounded-lg p-2 shadow-md hover:bg-gray-100 focus:outline-none"
  >
    <Icon :icon="icon" />
  </button>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { defineProps } from "vue";

defineProps({
  icon: {
    type: String,
    required: true,
  },
  ariaLabel: {
    type: String,
    required: true,
  },
  onClick: {
    type: Function,
    required: true,
  },
});
</script>

<style scoped></style>
