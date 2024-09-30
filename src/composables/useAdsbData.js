import axios from "axios";
import { ref } from "vue";
import Aircraft from "../models/Aircraft.js";

export default function useAdsbData(currentCenter, updateAircraftData) {
  const isFetching = ref(false);
  let fetchTimeoutId = null; // Store the timeout ID

  const fetchAdsbData = async () => {
    isFetching.value = true;
    try {
      const { lat, lon } = currentCenter.value;
      const response = await axios.get(
        `/api/v2/lat/${lat}/lon/${lon}/dist/250`,
      );

      const newData = processApiResponse(response.data);
      updateAircraftData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isFetching.value = false;
      fetchTimeoutId = setTimeout(fetchAdsbData, 1500); // Store the timeout ID
    }
  };

  const stopFetching = () => {
    if (fetchTimeoutId) {
      clearTimeout(fetchTimeoutId); // Clear the timeout
      fetchTimeoutId = null;
    }
  };

  // Remove fetchIntervalId and related code
  const startFetching = () => {
    console.log("Starting fetch");
    if (!fetchTimeoutId) {
      fetchAdsbData(); // Fetch immediately on start
    }
  };

  const processApiResponse = (data) => {
    if (!data.ac) {
      return [];
    }

    return data.ac
      .filter((aircraft) => aircraft.lat != null && aircraft.lon != null)
      .map((aircraftData) => new Aircraft(aircraftData));
  };

  return {
    stopFetching, // Export the stopFetching function
    isFetching,
    startFetching, // Export the start
  };
}
