import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { Box, Button, Dialog, Text, useTheme } from "@primer/react";
import bbox from "@turf/bbox";
import { FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import {
  FlyToInterpolator,
  StaticMap,
  WebMercatorViewport,
} from "react-map-gl";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import frame01 from "../sampledata/frame01.json";
import frame02 from "../sampledata/frame02.json";
import routes from "../sampledata/routes.json";
import stops from "../sampledata/stops.json";
import { hexToRgb } from "../utils/color";
import { MAPBOX_ACCESS_TOKEN } from "../utils/constants";
import { Entity, GTFS } from "../utils/transit";

interface Props {}

const DARK_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const LIGHT_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const MapPage: NextPage<Props> = ({}) => {
  const { colorScheme } = useTheme();
  const mapStyle = colorScheme!.includes("dark")
    ? DARK_MAP_STYLE
    : LIGHT_MAP_STYLE;

  const textColor = colorScheme!.includes("dark")
    ? hexToRgb("#c9d1d9")
    : hexToRgb("#24292f");

  const prev = frame01 as GTFS;
  const current = frame02 as GTFS;

  const data = frame01 as GTFS;
  const pointData = stops as FeatureCollection;
  const lineData = routes as FeatureCollection;

  const bounding = useMemo(() => bbox(lineData), [lineData]);

  const [viewState, setViewState] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [dialogInfo, setDialogInfo] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewport = new WebMercatorViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      }).fitBounds([bounding.slice(0, 2), bounding.slice(2, 4)] as [
        [number, number],
        [number, number]
      ]);
      setViewState(viewport);
      setInfo({ lat: viewport.latitude, long: viewport.longitude });
    }
  }, [bounding]);

  const handleChangeViewState = ({ viewState }: any) => {
    setViewState(viewState);
    setInfo({ lat: viewState.latitude, long: viewState.longitude });
  };

  const handleClose = () => setIsOpen(false);

  const layers = [
    // new TripsLayer({
    //   id: 'trips',
    //   data: data,
    //   getPath: d => d.path,
    //   getTimestamps: d => d.timestamps,
    //   getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
    //   opacity: 0.5,
    //   widthMinPixels: 3,
    //   rounded: true,
    //   trailLength: 150,
    //   currentTime: 0,
    // }),
    new ScatterplotLayer<Entity>({
      id: "scatterplot-layer",
      visible: false,
      data: data.entity,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 2,
      radiusMinPixels: 2,
      radiusMaxPixels: 10,
      lineWidthMinPixels: 1,
      getPosition: (d) => [
        d.vehicle.position.longitude,
        d.vehicle.position.latitude,
      ],
      getRadius: () => 30,
      getFillColor: (d) => [255, 140, 0],
      getLineColor: (d) => [0, 0, 0],
    }),
    new GeoJsonLayer({
      id: "line-layer",
      visible: false,
      data: lineData,
      opacity: 0.8,
      filled: false,
      stroked: true,
      getLineWidth: 10,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 10,
      getLineColor: [255, 99, 71],
      pickable: true,
      autoHighlight: true,
      onClick: (info: any) => {
        if (info.object) {
          setDialogInfo(info);
          setIsOpen(true);
          setHoverInfo(null);
        } else {
          setDialogInfo(null);
        }
      },
      onHover: (info: any) => {
        if (info.object) {
          setHoverInfo(info);
        } else {
          setHoverInfo(null);
        }
      },
    }),
    new GeoJsonLayer({
      id: "point-layer",
      visible: false,
      data: pointData,
      opacity: 0.8,
      pointType: "circle",
      getPointRadius: 30,
      pointRadiusMinPixels: 5,
      pointRadiusMaxPixels: 30,
      filled: true,
      getFillColor: () => [255, 99, 71],
      stroked: false,
      pickable: true,
      autoHighlight: true,
      onClick: (info: any) => {
        if (info.object) {
          setDialogInfo(info);
          setIsOpen(true);
          setHoverInfo(null);
        } else {
          setDialogInfo(null);
        }
      },
      onHover: (info: any) => {
        if (info.object) {
          setHoverInfo(info);
        } else {
          setHoverInfo(null);
        }
      },
    }),
  ];

  const handleZoomExtents = () => {
    const corners = [bounding.slice(0, 2), bounding.slice(2, 4)] as [
      [number, number],
      [number, number]
    ];
    const viewport = new WebMercatorViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    }).fitBounds(corners);
    setViewState({
      ...viewport,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };
  return (
    <Box width="100vw" height="100vh" color="fg.default" bg="canvas.default">
      <ColorModeSwitcher />
      <Box position="absolute" top={40} right={0} p={3} zIndex={5}>
        <Button variant="small" onClick={handleZoomExtents}>
          Zoom Extents
        </Button>
      </Box>
      <Box sx={{ position: "absolute", top: "50vh", left: "50vw", zIndex: 10 }}>
        ＋
      </Box>
      {dialogInfo && (
        <Dialog
          isOpen={isOpen}
          onDismiss={handleClose}
          aria-labelledby="header-id"
          wide={true}
        >
          <Dialog.Header id="header-id">Properties</Dialog.Header>
          <Box p={3} overflow="scroll">
            <Text fontFamily="sans-serif">
              <pre>{JSON.stringify(dialogInfo.object.properties, null, 2)}</pre>
            </Text>
          </Box>
        </Dialog>
      )}
      <Box position="absolute" top={2} left="50vw" sx={{ zIndex: 10 }}>
        {info && `${info.lat.toFixed(4)}, ${info.long.toFixed(4)}`}
      </Box>
      <DeckGL
        layers={layers}
        viewState={viewState}
        onViewStateChange={handleChangeViewState}
        controller={true}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          preventStyleDiffing={true}
        />
        {hoverInfo && (
          <Box
            bg="neutral.muted"
            borderRadius={1}
            sx={{
              position: "absolute",
              zIndex: 10,
              pointerEvents: "none",
              left: hoverInfo.x,
              top: hoverInfo.y,
            }}
          >
            <pre>{JSON.stringify(hoverInfo.object.properties, null, 2)}</pre>
          </Box>
        )}
      </DeckGL>
    </Box>
  );
};

export default MapPage;
