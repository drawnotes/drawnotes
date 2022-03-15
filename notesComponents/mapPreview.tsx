import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { Box, Button, Dialog, Text, useTheme } from "@primer/react";
import bbox from "@turf/bbox";
import { Feature, FeatureCollection, GeometryCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import {
  FlyToInterpolator,
  StaticMap,
  WebMercatorViewport,
} from "react-map-gl";
import { MAPBOX_ACCESS_TOKEN } from "../utils/constants";
import { lineFilter, pointFilter, polygonFilter } from "../utils/geo";

const DARK_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const LIGHT_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface Props {
  mapSize: { width: number; height: number };
  geoData: {};
}

const MapPreview: NextPage<Props> = ({ mapSize, geoData }) => {
  const { colorScheme } = useTheme();
  const mapStyle = colorScheme!.includes("dark")
    ? DARK_MAP_STYLE
    : LIGHT_MAP_STYLE;

  const data = geoData as FeatureCollection | Feature | GeometryCollection;
  const lineData = useMemo(() => lineFilter(data), [data]);
  const polygonData = useMemo(() => polygonFilter(data), [data]);
  const pointData = useMemo(() => pointFilter(data), [data]);
  const [viewState, setViewState] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [dialogInfo, setDialogInfo] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState<any>(null);

  const bounding = useMemo(() => bbox(data), [data]);
  const padding = 10;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewport = new WebMercatorViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      }).fitBounds(
        [bounding.slice(0, 2), bounding.slice(2, 4)] as [
          [number, number],
          [number, number]
        ],
        {
          padding: padding,
        }
      );
      setViewState(viewport);
      setInfo({ lat: viewport.latitude, long: viewport.longitude });
    }
  }, [bounding]);

  const handleChangeViewState = ({ viewState }: any) => {
    setViewState(viewState);
    setInfo({ lat: viewState.latitude, long: viewState.longitude });
  };

  const handleZoomExtents = () => {
    const viewport = new WebMercatorViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    }).fitBounds(
      [bounding.slice(0, 2), bounding.slice(2, 4)] as [
        [number, number],
        [number, number]
      ],
      {
        padding: padding,
      }
    );
    setViewState({
      ...viewport,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  const layers = [
    new GeoJsonLayer({
      id: "polygon-layer",
      data: polygonData,
      opacity: 0.8,
      filled: true,
      getFillColor: () => [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        50,
      ],
      stroked: true,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 1,
      getLineColor: [0, 0, 0],
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
      id: "line-layer",
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

  const handleClose = () => setIsOpen(false);

  return (
    <Box position="relative" height="100%">
      <Box position="absolute" top={0} right={0} p={2} zIndex={5}>
        <Button variant="small" onClick={handleZoomExtents}>
          Zoom Extents
        </Button>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          zIndex: 10,
        }}
      >
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
          <Box p={3} overflow="scroll" color="fg.default">
            <Text fontFamily="sans-serif">
              <pre>{JSON.stringify(dialogInfo.object.properties, null, 2)}</pre>
            </Text>
          </Box>
        </Dialog>
      )}
      <Box position="absolute" top={2} left="50%" sx={{ zIndex: 10 }}>
        {info && `${info.lat.toFixed(4)}, ${info.long.toFixed(4)}`}
      </Box>
      <DeckGL
        width={mapSize.width}
        height={mapSize.height}
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
            color="fg.default"
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

export default MapPreview;
