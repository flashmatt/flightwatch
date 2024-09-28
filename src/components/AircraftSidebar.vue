<template>
  <transition :name="isDesktop ? 'slide-fade' : 'slide-fade-bottom'">
    <aside
      v-if="isAircraftSelected"
      class="absolute bottom-0 md:left-6 md:bottom-6 lg:top-20 flex flex-col w-full md:w-[430px] lg:w-96 bg-neutral-200 rounded-t-2xl md:rounded-b-2xl overflow-hidden shadow-2xl transition-all duration-1000 ease-in-out"
      :class="{
        'sidebar-max': isExpanded || isDesktop,
        'sidebar-min': !isExpanded && !isDesktop,
      }"
    >
      <div class="flex flex-col overflow-y-scroll">
        <sidebar-large-header
          v-if="isDesktop || isExpanded"
          :aircraft="aircraft"
          :expanded="isExpanded"
          :isDesktop="isDesktop"
          v-on:compact="toggleSidebarExpand"
        />
        <sidebar-header
          v-else
          :aircraft="aircraft"
          :route="routeSet"
          v-on:expand="toggleSidebarExpand"
        />
        <div
          v-show="isExpanded || isDesktop"
          class="px-4 flex flex-col gap-4 pb-2"
        >
          <aircraft-route
            v-if="routeSet.length > 1"
            :route="routeSet"
            :current-location="{ lat: aircraft.lat, lon: aircraft.lon }"
          />
          <aircraft-info-card title="Live Info" icon="lucide:radio-tower">
            <base-stats-tile
              :value="aircraft.getAltitude()"
              label="Altitude"
              units="ft"
              class="border-b border-neutral-300 border-r"
            />
            <base-stats-tile
              :value="aircraft.gs"
              label="Ground Speed"
              units="knots"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.trueHeading"
              label="Heading"
              units="°"
              class="border-r border-neutral-300 border-b"
            />
            <base-stats-tile
              :value="aircraft.geomRate || aircraft.baroRate"
              label="Vertical Speed"
              units="ft/min"
              class="border-neutral-300 border-b"
            />
            <base-stats-tile
              :value="aircraft.squawk"
              label="SQUAWK"
              class="border-r"
            />
            <base-stats-tile
              :value="aircraft.emergency"
              label="Emergency"
              class="border-r"
            />
          </aircraft-info-card>

          <aircraft-info-card title="Aircraft" icon="mdi:airplane">
            <manufacturer-logo class="border-b border-neutral-300 border-r" />
            <base-stats-tile
              :value="aircraft.aircraftType"
              label="Type"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.registration"
              label="Registration"
              class="border-r border-neutral-300 border-b"
            />
            <country-flag class="border-neutral-300 border-b" />
            <base-stats-tile
              :value="aircraft.hex"
              label="ICAO Hex"
              class="border-r border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.category"
              label="Category"
              class="border-r"
            />
          </aircraft-info-card>

          <aircraft-info-card
            title="Weather"
            icon="material-symbols:cloud-outline"
          >
            <base-stats-tile
              :value="aircraft.ws"
              label="Wind Speed"
              units="knots"
              class="border-b border-neutral-300 border-r"
            />
            <base-stats-tile
              :value="aircraft.wd"
              label="Wind Direction"
              units="°"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.oat"
              label="Air Temp"
              units="°C"
              class="border-r border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.tat"
              label="Outside Air Temp"
              units="°C"
            />
          </aircraft-info-card>

          <aircraft-info-card
            title="Speed"
            icon="material-symbols:speed-outline"
          >
            <base-stats-tile
              :value="aircraft.gs"
              label="Ground Speed"
              units="knots"
              class="border-b border-neutral-300 border-r"
            />
            <base-stats-tile
              :value="aircraft.tas"
              label="True Air Speed"
              units="knots"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.ias"
              label="Indicated Air Speed"
              units="knots"
              class="border-r border-neutral-300"
            />
            <base-stats-tile :value="aircraft.mach" label="Mach" units="mach" />
          </aircraft-info-card>

          <aircraft-info-card
            title="Altitude"
            icon="material-symbols:altitude-outline-rounded"
          >
            <base-stats-tile
              :value="aircraft.altBaro"
              label="Barometric Alt."
              units="ft"
              class="border-b border-neutral-300 border-r"
            />
            <base-stats-tile
              :value="aircraft.altGeom"
              label="Geometric Alt (WGS84)"
              units="ft"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.geomRate || aircraft.baroRate"
              label="Vertical Speed"
              units="ft/min"
              class="border-r border-neutral-300 border-b"
            />
            <base-stats-tile
              :value="aircraft.navQnh"
              label="QNH"
              units="hPa"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.navAltitudeMcp"
              label="Selected Alt (MCP)"
              units="ft"
              class="border-r border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.navAltitudeFms"
              label="Selected Altitude (FMS)"
              units="ft"
              class=""
            />
          </aircraft-info-card>

          <aircraft-info-card title="Direction" icon="mdi:compass-outline">
            <base-stats-tile
              :value="aircraft.track"
              label="Ground Track"
              units="°"
              class="border-b border-neutral-300 border-r"
            />
            <base-stats-tile
              :value="aircraft.trueHeading"
              label="True Heading"
              units="°"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.magHeading"
              label="Magnetic Heading"
              units="°"
              class="border-r border-neutral-300 border-b"
            />
            <base-stats-tile
              :value="aircraft.trackRate"
              label="Track Rate"
              units="°/s"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.roll"
              label="Roll"
              units="°"
              class="border-r border-neutral-300"
            />
          </aircraft-info-card>

          <aircraft-info-card
            title="Navigation & Integrity"
            icon="mdi:gps-fixed"
          >
            <base-stats-tile
              :value="aircraft.nic"
              label="NIC (Nav Integrity Cat)"
              class="border-b border-neutral-300 border-r"
            />
            <base-stats-tile
              :value="aircraft.rc"
              label="Radius of Containment"
              units="m"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.nacP"
              label="NAC Position"
              class="border-r border-neutral-300 border-b"
            />
            <base-stats-tile
              :value="aircraft.nacV"
              label="NAC Velocity"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.sil"
              label="SIL (Src Integrity Lvl)"
              class="border-b border-r border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.silType"
              label="SIL Type"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.gva"
              label="Geometric Vert Acc."
              units="m"
              class="border-r border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.sda"
              label="System Design Assur."
            />
          </aircraft-info-card>

          <aircraft-info-card
            title="Data Source"
            icon="mdi:signal-cellular-outline"
          >
            <base-stats-tile
              :value="aircraft.type"
              label="Source"
              class="border-b border-neutral-300 border-r"
            />
            <base-stats-tile
              :value="aircraft.rssi"
              label="RSSI"
              units="dB"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.messages"
              label="Message Rate"
              units="msg/s"
              class="border-r border-neutral-300 border-b"
            />
            <base-stats-tile
              :value="aircraft.seen"
              label="Last Seen"
              units="s"
            />
          </aircraft-info-card>

          <aircraft-info-card title="Alerts & Status" icon="mdi:alert-outline">
            <base-stats-tile
              :value="aircraft.alert"
              label="Alert"
              class="border-b border-neutral-300 border-r"
            />
            <base-stats-tile
              :value="aircraft.spi"
              label="SPI (Special Pos Ident)"
              class="border-b border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.acasRa"
              label="ACAS RA"
              class="border-r border-neutral-300"
            />
            <base-stats-tile
              :value="aircraft.gpsOkBefore"
              label="GPS Last OK"
              units="s"
            />
          </aircraft-info-card>
        </div>
        <div
          class="grid grid-cols-2 divide-x divide-solid divide-neutral-300 bg-white sticky bottom-0 lg:shadow-t-lg z-10 lg:mt-2 border-t border-neutral-300"
        >
          <button
            @click="toggleFollowAircraft"
            class="flex p-4 gap-4 justify-center items-center"
          >
            <Icon
              :icon="
                isFollowingAircraft ? 'mdi:pin-off-outline' : 'mdi:pin-outline'
              "
              class="text-xl"
            />
            <span v-if="!isFollowingAircraft" class="font-medium">Follow</span>
            <span v-else class="font-medium">Unfollow</span>
          </button>

          <button class="flex p-4 gap-4 justify-center items-center">
            <Icon icon="material-symbols:route" class="text-xl" />
            <span class="font-medium">Show Route</span>
          </button>
        </div>
      </div>
    </aside>
  </transition>
</template>

<script setup>
import AircraftRoute from "./AircraftRoute.vue";
import AircraftInfoCard from "./AircraftInfoCard.vue";
import BaseStatsTile from "./BaseStatsTile.vue";
import ManufacturerLogo from "./ManufacturerLogo.vue";
import CountryFlag from "./CountryFlag.vue";
import useAircraftData from "../composables/useAircraftData.js";
import { Icon } from "@iconify/vue";
import { ref, watch, onMounted } from "vue";
import SidebarLargeHeader from "./SidebarLargeHeader.vue";
import SidebarHeader from "./SidebarHeader.vue";
import useResponsive from "../composables/useResponsive.js";

const {
  getSelectedAircraft: aircraft,
  isAircraftSelected,
  getRouteSet: routeSet,
  toggleFollowAircraft,
  isFollowingAircraft,
} = useAircraftData();

const isExpanded = ref(false); // Controls if the sidebar is fully expanded on small screens

const { isDesktop } = useResponsive();
const toggleSidebarExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
/* Default slide from left */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide from bottom for mobile */
.slide-fade-bottom-enter-active,
.slide-fade-bottom-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-bottom-enter-from,
.slide-fade-bottom-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Custom max-height values for expanded and collapsed states */
.sidebar-max {
  max-height: 89vh;
}

.sidebar-min {
  max-height: 400px;
}

/* Optional: add a smoother overflow handling */
.overflow-hidden {
  overflow: hidden;
}
</style>
