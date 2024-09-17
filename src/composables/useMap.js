import { ref } from "vue";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { XYZ } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

export default function useMap() {
  const map = ref(null);
  const currentCenter = ref({ lat: 0, lon: 0 });

  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  const initializeMap = (targetId, initialCenter, initialZoom) => {
    return new Promise((resolve) => {
      map.value = new Map({
        target: targetId,
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

  return {
    map,
    initializeMap,
    currentCenter,
    vectorSource,
  };
}
