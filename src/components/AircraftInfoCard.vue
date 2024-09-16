<template>
  <div class="bg-white rounded-xl">
    <div class="border-b p-4 flex gap-2 items-center">
      <Icon :icon="icon" class="w-5 h-5" />
      <h1 class="text-lg font-medium">{{ title }}</h1>
    </div>
    <div class="grid grid-cols-2 border-neutral-300">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
