import { reactive } from "vue";

const mapSettings = reactive({
  showFlightNumbers: true,
  showAirlineLogos: true,
  showRainRadar: false,
  showCloudSatellite: false,
  radarOpacity: 0.2,
  satelliteOpacity: 0.3,
});

export default function useMapSettings() {
  return {
    mapSettings,
  };
}
