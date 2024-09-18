import { reactive, ref } from "vue";
import axios from "axios";

const selectedAircraft = reactive({});
const aircraftSelected = ref({
  route: [],
  airline_code: "",
});
export default function useAircraft() {
  const updateSelectedAircraft = (newSelectedAircraft) => {
    Object.assign(selectedAircraft, { ...newSelectedAircraft });
  };

  const getRouteSet = (flight, lat, lon) => {
    axios
      .post("https://api.adsb.lol/api/0/routeset", {
        planes: [
          {
            callsign: flight.replace(/\s+/g, ""),
            lat: lat,
            lng: lon,
          },
        ],
      })
      .then((response) => {
        selectedAircraft.route = response.data[0]._airports;
        selectedAircraft.airline_code = response.data[0].airline_code;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectAircraft = (aircraft) => {
    updateSelectedAircraft(aircraft);
    getRouteSet(aircraft.flight, aircraft.lat, aircraft.lon);
    aircraftSelected.value = true;
  };

  const deselectAircraft = () => {
    aircraftSelected.value = false;
    Object.keys(selectedAircraft).forEach((key) => {
      delete selectedAircraft[key];
    });
  };

  return {
    selectedAircraft,
    updateSelectedAircraft,
    selectAircraft,
    deselectAircraft,
    aircraftSelected,
  };
}
