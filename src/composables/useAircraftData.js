import { computed, ref, watch } from "vue";
import axios from "axios";
import { Feature } from "ol";
import { Point } from "ol/geom";
import {
  Style,
  Icon,
  Text,
  Fill,
  Stroke,
  Circle as CircleStyle,
} from "ol/style";
import { fromLonLat } from "ol/proj";
import useSprites from "../composables/useSprites";
import useMap from "./useMap.js";
import useMapSettings from "./useMapSettings.js";

const selectedAircraft = ref({});
const aircraftSelected = ref(false);
const routeSet = ref([]);
const followAircraft = ref(false);

export default function useAircraftData(vectorSource) {
  const { getSvgFromAircraft } = useSprites();
  const { setCenterWithoutEasing: setCenter, getZoomLevel } = useMap();
  const { mapSettings } = useMapSettings();

  const aircraftFeatures = new Map();

  let animationFrameId;

  const getIcon = (aircraftType, rotation) => {
    return new Icon({
      src: getSvgFromAircraft(aircraftType),
      scale: 1,
      rotation: rotation,
    });
  };

  const logoCache = new Map();

  const getAirlineLogoSrc = (airlineCode) => {
    if (!airlineCode) return null;

    if (logoCache.has(airlineCode)) {
      // Return cached logo URL
      return logoCache.get(airlineCode);
    }

    const logoUrl = `/logos/airline_symbol/${airlineCode}.svg`;
    logoCache.set(airlineCode, logoUrl); // Cache it
    return logoUrl;
  };

  const getStyle = (aircraft, iconImage, isHovered) => {
    const zoomLevel = Math.floor(getZoomLevel.value);

    const styles = [
      new Style({
        image: iconImage,
      }),
    ];

    const showDetails = zoomLevel >= 8 || isHovered;

    // Conditionally add flight number as text
    if (aircraft.flight && mapSettings.showFlightNumbers && showDetails) {
      styles.push(
        new Style({
          text: new Text({
            text: aircraft.flight,
            offsetY: -30, // Position above the icon
            font: "12px Calibri,sans-serif",
            fill: new Fill({ color: "#fff" }),
          }),
        }),
      );
    }

    // Conditionally add airline logo
    if (mapSettings.showAirlineLogos && showDetails) {
      const airlineCode = aircraft.getPotentialAirlineCode();
      if (airlineCode) {
        const airlineLogoSrc = getAirlineLogoSrc(airlineCode);
        if (airlineLogoSrc) {
          styles.push(
            new Style({
              image: new Icon({
                src: airlineLogoSrc,
                width: 25,
                preserveAspectRatio: true,
                displacement: [-45, 30], // Position
              }),
              zIndex: 30,
            }),
          );
        }
      }
    }

    return styles;
  };

  const startPulsingAnimation = (feature) => {
    if (feature.get("isPulsing")) {
      return;
    }

    feature.set("isPulsing", true);
    feature.set("startTime", Date.now());

    let ringStroke = new Stroke({
      color: `rgba(0, 153, 255, 1)`,
      width: 5,
    });

    let ringImage = new CircleStyle({
      radius: 20,
      stroke: ringStroke,
    });

    let ringStyle = new Style({
      image: ringImage,
    });

    feature.set("ringStyle", ringStyle);

    const existingStyles = feature.getStyle();
    if (Array.isArray(existingStyles)) {
      feature.setStyle([...existingStyles, ringStyle]);
    } else {
      feature.setStyle([existingStyles, ringStyle]);
    }

    if (!animationFrameId) {
      animateFeatures();
    }
  };

  const stopPulsingAnimation = (feature) => {
    feature.unset("startTime");
    feature.unset("isPulsing");

    // Remove ringStyle from feature's styles
    const styles = feature.getStyle();
    if (Array.isArray(styles)) {
      const newStyles = styles.filter(
        (style) => style !== feature.get("ringStyle"),
      );
      feature.setStyle(newStyles);
    }

    feature.unset("ringStyle");

    if (!anyFeaturesAnimating()) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const animateFeatures = () => {
    const currentTime = Date.now();
    let anyAnimating = false;

    aircraftFeatures.forEach((feature) => {
      const startTime = feature.get("startTime");
      const moveStartTime = feature.get("moveStartTime");

      if (startTime) {
        anyAnimating = true;
        const elapsed = currentTime - startTime;
        const duration = 1500;
        const t = (elapsed % duration) / duration;

        const scale = 1 + t;
        const radius = 20 * scale;
        const opacity = 1 - t;

        const ringStyle = feature.get("ringStyle");
        if (ringStyle) {
          const ringImage = ringStyle.getImage();
          ringImage.setRadius(radius);
          ringImage.getStroke().setColor(`rgba(0, 153, 255, ${opacity})`);
        }

        feature.changed();
      }

      if (moveStartTime) {
        anyAnimating = true;
        const elapsed = currentTime - moveStartTime;
        const duration = 1750;
        const t = Math.min(elapsed / duration, 1);

        const oldCoords = feature.get("oldCoords");
        const newCoords = feature.get("newCoords");

        const interpolatedCoords = [
          oldCoords[0] + (newCoords[0] - oldCoords[0]) * t,
          oldCoords[1] + (newCoords[1] - oldCoords[1]) * t,
        ];

        feature.getGeometry().setCoordinates(interpolatedCoords);

        if (t >= 1) {
          feature.unset("moveStartTime");
          feature.unset("oldCoords");
          feature.unset("newCoords");
          feature.getGeometry().setCoordinates(newCoords); // Ensure it snaps to final position
        }

        feature.changed();
      }
    });

    if (anyAnimating) {
      animationFrameId = requestAnimationFrame(animateFeatures);
    } else {
      animationFrameId = null;
    }
  };

  const anyFeaturesAnimating = () => {
    let animating = false;
    aircraftFeatures.forEach((feature) => {
      if (feature.get("startTime") || feature.get("moveStartTime")) {
        animating = true;
      }
    });
    return animating;
  };

  const createOrUpdateAircraftFeature = (aircraft) => {
    const hex = aircraft.hex;
    let feature = aircraftFeatures.get(hex);

    const currentTime = Date.now();

    if (feature) {
      // Update existing feature
      const oldCoords = feature.getGeometry().getCoordinates();
      const newCoords = fromLonLat([aircraft.lon, aircraft.lat]);

      feature.set("moveStartTime", currentTime);
      feature.set("oldCoords", oldCoords);
      feature.set("newCoords", newCoords);

      // Update rotation
      const newIconImage = getIcon(
        aircraft.aircraftType,
        aircraft.getRoundedRotation(),
      );
      feature.set("iconImage", newIconImage);

      const styles = getStyle(aircraft, newIconImage);

      // Preserve ringStyle if it exists
      const ringStyle = feature.get("ringStyle");
      if (ringStyle) {
        styles.push(ringStyle);
      }

      feature.setStyle(styles);

      if (aircraftSelected.value && selectedAircraft.value.hex === hex) {
        selectedAircraft.value = aircraft;
        if (followAircraft.value) {
          setCenter(fromLonLat([aircraft.lon, aircraft.lat]));
        }
      }

      if (!animationFrameId) {
        animateFeatures();
      }
    } else {
      // Create new feature
      feature = new Feature({
        geometry: new Point(fromLonLat([aircraft.lon, aircraft.lat])),
        hex: hex,
        meta: aircraft,
      });

      const iconImage = getIcon(
        aircraft.aircraftType,
        aircraft.getRoundedRotation(),
      );
      feature.set("iconImage", iconImage);

      const styles = getStyle(aircraft, iconImage);
      feature.setStyle(styles);

      vectorSource.addFeature(feature);
      aircraftFeatures.set(hex, feature);
    }
  };

  const removeStaleAircraftFeatures = (newAircraftHexes) => {
    for (const hex of aircraftFeatures.keys()) {
      if (!newAircraftHexes.has(hex)) {
        vectorSource.removeFeature(aircraftFeatures.get(hex));
        aircraftFeatures.delete(hex);
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

    const feature = aircraftFeatures.get(aircraft.hex);
    if (feature) {
      startPulsingAnimation(feature);
    }
  };

  const deselectAircraft = () => {
    if (selectedAircraft.value.hex) {
      const feature = aircraftFeatures.get(selectedAircraft.value.hex);
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

  watch(getZoomLevel, () => {
    aircraftFeatures.forEach((feature) => {
      const aircraft = feature.get("meta");
      const iconImage = feature.get("iconImage");
      const styles = getStyle(aircraft, iconImage);
      feature.setStyle(styles);
    });
  });

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
