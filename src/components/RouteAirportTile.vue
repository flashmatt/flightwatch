<template>
  <div class="flex flex-col">
    <span class="text-4xl font-extrabold">{{ value }}</span>
    <span class="font-light">{{ label }}</span>
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
