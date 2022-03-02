import { AmbientLight, LightingEffect, PointLight } from "@deck.gl/core";
import { TripsLayer } from "@deck.gl/geo-layers";
import { PolygonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { Box, useTheme } from "@primer/react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import { StaticMap } from "react-map-gl";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { MAPBOX_ACCESS_TOKEN } from "../utils/constants";

interface Props {}

// Source data CSV
const DATA_URL = {
  BUILDINGS:
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/buildings.json", // eslint-disable-line
  TRIPS:
    "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json", // eslint-disable-line
};

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000],
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight });

const material = {
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70],
};

const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect],
};

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.72,
  zoom: 13,
  pitch: 45,
  bearing: 0,
};

const DARK_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const LIGHT_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const landCover = [
  [
    [-74.0, 40.7],
    [-74.02, 40.7],
    [-74.02, 40.72],
    [-74.0, 40.72],
  ],
];

const MapPage: NextPage<Props> = ({}) => {
  const { colorScheme } = useTheme();
  const buildings = DATA_URL.BUILDINGS;
  const trips = DATA_URL.TRIPS;
  const trailLength = 180;
  const initialViewState = INITIAL_VIEW_STATE;
  const mapStyle = colorScheme!.includes("dark")
    ? DARK_MAP_STYLE
    : LIGHT_MAP_STYLE;
  const theme = DEFAULT_THEME;
  const loopLength = 1800; // unit corresponds to the timestamp in source data
  const animationSpeed = 1;

  const [time, setTime] = useState(0);
  const [animation] = useState({} as any);

  const memoizedAnimate = useCallback(() => {
    setTime((t) => (t + animationSpeed) % loopLength);
    animation.id = window.requestAnimationFrame(memoizedAnimate);
    return animation.id;
  }, [animation, animationSpeed, loopLength]);

  useEffect(() => {
    animation.id = window.requestAnimationFrame(memoizedAnimate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation, memoizedAnimate]);

  const layers = [
    // This is only needed when using shadow effects
    new PolygonLayer({
      id: "ground",
      data: landCover,
      getPolygon: (f: any) => f,
      stroked: false,
      getFillColor: [0, 0, 0, 0],
    }),
    new TripsLayer({
      id: "trips",
      data: trips,
      getPath: (d: any) => d.path,
      getTimestamps: (d) => d.timestamps,
      getColor: (d) =>
        (d.vendor === 0 ? theme.trailColor0 : theme.trailColor1) as any,
      opacity: 0.3,
      widthMinPixels: 2,
      jointRounded: true,
      trailLength,
      currentTime: time,
      // shadowEnabled: false,
    }),
    new PolygonLayer({
      id: "buildings",
      data: buildings,
      extruded: true,
      wireframe: false,
      opacity: 0.5,
      getPolygon: (f: any) => f.polygon,
      getElevation: (f: any) => f.height,
      getFillColor: theme.buildingColor as any,
      material: theme.material,
    }),
  ];
  return (
    <Box width="100vw" height="100vh" color="fg.default" bg="canvas.default">
      <ColorModeSwitcher />
      <DeckGL
        layers={layers}
        effects={theme.effects}
        initialViewState={initialViewState}
        controller={true}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          preventStyleDiffing={true}
        />
      </DeckGL>
    </Box>
  );
};

export default MapPage;
