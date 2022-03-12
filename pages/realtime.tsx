import { TripsLayer } from "@deck.gl/geo-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { Box, Button, Dialog, Text, useTheme } from "@primer/react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import {
  FlyToInterpolator,
  StaticMap,
  WebMercatorViewport,
} from "react-map-gl";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { MAPBOX_ACCESS_TOKEN } from "../utils/constants";
import { GTFS, GTFStoTrips, mergeTrips } from "../utils/transit";
import useIntervalFetch from "../utils/useIntervalFetch";

const url = "/api/gtfs";
const URL = "https://api.stm.info/pub/od/gtfs-rt/ic/v2/vehiclePositions";
const options = {
  method: "GET",
  headers: {
    url: URL,
  },
};

interface Props {}

const DARK_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const LIGHT_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const MapPage: NextPage<Props> = ({}) => {
  const { data, error } = useIntervalFetch<GTFS>(url, 20000, options);
  const [current, setCurrent] = useState<any>();
  const [previous, setPrevious] = useState<any>();
  const [tripsData, setTripsData] = useState<any>();
  const [viewState, setViewState] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [dialogInfo, setDialogInfo] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState<any>(null);
  const { colorScheme } = useTheme();

  // const tripsData = trips as Trips;
  const mapStyle = colorScheme!.includes("dark")
    ? DARK_MAP_STYLE
    : LIGHT_MAP_STYLE;
  const bounding = [-73.956862, 45.402657, -73.480099, 45.701392];

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
  }, []);

  useEffect(() => {
    if (data) {
      if (current) {
        setPrevious(current);
        const currentTrips = GTFStoTrips(data);
        setCurrent(currentTrips);
        const merged = mergeTrips(currentTrips, previous);
        setTripsData(merged);
      } else {
        const currentTrips = GTFStoTrips(data);
        setCurrent(currentTrips);
        setTripsData(currentTrips);
      }
    }
  }, [data]);

  const handleChangeViewState = ({ viewState }: any) => {
    setViewState(viewState);
    setInfo({ lat: viewState.latitude, long: viewState.longitude });
  };

  const handleClose = () => setIsOpen(false);

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

  const layers = tripsData
    ? [
        new TripsLayer({
          id: "trips",
          visible: true,
          data: tripsData ? tripsData.trips : undefined,
          getPath: (d: any) => (tripsData ? d.path : undefined),
          getTimestamps: (d) => (tripsData ? d.timestamps : undefined),
          getColor: () => [23, 184, 190] as any,
          opacity: 100,
          widthMinPixels: 4,
          jointRounded: true,
          trailLength: 1,
          currentTime: tripsData ? tripsData.timestamp : undefined,
        }),
        new ScatterplotLayer({
          id: "scatterplot-layer",
          data: tripsData ? tripsData.trips : undefined,
          pickable: true,
          opacity: 0.8,
          stroked: false,
          filled: true,
          radiusScale: 2,
          radiusMinPixels: 2,
          radiusMaxPixels: 10,
          lineWidthMinPixels: 1,
          getPosition: (d: any) =>
            tripsData ? d.path[d.path.length - 1] : undefined,
          getRadius: () => 6,
          getFillColor: () => [253, 128, 93],
          getLineColor: () => [0, 0, 0],
        }),
      ]
    : [];
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
