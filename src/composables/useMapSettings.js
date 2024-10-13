import { reactive } from "vue";

const mapSettings = reactive({
  showFlightNumbers: true,
  showAirlineLogos: true,
  showRainRadar: false,
  showCloudSatellite: false,
});

export default function useMapSettings() {
  return {
    mapSettings,
  };
}
