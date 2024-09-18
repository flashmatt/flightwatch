import { computed, reactive, ref } from "vue";
import axios from "axios";

let selectedAircraft = reactive({
  airline_code:'',
  route:[]
});

const aircraftSelected = ref(false);

const useAircraft = () => {
  const updateSelectedAircraft = (newSelectedAircraft) => {
    Object.assign(selectedAircraft, { ...newSelectedAircraft });
  };

  const getRouteSet = (flight, lat, lon) => {
    axios
      .post(`https://api.adsb.lol/api/0/routeset`, {
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

  const getSelectedAircraft = computed(() => {
    return selectedAircraft;
  });

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

  const isAircraftSelected = computed(() => {
    return aircraftSelected.value;
  });

  return {
    updateSelectedAircraft,
    getSelectedAircraft,
    selectAircraft,
    deselectAircraft,
    isAircraftSelected,
  };
};

export default useAircraft;
