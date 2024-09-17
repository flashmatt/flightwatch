import axios from "axios";
import { ref } from "vue";
import Aircraft from "../models/Aircraft.js";

export default function useAdsbData(currentCenter, updateAircraftData) {
  const isFetching = ref(false);

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
      setTimeout(fetchAdsbData, 1500);
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
    fetchAdsbData,
    isFetching,
  };
}
