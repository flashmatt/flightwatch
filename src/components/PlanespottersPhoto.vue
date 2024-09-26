<template>
  <div class="relative inline-block w-full text-right">
    <div v-if="photo" class="flex flex-col items-end">
      <a :href="photo.link" target="_blank">
        <img
          :src="photo.thumbnail_large.src"
          :alt="`Photo by ${photo.photographer}`"
          class="max-lg:max-h-28 max-lg:rounded-xl block"
        />
      </a>
      <span
        class="lg:absolute lg:bottom-0 lg:right-2 lg:bg-black lg:bg-opacity-50 lg:text-white text-[10px] p-1 rounded w-fit"
      >Image © {{ photo.photographer }}</span
      >
    </div>
    <div v-else-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>No photo found</div>
  </div>
</template>


<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  icaoCode: {
    type: String,
    required: true,
  },
});

const loading = ref(false);
const photo = ref(null);
const error = ref(null);

const fetchPhoto = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(
      `https://api.planespotters.net/pub/photos/hex/${props.icaoCode}`,
    );
    const data = await response.json();

    if (data.error) {
      error.value = data.error;
      photo.value = null;
    } else {
      photo.value = data.photos.length > 0 ? data.photos[0] : null;
    }
  } catch (error) {
    error.value = "An error occurred while fetching the photo";
    photo.value = null;
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.icaoCode,
  () => {
    fetchPhoto();
  },
  { immediate: true },
);
</script>
