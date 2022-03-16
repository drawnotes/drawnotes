import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { Box, Button, Dialog, Text, ThemeProvider } from "@primer/react";
import bbox from "@turf/bbox";
import { Feature, FeatureCollection, GeometryCollection } from "geojson";
import Cookie from "js-cookie";
import "mapbox-gl/dist/mapbox-gl.css";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import {
  FlyToInterpolator,
  StaticMap,
  WebMercatorViewport,
} from "react-map-gl";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import bikePaths from "../sampledata/bikePaths.json";
import { hexToRgb } from "../utils/color";
import { MAPBOX_ACCESS_TOKEN } from "../utils/constants";
import { lineFilter, pointFilter, polygonFilter } from "../utils/geo";

declare type ColorMode = "day" | "night";
declare type ColorModeWithAuto = ColorMode | "auto";

interface Props {
  preferredColorMode: ColorModeWithAuto;
  preferredDayScheme: string;
  preferredNightScheme: string;
}

const DARK_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const LIGHT_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const MapPage: NextPage<Props> = ({
  preferredColorMode,
  preferredDayScheme,
  preferredNightScheme,
}) => {
  const [colorMode, setColorMode] = useState<ColorModeWithAuto>(
    preferredColorMode || "day"
  );
  const [dayScheme, setDayScheme] = useState(preferredDayScheme || "light");
  const [nightScheme, setNightScheme] = useState(
    preferredNightScheme || "dark"
  );
  const mapStyle = colorMode === "night" ? DARK_MAP_STYLE : LIGHT_MAP_STYLE;

  const textColor =
    colorMode === "night" ? hexToRgb("#c9d1d9") : hexToRgb("#24292f");

  const data = bikePaths as FeatureCollection | Feature | GeometryCollection;
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
    if (typeof window !== undefined) {
      const preferredMode = Cookie.get("colorMode");
      if (preferredMode) {
        if (preferredMode === "night") {
          const preferredScheme = Cookie.get("nightScheme") as string;
          setTimeout(() => {
            setColorMode("night");
            setDayScheme(preferredScheme);
            setNightScheme(preferredScheme);
          }, 50);
        }
        if (preferredMode === "day") {
          const preferredScheme = Cookie.get("dayScheme") as string;
          setTimeout(() => {
            setColorMode("day");
            setDayScheme(preferredScheme);
            setNightScheme(preferredScheme);
          }, 50);
        }
      }
    }
  }, []);

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
          padding: 10,
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

  const handleClose = () => setIsOpen(false);

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
        padding: 10,
      }
    );
    setViewState({
      ...viewport,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };
  return (
    <ThemeProvider
      colorMode={colorMode}
      dayScheme={dayScheme}
      nightScheme={nightScheme}
    >
      <Box width="100vw" height="100vh" color="fg.default" bg="canvas.default">
        <ColorModeSwitcher />
        <Box position="absolute" top={40} right={0} p={3} zIndex={5}>
          <Button variant="small" onClick={handleZoomExtents}>
            Zoom Extents
          </Button>
        </Box>
        <Box
          sx={{ position: "absolute", top: "50vh", left: "50vw", zIndex: 10 }}
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
            <Box p={3} overflow="scroll">
              <Text fontFamily="sans-serif">
                <pre>
                  {JSON.stringify(dialogInfo.object.properties, null, 2)}
                </pre>
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
    </ThemeProvider>
  );
};

export async function getServerSideProps(context: any) {
  const cookies = context.req.cookies;
  const colorMode = cookies && cookies.colorMode ? cookies.colorMode : "day";
  const dayScheme = cookies && cookies.dayScheme ? cookies.dayScheme : "light";
  const nightScheme =
    cookies && cookies.nightScheme ? cookies.nightScheme : "dark";
  return {
    props: {
      preferredColorMode: colorMode,
      preferredDayScheme: dayScheme,
      preferredNightScheme: nightScheme,
    },
  };
}

export default MapPage;
