// useAircraftFeatures.js
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import useSprites from "../composables/useSprites";

export default function useAircraftFeatures(vectorSource) {
  const aircraftFeatures = {};
  const { getSvgFromAircraft } = useSprites();

  const createOrUpdateAircraftFeature = (aircraft) => {
    if (aircraftFeatures[aircraft.hex]) {
      // Update existing feature
      const feature = aircraftFeatures[aircraft.hex];
      const geometry = new Point(fromLonLat([aircraft.lon, aircraft.lat]));
      feature.setGeometry(geometry);

      const style = feature.getStyle();
      if (style && style.getImage()) {
        style.getImage().setRotation(aircraft.rotation);
      }
      feature.setStyle(style);
    } else {
      // Create new feature
      const feature = new Feature({
        geometry: new Point(fromLonLat([aircraft.lon, aircraft.lat])),
        hex: aircraft.hex,
        meta: aircraft,
      });

      const iconStyle = new Style({
        image: new Icon({
          src: getSvgFromAircraft(aircraft.aircraftType),
          scale: 1, // Adjust scale as needed
          rotation: aircraft.rotation
        }),
      });

      feature.setStyle(iconStyle);

      vectorSource.addFeature(feature);
      aircraftFeatures[aircraft.hex] = feature;
    }
  };

  const removeStaleAircraftFeatures = (newAircraftHexes) => {
    for (const hex in aircraftFeatures) {
      if (!newAircraftHexes.has(hex)) {
        vectorSource.removeFeature(aircraftFeatures[hex]);
        delete aircraftFeatures[hex];
      }
    }
  };

  return {
    createOrUpdateAircraftFeature,
    removeStaleAircraftFeatures,
  };
}
