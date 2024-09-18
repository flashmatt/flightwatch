import { computed, reactive, ref } from "vue";
import axios from "axios";

let aircraft = [];
let selectedAircraft = reactive({
  lat: 0,
  lon: 0,
  hex: "",
  type: "",
  flight: "",
  registration: "",
  aircraftType: "",
  altBaro: "",
  altGeom: "",
  gs: 0,
  ias: 0,
  tas: 0,
  mach: 0,
  wd: 0,
  ws: 0,
  oat: 0,
  tat: 0,
  track: 0,
  trackRate: 0,
  roll: 0,
  magHeading: 0,
  trueHeading: 0,
  baroRate: 0,
  geomRate: 0,
  squawk: "",
  emergency: "",
  category: "",
  navQnh: 0,
  navAltitudeMcp: 0,
  navAltitudeFms: 0,
  navModes: "",
  nic: 0,
  rc: 0,
  seenPos: 0,
  version: 0,
  nicBaro: 0,
  nacP: 0,
  nacV: 0,
  sil: 0,
  silType: "",
  gva: 0,
  sda: 0,
  alert: false,
  spi: false,
  mlat: "",
  tisb: "",
  messages: 0,
  seen: 0,
  rssi: 0,
  dst: 0,
  dir: 0,
  rr_lat: 0,
  rr_lon: 0,
  lastPosition: {
    lat: 0,
    lon: 0,
    nic: 0,
    rc: 0,
    seen_pos: 0,
  },
  dbFlags: 0,
  acasRa: "",
  gpsOkBefore: 0,
  airline_code: "",
  airports: [
    {
      alt_feet: 0,
      alt_meters: 0,
      countryiso2: "",
      iata: "",
      icao: "",
      lat: 0,
      location: "",
      lon: 0,
      name: "",
    },
    {
      alt_feet: 0,
      alt_meters: 0,
      countryiso2: "",
      iata: "",
      icao: "",
      lat: 0,
      location: "",
      lon: 0,
      name: "",
    },
  ],
});

const aircraftSelected = ref(false);

const useAircraft = () => {
  const setAircraft = (newAircraft) => {
    aircraft = newAircraft;
  };

  const getAircraft = computed(() => {
    return aircraft;
  });

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
        selectedAircraft.airports = response.data[0]._airports;
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
  };

  const isAircraftSelected = computed(() => {
    return aircraftSelected.value;
  });

  return {
    setAircraft,
    getAircraft,
    updateSelectedAircraft,
    getSelectedAircraft,
    selectAircraft,
    deselectAircraft,
    isAircraftSelected,
  };
};

export default useAircraft;
