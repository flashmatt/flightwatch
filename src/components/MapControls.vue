<template>
  <div
    class="max-md:hidden absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col space-y-4 z-10"
  >
    <!-- Map Control Buttons -->
    <map-control-button
      icon="mdi:crosshairs-gps"
      aria-label="Set to User Location"
      :on-click="setToUserLocation"
    />

    <div class="flex flex-col space-y-2">
      <map-control-button
        icon="mdi:plus"
        aria-label="Zoom In"
        :on-click="zoomIn"
      />
      <map-control-button
        icon="mdi:minus"
        aria-label="Zoom Out"
        :on-click="zoomOut"
      />
    </div>

    <map-control-button
      aria-label="settings"
      :on-click="toggleSettings"
      icon="material-symbols:settings"
    />

    <!-- Settings Container -->
    <div
      v-if="settingsOpen"
      class="absolute right-10 bottom-0 bg-white rounded-lg shadow-lg w-64 max-h-96 overflow-y-auto"
    >
      <div class="flex flex-col">
        <!-- Map Type Section as Accordion -->
        <AccordionSection
          title="Map Type"
          :isOpen="openAccordion === 'mapType'"
          @toggle="handleAccordionToggle('mapType')"
        >
          <div class="overflow-x-auto py-2">
            <div class="flex space-x-4 px-4">
              <!-- Base Layers Horizontal Scrollable Row -->
              <div
                v-for="(layer, name) in availableBaseLayers"
                :key="name"
                class="cursor-pointer border rounded-lg overflow-hidden shadow-md min-w-[8rem] flex-shrink-0"
                :class="{ 'border-blue-500': selectedMapType === name }"
                @click="setMapType(name)"
              >
                <img
                  :src="layer.preview"
                  :alt="name + ' Map'"
                  class="w-full h-20 object-cover"
                />
                <div class="p-2 text-center">{{ name }}</div>
              </div>
            </div>
          </div>
        </AccordionSection>

        <!-- Aircraft Display Settings Section as Accordion -->
        <AccordionSection
          title="Aircraft Display Settings"
          :isOpen="openAccordion === 'aircraftSettings'"
          @toggle="handleAccordionToggle('aircraftSettings')"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label for="show-flight-numbers">Show Flight Numbers</label>
              <input
                type="checkbox"
                id="show-flight-numbers"
                v-model="mapSettings.showFlightNumbers"
              />
            </div>
            <div class="flex items-center justify-between">
              <label for="show-airline-logos">Show Airline Logos</label>
              <input
                type="checkbox"
                id="show-airline-logos"
                v-model="mapSettings.showAirlineLogos"
              />
            </div>
          </div>
        </AccordionSection>
        <accordion-section
          title="Weather"
          :isOpen="openAccordion === 'weather'"
          @toggle="handleAccordionToggle('weather')"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label for="show-weather">Rain Radar</label>
              <input
                type="checkbox"
                id="show-weather"
                v-model="mapSettings.showRainRadar"
              />
            </div>
            <div class="flex items-center justify-between">
              <label for="show-weather-radar">Cloud Cover</label>
              <input
                type="checkbox"
                id="show-weather-radar"
                v-model="mapSettings.showCloudSatellite"
              />
            </div>
          </div>
        </accordion-section>
      </div>
    </div>
  </div>
</template>

<script setup>
import MapControlButton from "./MapControlButton.vue";
import AccordionSection from "./AccordionSection.vue";
import useMap from "../composables/useMap.js";
import useGeolocation from "../composables/useGeolocation.js";
import useAircraftData from "../composables/useAircraftData.js";
import useMapSettings from "../composables/useMapSettings.js";
import { ref } from "vue";

const { zoomIn, zoomOut, setCenter, setBaseLayer } = useMap();
const { getGeolocation } = useGeolocation();
const { stopFollowingAircraft } = useAircraftData();
const { mapSettings } = useMapSettings();

const setToUserLocation = () => {
  let lonlat = getGeolocation.value.getPosition();
  stopFollowingAircraft();
  setCenter(lonlat);
};

const settingsOpen = ref(false);
const selectedMapType = ref("DarkGray");
const openAccordion = ref(null); // Keeps track of the currently open accordion

const toggleSettings = () => {
  settingsOpen.value = !settingsOpen.value;
};

// Handle the accordion toggle to ensure only one is open
const handleAccordionToggle = (section) => {
  openAccordion.value = openAccordion.value === section ? null : section;
};

// Available map layers with preview images
const availableBaseLayers = {
  DarkGray: {
    preview: "/darkgray_preview.png",
    layer: "DarkGray",
  },
  StreetMap: {
    preview: "@/assets/streetmap_preview.jpg",
    layer: "StreetMap",
  },
  Satellite: {
    preview: "@/assets/satellite_preview.jpg",
    layer: "Satellite",
  },
  OpenStreetMap: {
    preview: "@/assets/osm_preview.jpg",
    layer: "OpenStreetMap",
  },
  CartoDB_Voyager: {
    preview: "@/assets/voyager_preview.jpg",
    layer: "CartoDB_Voyager",
  },
  CartoDB_DarkMatter: {
    preview: "@/assets/darkmatter_preview.jpg",
    layer: "CartoDB_DarkMatter",
  },
  CartoDB_Positron: {
    preview: "@/assets/positron_preview.jpg",
    layer: "CartoDB_Positron",
  },
};

const setMapType = (type) => {
  selectedMapType.value = type;
  setBaseLayer(type);
};
</script>
