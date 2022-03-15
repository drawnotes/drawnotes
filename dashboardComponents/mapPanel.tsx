import { TripsLayer } from "@deck.gl/geo-layers";
import { GeoJsonLayer } from "@deck.gl/layers";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import DeckGL from "@deck.gl/react";
import { SearchIcon, SyncIcon } from "@primer/octicons-react";
import {
  Box,
  Button,
  Dialog,
  StyledOcticon,
  Text,
  useTheme,
} from "@primer/react";
import bbox from "@turf/bbox";
import { FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import {
  FlyToInterpolator,
  StaticMap,
  WebMercatorViewport,
} from "react-map-gl";
import routes from "../sampledata/routes.json";
import stops from "../sampledata/stops.json";
import { MAPBOX_ACCESS_TOKEN } from "../utils/constants";
import {
  getBearing,
  GTFS,
  GTFStoTrips,
  mergeTrips,
  Trip,
} from "../utils/transit";

const DARK_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const LIGHT_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const MODEL_URL = "assets/bus.glb";

interface Props {
  mapSize: { width: number; height: number };
  data: GTFS | undefined;
}

const mapPanel: NextPage<Props> = ({ mapSize, data }) => {
  const { colorScheme } = useTheme();
  const mapStyle = colorScheme!.includes("dark")
    ? DARK_MAP_STYLE
    : LIGHT_MAP_STYLE;

  const stopsData = stops as FeatureCollection;
  const routesData = routes as FeatureCollection;
  const [current, setCurrent] = useState<any>();
  const [previous, setPrevious] = useState<any>();
  const [tripsData, setTripsData] = useState<any>();
  const [viewState, setViewState] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [dialogInfo, setDialogInfo] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState<any>(null);

  const bounding = useMemo(() => bbox(routesData), [routesData]);
  const padding = 10;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewport = new WebMercatorViewport({
        width: mapSize.width,
        height: mapSize.height,
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

  const handleZoomExtents = () => {
    const viewport = new WebMercatorViewport({
      width: mapSize.width,
      height: mapSize.height,
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

  const handleClose = () => setIsOpen(false);

  const handleOrient = () => {
    setViewState((prev: any) => {
      return {
        ...prev,
        bearing: prev.bearing !== 0 ? 0 : -57.5,
        transitionDuration: 500,
      };
    });
  };

  const tripsLayer = tripsData
    ? [
        new ScenegraphLayer({
          id: "scenegraph-layer",
          data: tripsData.trips,
          sizeScale: 50,
          scenegraph: MODEL_URL as any,
          _animations: {
            "*": { speed: 1 },
          },
          sizeMinPixels: 1,
          sizeMaxPixels: 6,
          getPosition: (d: Trip) => [
            d.properties.position.longitude,
            d.properties.position.latitude,
            0,
          ],
          getOrientation: (d: any) => {
            const calculatedBearing =
              d.path.length > 1 ? getBearing(d.path[0], d.path[1]) : 90;
            const bearing = d.properties.position.bearing || calculatedBearing;
            return [0, 360 - bearing, 90];
          },
          // transitions: {
          //   getPosition: 20000 as any,
          // },
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
        new TripsLayer({
          id: "trips",
          visible: true,
          data: tripsData.trips,
          getPath: (d: any) => d.path,
          getTimestamps: (d) => d.timestamps,
          getColor: () => [23, 184, 190] as any,
          opacity: 100,
          widthMinPixels: 4,
          jointRounded: true,
          trailLength: 1,
          currentTime: tripsData.timestamp,
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
      ]
    : [];

  const layers: any = [
    new GeoJsonLayer({
      id: "routes-layer",
      data: routesData,
      opacity: 0.8,
      filled: false,
      stroked: true,
      getLineWidth: 8,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 8,
      getLineColor: [23, 184, 190],
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
      id: "stops-layer",
      data: stopsData,
      opacity: 0.8,
      pointType: "circle",
      getPointRadius: 10,
      pointRadiusMinPixels: 1,
      pointRadiusMaxPixels: 10,
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
    ...tripsLayer,
  ];

  return (
    <Box position="relative" height="100%" width="100%">
      <Box
        position="absolute"
        top={0}
        right={0}
        p={2}
        zIndex={5}
        display="flex"
        flexDirection="column"
      >
        <Box>
          <Button variant="small" onClick={handleZoomExtents}>
            <StyledOcticon icon={SearchIcon} /> Extents
          </Button>
        </Box>
        <Box mt={2}>
          <Button variant="small" onClick={handleOrient}>
            <StyledOcticon icon={SyncIcon} /> Rotate
          </Button>
        </Box>
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
        initialViewState={viewState}
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

export default mapPanel;
