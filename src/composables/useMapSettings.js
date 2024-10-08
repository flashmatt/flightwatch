import { reactive } from "vue";

const mapSettings = reactive({
  showFlightNumbers: true,
  showAirlineLogos: true,
});

export default function useMapSettings() {
  return {
    mapSettings,
  };
}
