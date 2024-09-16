<template>
  <aside
    v-if="isAircraftSelected"
    class="absolute left-6 top-6 flex flex-col w-96 h-[94vh] mb-12 bg-neutral-200 rounded-2xl overflow-hidden shadow-2xl"
  >
    <div class="flex flex-col pb-2 overflow-y-scroll">
      <planespotters-photo :icao-code="aircraft.hex || ''" />
      <div
        class="grid grid-cols-3 divide-x divide-solid divide-neutral-200 bg-white sticky top-0 mb-4 shadow-lg"
      >
        <airline-logo :icao-code="aircraft.hex" />
        <base-info-tile :value="aircraft.flight" label="Callsign" />
        <base-info-tile :value="aircraft.registration" label="Registration" />
      </div>
      <div class="px-4 flex flex-col gap-4 pb-2">
        <aircraft-route :route="aircraft.airports" />
        <aircraft-info-card title="Live Info" icon="lucide:radio-tower">
          <base-stats-tile
            :value="aircraft.altBaro"
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
            :value="aircraft.track"
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

        <aircraft-info-card title="Speed" icon="material-symbols:speed-outline">
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
            label="Barometric Altitude"
            units="ft"
            class="border-b border-neutral-300 border-r"
          />
          <base-stats-tile
            :value="aircraft.altGeom"
            label="Geometric Altitude (WGS84)"
            units="ft"
            class="border-b border-neutral-300"
          />
          <base-stats-tile
            :value="aircraft.geomRate || aircraft.baroRate"
            label="Vertical Speed"
            units="ft/min"
            class="border-r border-neutral-300"
          />
          <base-stats-tile :value="aircraft.navQnh" label="QNH" units="hPa" />
          <base-stats-tile
            :value="aircraft.navAltitudeMcp"
            label="Selected Altitude (MCP)"
            units="ft"
            class="border-b border-neutral-300"
          />
          <base-stats-tile
            :value="aircraft.navAltitudeFms"
            label="Selected Altitude (FMS)"
            units="ft"
            class="border-b border-neutral-300"
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
            class="border-r border-neutral-300"
          />
          <base-stats-tile :value="aircraft.roll" label="Roll" units="°" />
        </aircraft-info-card>

        <aircraft-info-card title="Automation" icon="mdi:autorenew">
          <base-stats-tile
            :value="aircraft.navModes"
            label="Automation Modes"
            class="border-b border-neutral-300 border-r"
          />
        </aircraft-info-card>

        <aircraft-info-card title="Navigation & Integrity" icon="mdi:gps-fixed">
          <base-stats-tile
            :value="aircraft.nic"
            label="NIC (Navigation Integrity Category)"
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
            class="border-r border-neutral-300"
          />
          <base-stats-tile
            :value="aircraft.sil"
            label="SIL (Source Integrity Level)"
          />
          <base-stats-tile :value="aircraft.silType" label="SIL Type" />
          <base-stats-tile
            :value="aircraft.gva"
            label="Geometric Vertical Accuracy"
            units="m"
          />
          <base-stats-tile
            :value="aircraft.sda"
            label="System Design Assurance"
          />
        </aircraft-info-card>

        <aircraft-info-card title="Last Known Position" icon="mdi:map-marker">
          <base-stats-tile
            :value="aircraft.lastPosition.lat"
            label="Last Known Latitude"
            units="°"
            class="border-b border-neutral-300 border-r"
          />
          <base-stats-tile
            :value="aircraft.lastPosition.lon"
            label="Last Known Longitude"
            units="°"
            class="border-b border-neutral-300"
          />
          <base-stats-tile
            :value="aircraft.lastPosition.nic"
            label="Last Known NIC"
            class="border-r border-neutral-300 border-b"
          />
          <base-stats-tile
            :value="aircraft.lastPosition.rc"
            label="Last Known RC"
            units="m"
            class="border-r border-neutral-300"
          />
          <base-stats-tile
            :value="aircraft.lastPosition.seen_pos"
            label="Last Seen Position"
            units="s"
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
          <base-stats-tile :value="aircraft.seen" label="Last Seen" units="s" />
        </aircraft-info-card>

        <aircraft-info-card title="Alerts & Status" icon="mdi:alert-outline">
          <base-stats-tile
            :value="aircraft.alert"
            label="Alert"
            class="border-b border-neutral-300 border-r"
          />
          <base-stats-tile
            :value="aircraft.spi"
            label="SPI (Special Position Identification)"
            class="border-b border-neutral-300"
          />
          <base-stats-tile
            :value="aircraft.acasRa"
            label="ACAS RA"
            class="border-r border-neutral-300 border-b"
          />
          <base-stats-tile
            :value="aircraft.gpsOkBefore"
            label="GPS Last OK"
            units="s"
          />
        </aircraft-info-card>
      </div>
    </div>
  </aside>
</template>

<script setup>
import AircraftRoute from "./AircraftRoute.vue";
import PlanespottersPhoto from "./PlanespottersPhoto.vue";
import BaseInfoTile from "./BaseInfoTile.vue";
import AirlineLogo from "./AirlineLogo.vue";
import AircraftInfoCard from "./AircraftInfoCard.vue";
import BaseStatsTile from "./BaseStatsTile.vue";
import ManufacturerLogo from "./ManufacturerLogo.vue";
import CountryFlag from "./CountryFlag.vue";
import useAircraft from "../composables/useAircraft.js";

const { getSelectedAircraft: aircraft, isAircraftSelected } = useAircraft();
</script>

<style scoped></style>
