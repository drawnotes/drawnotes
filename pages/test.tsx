import "@fontsource/libre-baskerville";
import { Box, ThemeProvider } from "@primer/react";
import Cookie from "js-cookie";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { MobileNavbar } from "../dashboardComponents/MobileNavbar";
import { useGetBreakpoint } from "../utils/useGetBreakpoint";

declare type ColorMode = "day" | "night";
declare type ColorModeWithAuto = ColorMode | "auto";

interface Props {
  preferredColorMode: ColorModeWithAuto;
  preferredDayScheme: string;
  preferredNightScheme: string;
}

const Test: NextPage<Props> = ({
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
  const [selected, setSelected] = useState("map");
  const { breakpoint } = useGetBreakpoint();

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

  const handleSetSelected = (view: string) => {
    setSelected(view);
  };

  return (
    <ThemeProvider
      colorMode={colorMode}
      dayScheme={dayScheme}
      nightScheme={nightScheme}
    >
      <Box width="100vw" height="100vh" color="fg.default" bg="canvas.default">
        <Box
          position="fixed"
          bottom="0"
          width="100%"
          display="flex"
          justifyContent="center"
        >
          <MobileNavbar
            selected={selected}
            handleSetSelected={handleSetSelected}
            colorMode={colorMode}
          />
        </Box>
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
  const { country, region, city, lat, long, ip, ua } = context.query;
  return {
    props: {
      preferredColorMode: colorMode,
      preferredDayScheme: dayScheme,
      preferredNightScheme: nightScheme,
      country: country,
      region: region,
      city: city,
      lat: lat,
      long: long,
      ip: ip,
      ua: ua,
    },
  };
}

export default Test;
