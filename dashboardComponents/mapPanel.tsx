import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { Box, Dialog, Text, useTheme } from "@primer/react";
import { FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { StaticMap, WebMercatorViewport } from "react-map-gl";
import { MAPBOX_ACCESS_TOKEN } from "../utils/constants";

const DARK_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const LIGHT_MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface Props {
  mapSize: { width: number; height: number };
  data: FeatureCollection | undefined;
}

const mapPanel: NextPage<Props> = ({ mapSize, data }) => {
  const { colorScheme } = useTheme();
  const mapStyle = colorScheme!.includes("dark")
    ? DARK_MAP_STYLE
    : LIGHT_MAP_STYLE;

  const bounding = [-73.956862, 45.402657, -73.480099, 45.701392];
  const [viewState, setViewState] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [dialogInfo, setDialogInfo] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewport = new WebMercatorViewport({
        width: mapSize.width,
        height: mapSize.height,
      }).fitBounds([bounding.slice(0, 2), bounding.slice(2, 4)] as [
        [number, number],
        [number, number]
      ]);
      setViewState(viewport);
      setInfo({ lat: viewport.latitude, long: viewport.longitude });
    }
  }, []);

  const handleChangeViewState = ({ viewState }: any) => {
    setViewState(viewState);
    setInfo({ lat: viewState.latitude, long: viewState.longitude });
  };

  const handleClose = () => setIsOpen(false);

  const layers = [
    new GeoJsonLayer({
      id: "line-layer",
      data: data,
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
  ];

  return (
    <Box position="relative" height="100%" width="100%">
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
