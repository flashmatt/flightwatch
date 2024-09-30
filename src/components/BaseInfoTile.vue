<template>
  <div class="flex flex-col items-center py-2">
    <span class="tracking-wider">{{ value }}</span>
    <span class="font-light text-neutral-600 text-sm">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
