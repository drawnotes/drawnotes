import { Box, ThemeProvider } from "@primer/react";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import FilterPanel from "../dashboardComponents/filterPanel";
import LogPanel from "../dashboardComponents/logPanel";
import MapPanel from "../dashboardComponents/mapPanel";
import { GTFS } from "../utils/transit";
import useIntervalFetch from "../utils/useIntervalFetch";

declare type ColorMode = "day" | "night";
declare type ColorModeWithAuto = ColorMode | "auto";

const url = "/api/gtfs";
const URL = "https://api.stm.info/pub/od/gtfs-rt/ic/v2/vehiclePositions";
const options = {
  method: "GET",
  headers: {
    url: URL,
  },
};

interface Props {
  preferredColorMode: ColorModeWithAuto;
  preferredDayScheme: string;
  preferredNightScheme: string;
}

const Dashboard: NextPage<Props> = ({
  preferredColorMode,
  preferredDayScheme,
  preferredNightScheme,
}) => {
  const { data, error } = useIntervalFetch<GTFS>(url, 20000, options);

  const [colorMode, setColorMode] = useState<ColorModeWithAuto>(
    preferredColorMode || "day"
  );
  const [dayScheme, setDayScheme] = useState(preferredDayScheme || "light");
  const [nightScheme, setNightScheme] = useState(
    preferredNightScheme || "dark"
  );
  const deckRef = useRef<HTMLDivElement>(null);
  const observer = useRef<ResizeObserver>();
  const [mapSize, setMapSize] = useState<any>();

  useEffect(() => {
    function handleResize() {
      if (deckRef.current) {
        const width = deckRef.current.clientWidth;
        const height = deckRef.current.clientHeight;
        setMapSize({ width: width, height: height });
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      observer.current = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setMapSize({ width: width, height: height });
      });
    }
  }, []);

  useEffect(() => {
    if (observer.current && deckRef.current) {
      observer.current.observe(deckRef.current);
    }
    return () => {
      if (observer.current && deckRef.current !== null) {
        observer.current.unobserve(deckRef.current);
      }
    };
  }, [deckRef, observer]);
  return (
    <ThemeProvider
      colorMode={colorMode}
      dayScheme={dayScheme}
      nightScheme={nightScheme}
    >
      <Box color="fg.default" bg="canvas.default" width="100vw" height="100vh">
        <ColorModeSwitcher />
        <FilterPanel>
          <LogPanel>
            <Box
              height="100%"
              width="100%"
              ref={deckRef}
              bg="canvas.default"
              overflow="scroll"
            >
              {mapSize && <MapPanel mapSize={mapSize} data={data} />}
            </Box>
          </LogPanel>
        </FilterPanel>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
