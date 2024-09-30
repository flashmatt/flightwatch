import { computed, ref } from "vue";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { XYZ } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

const map = ref(null);
export default function useMap() {
  const currentCenter = ref({ lat: 0, lon: 0 });

  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
  });

  const initializeMap = (targetId, initialCenter, initialZoom) => {
    return new Promise((resolve) => {
      map.value = new Map({
        target: targetId,
        controls: [],
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
              attributions:
                '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
            }),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([initialCenter.lon, initialCenter.lat]),
          zoom: initialZoom,
        }),
      });

      currentCenter.value = initialCenter;

      map.value.getView().on("change:center", () => {
        const view = map.value.getView();
        const center = toLonLat(view.getCenter());
        const [lon, lat] = center;
        currentCenter.value = { lat, lon };
      });

      resolve();
    });
  };

  const setCenter = (position) => {
    const view = map.value.getView();
    view.animate({ center: position });
  };

  const setCenterWithoutEasing = (position) => {
    const view = map.value.getView();
    view.animate({ center: position, duration: 1750, easing: (t) => t });
  };

  const zoomIn = () => {
    const view = map.value.getView();
    view.animate({ zoom: view.getZoom() + 1 });
  };

  const zoomOut = () => {
    const view = map.value.getView();
    view.animate({ zoom: view.getZoom() - 1 });
  };

  const getZoomLevel = computed(() => {
    return map.value.getView().getZoom();
  });

  return {
    map,
    initializeMap,
    currentCenter,
    vectorSource,
    setCenter,
    setCenterWithoutEasing,
    zoomIn,
    zoomOut,
    getZoomLevel,
  };
}
