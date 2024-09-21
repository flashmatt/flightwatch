import { computed, reactive, ref } from "vue";
import axios from "axios";

let selectedAircraft = ref({});

const aircraftSelected = ref(false);

let routeSet = ref([]);
const useAircraft = () => {
  const updateSelectedAircraft = (newSelectedAircraft) => {
    selectedAircraft.value = newSelectedAircraft;
  };



  const loadRouteSet = (flight, lat, lon) => {
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
        // Update the .value property of routeSet
        routeSet.value = response.data[0]._airports;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSelectedAircraft = computed(() => {
    return selectedAircraft.value;
  });

  const selectAircraft = (aircraft) => {
    updateSelectedAircraft(aircraft);
    loadRouteSet(aircraft.flight, aircraft.lat, aircraft.lon);
    aircraftSelected.value = true;
  };

  const deselectAircraft = () => {
    aircraftSelected.value = false;
    selectedAircraft.value = {};
    // Reset the .value property of routeSet
    routeSet.value = [];
  };

  const isAircraftSelected = computed(() => {
    return aircraftSelected.value;
  });

  const getRouteSet = computed(() => {
    return routeSet.value;
  });

  return {
    updateSelectedAircraft,
    getSelectedAircraft,
    selectAircraft,
    deselectAircraft,
    isAircraftSelected,
    getRouteSet,
  };
};

export default useAircraft;
