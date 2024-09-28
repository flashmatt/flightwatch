<template>
  <div class="relative inline-block w-full text-right">
    <div v-if="photo" class="flex flex-col items-end">
      <a :href="photo.link" target="_blank">
        <img
          :src="photo.thumbnail_large.src"
          :alt="`Photo by ${photo.photographer}`"
          class=""
          :class="{ 'max-lg:max-h-20 max-lg:rounded-xl': !expanded }"
        />
      </a>
      <span
        class="text-[10px] py-1 px-2 rounded w-fit"
        :class="{
          'absolute top-2 right-2 bg-black bg-opacity-50 text-white': expanded,
        }"
        >Image © {{ photo.photographer }}</span
      >
    </div>
    <div v-else-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div
      v-else
      class="flex flex-col items-center justify-center h-[200px]"
      :class="{ 'lg:h-[300px]': expanded }"
    >
      <div
        v-if="expanded"
        class="w-full h-full bg-cover bg-bottom"
        :style="{ backgroundImage: `url('/noimage.jpg')` }"
      >
        <p class="text-gray-500 mt-4 text-center">
          No photo found for this aircraft.
        </p>
      </div>
      <p v-else class="text-gray-500 mt-4">No photo found for this aircraft.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  icaoCode: {
    type: String,
    required: true,
  },
  expanded: {
    type: Boolean,
    required: false,
    default: false,
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
