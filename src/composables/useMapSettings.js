import { reactive } from "vue";

const mapSettings = reactive({
  showFlightNumbers: true,
  showAirlineLogos: true,
  showRainRadar: true,
  showCloudSatellite: true,
});

export default function useMapSettings() {
  return {
    mapSettings,
  };
}
