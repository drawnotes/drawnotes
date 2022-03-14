import DeckGL from "@deck.gl/react";
import { Box, useTheme } from "@primer/react";
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
}

const mapPanel: NextPage<Props> = ({ mapSize }) => {
  const { colorScheme } = useTheme();
  const mapStyle = colorScheme!.includes("dark")
    ? DARK_MAP_STYLE
    : LIGHT_MAP_STYLE;
  const [viewState, setViewState] = useState<any>(null);
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
    }
  }, [bounding]);

  const handleChangeViewState = ({ viewState }: any) => {
    setViewState(viewState);
  };

  return (
    <Box position="relative" height="100%">
      <DeckGL
        width={mapSize.width}
        height={mapSize.height}
        layers={[]}
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
      </DeckGL>
    </Box>
  );
};

export default mapPanel;
