<template>
  <div class="flex flex-col">
    <span class="font-light text-sm">{{ label }}</span>
    <span class="text-3xl font-extrabold">{{ value }}</span>
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
