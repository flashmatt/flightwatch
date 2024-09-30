<template>
  <div
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center md:justify-between h-20 w-screen bg-gradient-to-b from-gray-800 to-transparent px-4"
  >
    <div class="flex items-center space-x-2 px-4 group">
      <svg
        class="propeller w-10 h-10 fill-white"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M55.778,55.779c-3.191,3.189-8.365,3.189-11.56,0c-3.187-3.186-3.187-8.363,0-11.556c3.195-3.193,8.369-3.193,11.56,0
          C58.97,47.417,58.97,52.594,55.778,55.779z M61.635,43.822l26.164-20.063c0,0,8.828-7.547,2.409-13.969
          c-6.421-6.423-13.964,2.405-13.964,2.405L56.182,38.367l2.728,2.728L61.635,43.822z M87.799,76.251L61.635,56.188l-2.726,2.728
          l-2.728,2.729l20.062,26.164c0,0,7.543,8.822,13.967,2.396C96.627,83.783,87.799,76.251,87.799,76.251z M38.364,56.188
          L12.201,76.251c0,0-8.831,7.532-2.407,13.953c6.417,6.427,13.96-2.396,13.96-2.396l20.07-26.164l-2.729-2.729L38.364,56.188z
          M12.201,23.759l26.163,20.063l2.731-2.728l2.725-2.721L23.753,12.196c0,0-7.543-8.829-13.963-2.405
          C3.37,16.212,12.201,23.759,12.201,23.759z"
        />
      </svg>
      <span class="text-white font-medium text-2xl">FLIGHTWATCH</span>
    </div>

    <div class="max-md:hidden flex items-center space-x-4 px-4">
      <a
        href="#"
        class="text-white hover:text-gray-300 flex items-center gap-2"
      >
        <Icon icon="tabler:building-airport" class="w-6 h-6" />Airports
      </a>
      <a
        href="#"
        class="text-white hover:text-gray-300 flex items-center gap-2"
      >
        <Icon
          icon="material-symbols:airlines-rounded"
          class="w-6 h-6"
        />Airlines
      </a>
      <a
        href="#"
        class="text-white hover:text-gray-300 flex items-center gap-2"
      >
        <Icon icon="tabler:plane-tilt" class="w-6 h-6" />Aircraft
      </a>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
</script>

<style scoped>
.propeller {
  transform-origin: center;
  transition: transform 2s ease-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes decelerate-spin {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(720deg);
  }
}

.group:hover .propeller {
  animation: spin 1s linear infinite;
}

.group:not(:hover) .propeller {
  animation: decelerate-spin 2s ease-out forwards;
}
</style>
