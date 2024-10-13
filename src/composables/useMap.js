import { computed, ref } from "vue";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { XYZ } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

const map = ref(null);
const zoomLevel = ref(0);

const baseLayers = {
  DarkGray: new TileLayer({
    source: new XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      attributions:
        '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
    }),
  }),
  StreetMap: new TileLayer({
    source: new XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      attributions:
        '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS',
    }),
  }),
  Satellite: new TileLayer({
    source: new XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attributions:
        '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DigitalGlobe, GeoEye',
    }),
  }),
  OpenStreetMap: new TileLayer({
    source: new XYZ({
      url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attributions:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
  }),
  CartoDB_Voyager: new TileLayer({
    source: new XYZ({
      url: "https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      attributions:
        '&copy; <a href="https://carto.com/">CARTO</a> &mdash; ' +
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }),
  }),
  CartoDB_DarkMatter: new TileLayer({
    source: new XYZ({
      url: "https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attributions:
        '&copy; <a href="https://carto.com/">CARTO</a> &mdash; ' +
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }),
  }),
  CartoDB_Positron: new TileLayer({
    source: new XYZ({
      url: "https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attributions:
        '&copy; <a href="https://carto.com/">CARTO</a> &mdash; ' +
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }),
  }),
};

export default function useMap() {
  const currentCenter = ref({ lat: 0, lon: 0 });

  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 100,
  });

  const initializeMap = (
    targetId,
    initialCenter,
    initialZoom,
    baseLayerName = "DarkGray",
  ) => {
    return new Promise((resolve) => {
      map.value = new Map({
        target: targetId,
        controls: [],
        layers: [baseLayers[baseLayerName], vectorLayer],
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

      zoomLevel.value = map.value.getView().getZoom();

      map.value.getView().on("change:resolution", () => {
        zoomLevel.value = map.value.getView().getZoom();
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
    return zoomLevel.value;
  });

  const setBaseLayer = (baseLayerName) => {
    const layers = map.value.getLayers();
    layers.setAt(0, baseLayers[baseLayerName]);
  };

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
    setBaseLayer,
    baseLayers, // Exporting this if you need to list available layers elsewhere
  };
}
