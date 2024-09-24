import { computed, ref } from "vue";
import axios from "axios";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon, Circle as CircleStyle, Stroke } from "ol/style";
import { fromLonLat } from "ol/proj";
import useSprites from "../composables/useSprites";
import useMap from "./useMap.js";

const selectedAircraft = ref({});
const aircraftSelected = ref(false);
const routeSet = ref([]);
const followAircraft = ref(false);

export default function useAircraftData(vectorSource) {
  const { getSvgFromAircraft } = useSprites();
  const { setCenterWithoutEasing: setCenter } = useMap();
  const aircraftFeatures = {};

  const getOrCreateIconImage = (feature, aircraft) => {
    let iconImage = feature.get("iconImage");
    if (!iconImage) {
      iconImage = new Icon({
        src: getSvgFromAircraft(aircraft.aircraftType),
        scale: 1,
        rotation: aircraft.getRotation(),
      });
      feature.set("iconImage", iconImage);
    }
    return iconImage;
  };

  const createIconStyle = (iconImage) => {
    return new Style({
      image: iconImage,
    });
  };

  const startPulsingAnimation = (feature) => {
    feature.set("startTime", Date.now());

    const ringStroke = new Stroke({
      color: `rgba(0, 153, 255, 1)`,
      width: 5,
    });

    const ringImage = new CircleStyle({
      radius: 20,
      stroke: ringStroke,
    });

    const ringStyle = new Style({
      image: ringImage,
    });

    feature.setStyle((feature) => {
      const elapsed = Date.now() - feature.get("startTime");
      const duration = 1500;
      const t = (elapsed % duration) / duration;

      const scale = 1 + t;
      const radius = 20 * scale;
      const opacity = 1 - t;

      ringImage.setRadius(radius);
      ringStroke.setColor(`rgba(0, 153, 255, ${opacity})`);

      return [
        createIconStyle(getOrCreateIconImage(feature, feature.get("meta"))),
        ringStyle,
      ];
    });

    const animate = () => {
      feature.changed();
      feature.set("animationFrame", requestAnimationFrame(animate));
    };

    feature.set("animationFrame", requestAnimationFrame(animate));
  };

  const stopPulsingAnimation = (feature) => {
    feature.unset("startTime");

    const animationFrame = feature.get("animationFrame");
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      feature.unset("animationFrame");
    }

    const iconImage = getOrCreateIconImage(feature, feature.get("meta"));
    const iconStyle = createIconStyle(iconImage);
    feature.setStyle(iconStyle);
  };

  const createOrUpdateAircraftFeature = (aircraft) => {
    const hex = aircraft.hex;
    let feature = aircraftFeatures[hex];

    const currentTime = new Date().getTime();

    if (feature) {
      const oldCoords = feature.getGeometry().getCoordinates();
      const newCoords = fromLonLat([aircraft.lon, aircraft.lat]);

      const duration = 1750; // 1 second
      const moveFeature = () => {
        const elapsed = Math.min(
          (new Date().getTime() - currentTime) / duration,
          1,
        );

        const interpolatedCoords = [
          oldCoords[0] + (newCoords[0] - oldCoords[0]) * elapsed,
          oldCoords[1] + (newCoords[1] - oldCoords[1]) * elapsed,
        ];

        feature.setGeometry(new Point(interpolatedCoords));

        if (elapsed < 1) {
          requestAnimationFrame(moveFeature);
        } else {
          feature.setGeometry(new Point(newCoords)); // Ensure it snaps to final position
        }
      };

      requestAnimationFrame(moveFeature);

      const iconImage = getOrCreateIconImage(feature, aircraft);
      iconImage.setRotation(aircraft.getRotation());

      if (aircraftSelected.value && selectedAircraft.value.hex === hex) {
        selectedAircraft.value = aircraft;
        if (followAircraft.value) {
          setCenter(fromLonLat([aircraft.lon, aircraft.lat]));
        }
      }
    } else {
      feature = new Feature({
        geometry: new Point(fromLonLat([aircraft.lon, aircraft.lat])),
        hex: hex,
        meta: aircraft,
      });

      const iconImage = getOrCreateIconImage(feature, aircraft);
      const iconStyle = createIconStyle(iconImage);
      feature.setStyle(iconStyle);

      vectorSource.addFeature(feature);
      aircraftFeatures[hex] = feature;
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

  const loadRouteSet = async (flight, lat, lon) => {
    try {
      const response = await axios.post(`https://api.adsb.lol/api/0/routeset`, {
        planes: [
          {
            callsign: flight.replace(/\s+/g, ""),
            lat: lat,
            lng: lon,
          },
        ],
      });
      routeSet.value = response.data[0]._airports;
    } catch (error) {
      console.error(error);
    }
  };

  const selectAircraft = (aircraft) => {
    if (aircraftSelected.value && selectedAircraft.value.hex !== aircraft.hex) {
      deselectAircraft();
    }

    selectedAircraft.value = aircraft;
    aircraftSelected.value = true;
    loadRouteSet(aircraft.flight, aircraft.lat, aircraft.lon);

    const feature = aircraftFeatures[aircraft.hex];
    if (feature) {
      startPulsingAnimation(feature);
    }
  };

  const deselectAircraft = () => {
    if (selectedAircraft.value.hex) {
      const feature = aircraftFeatures[selectedAircraft.value.hex];
      if (feature) {
        stopPulsingAnimation(feature);
      }
    }

    selectedAircraft.value = {};
    aircraftSelected.value = false;
    routeSet.value = [];
    stopFollowingAircraft();
  };

  const toggleFollowAircraft = () => {
    followAircraft.value = !followAircraft.value;
  };

  const startFollowingAircraft = () => {
    followAircraft.value = true;
  };
  const stopFollowingAircraft = () => {
    followAircraft.value = false;
  };

  const isAircraftSelected = computed(() => aircraftSelected.value);
  const getSelectedAircraft = computed(() => selectedAircraft.value);
  const getRouteSet = computed(() => routeSet.value);
  const isFollowingAircraft = computed(() => followAircraft.value);

  return {
    createOrUpdateAircraftFeature,
    removeStaleAircraftFeatures,
    selectAircraft,
    deselectAircraft,
    isAircraftSelected,
    getSelectedAircraft,
    getRouteSet,
    toggleFollowAircraft,
    isFollowingAircraft,
    startFollowingAircraft,
    stopFollowingAircraft,
  };
}
