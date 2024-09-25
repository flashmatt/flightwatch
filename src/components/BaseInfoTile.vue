<template>
  <div class="flex flex-col items-center py-2">
    <span class="font-extrabold tracking-widest">{{ value }}</span>
    <span class="text-sm font-light">{{ label }}</span>
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
