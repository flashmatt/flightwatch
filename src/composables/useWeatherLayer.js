import { ref } from "vue";
import { Tile as TileLayer } from "ol/layer";
import { XYZ } from "ol/source";

export default function useWeatherLayer() {
  const radarTimestamp = ref(0);
  const satellitePath = ref("");

  // References to the actual radar and satellite layers
  const radarLayer = ref(null);
  const satelliteLayer = ref(null);

  const getWeatherSnapshot = async () => {
    try {
      const response = await fetch(
        "https://api.rainviewer.com/public/weather-maps.json",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();

      // Get the latest available timestamp for radar
      if (data.radar && data.radar.past && data.radar.past.length > 0) {
        const latestRadar = data.radar.past[data.radar.past.length - 1];
        radarTimestamp.value = latestRadar.time;
      } else {
        throw new Error("No radar data available");
      }

      // Get the latest available path for satellite
      if (
        data.satellite &&
        data.satellite.infrared &&
        data.satellite.infrared.length > 0
      ) {
        const latestSatellite =
          data.satellite.infrared[data.satellite.infrared.length - 1];
        satellitePath.value = latestSatellite.path; // Use the provided path directly
      } else {
        throw new Error("No satellite data available");
      }
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  const createWeatherLayer = (type, timeOrPath) => {
    let urlTemplate = "";

    if (type === "radar") {
      urlTemplate = `https://tilecache.rainviewer.com/v2/radar/${timeOrPath}/256/{z}/{x}/{y}/4/1_1.png`;
    } else if (type === "satellite") {
      urlTemplate = `https://tilecache.rainviewer.com${timeOrPath}/256/{z}/{x}/{y}/0/0_0.png`; // Use the full path for satellite
    }

    return new TileLayer({
      source: new XYZ({
        url: urlTemplate,
        attributions:
          '&copy; <a href="https://www.rainviewer.com">RainViewer</a>',
      }),
      opacity: type === "radar" ? 0.2 : 0.3, // Different opacity for radar vs satellite if needed
    });
  };

  const addWeatherLayerToMap = (map, type, timeOrPath) => {
    const weatherLayer = createWeatherLayer(type, timeOrPath);

    if (type === "radar") {
      if (radarLayer.value) {
        map.removeLayer(radarLayer.value);
      }
      radarLayer.value = weatherLayer;
    } else if (type === "satellite") {
      if (satelliteLayer.value) {
        map.removeLayer(satelliteLayer.value);
      }
      satelliteLayer.value = weatherLayer;
    }

    map.addLayer(weatherLayer);
    return weatherLayer;
  };

  const removeWeatherLayerFromMap = (map, type) => {
    if (type === "radar" && radarLayer.value) {
      map.removeLayer(radarLayer.value);
      radarLayer.value = null; // Clear the reference
    } else if (type === "satellite" && satelliteLayer.value) {
      map.removeLayer(satelliteLayer.value);
      satelliteLayer.value = null; // Clear the reference
    }
  };

  return {
    radarTimestamp,
    satellitePath,
    radarLayer,
    satelliteLayer,
    getWeatherSnapshot,
    createWeatherLayer,
    addWeatherLayerToMap,
    removeWeatherLayerFromMap,
  };
}
