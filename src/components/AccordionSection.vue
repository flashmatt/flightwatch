<template>
  <div class="accordion-section">
    <div
      @click="toggleOpen"
      class="accordion-header border-t border-b border-neutral-300 p-4 cursor-pointer flex items-center justify-between"
    >
      <span class="font-medium">{{ title }}</span>
      <span
        :class="{ 'rotate-180': isOpen }"
        class="transform transition-transform duration-300"
        >▼</span
      >
    </div>
    <div
      ref="content"
      class="accordion-content overflow-hidden transition-all duration-500 ease-in-out"
      :style="{ height: isOpen ? contentHeight : '0px' }"
    >
      <div ref="innerContent" class="p-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  defaultOpen: {
    type: Boolean,
    default: false,
  },
});

const isOpen = ref(props.defaultOpen);
const contentHeight = ref("0px");
const content = ref(null);
const innerContent = ref(null);

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
  updateHeight();
};

const updateHeight = () => {
  if (isOpen.value) {
    contentHeight.value = innerContent.value.scrollHeight + "px";
  } else {
    contentHeight.value = "0px";
  }
};

watch(isOpen, () => {
  updateHeight();
});

onMounted(() => {
  updateHeight();
});
</script>

<style scoped>
.accordion-header span {
  transition: transform 0.3s;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
