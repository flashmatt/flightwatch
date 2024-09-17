import { ref } from "vue";
import Geolocation from "ol/Geolocation";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";

export default function useGeolocation(map, vectorSource) {
  const userLocation = ref(null);
  let userLocationFeature = null;
  let geolocation = null;

  const initializeGeolocation = () => {
    geolocation = new Geolocation({
      tracking: true,
      projection: map.value.getView().getProjection(),
    });

    geolocation.on("change:position", () => {
      const coordinates = geolocation.getPosition();
      if (coordinates) {
        if (!userLocationFeature) {
          userLocationFeature = new Feature(new Point(coordinates));
          userLocationFeature.setStyle(
            new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({ color: "#3399CC" }),
                stroke: new Stroke({ color: "#fff", width: 2 }),
              }),
            }),
          );
          vectorSource.addFeature(userLocationFeature);
        } else {
          userLocationFeature.getGeometry().setCoordinates(coordinates);
        }
      }
    });
  };

  return {
    initializeGeolocation,
    userLocation,
  };
}
