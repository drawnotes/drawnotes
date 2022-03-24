import "@fontsource/libre-baskerville";
import {
  FilterIcon,
  GlobeIcon,
  GraphIcon,
  MoonIcon,
  SunIcon,
  TerminalIcon,
} from "@primer/octicons-react";
import { Box, StyledOcticon, ThemeProvider } from "@primer/react";
import Cookie from "js-cookie";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Navbar, NavbarLink, NavbarLinks } from "../components/Navbar";
import { useGetOrientation } from "../utils/useGetOrientation";

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
  const { orientation, height } = useGetOrientation();
  const [colorMode, setColorMode] = useState<ColorModeWithAuto>(
    preferredColorMode || "day"
  );
  const [dayScheme, setDayScheme] = useState(preferredDayScheme || "light");
  const [nightScheme, setNightScheme] = useState(
    preferredNightScheme || "dark"
  );
  const [selected, setSelected] = useState("map");

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
          <Navbar aria-label="Main">
            <NavbarLinks>
              <NavbarLink
                selected={selected === "map"}
                onClick={() => setSelected("map")}
                sx={{
                  "&:hover": { cursor: "pointer" },
                }}
              >
                <StyledOcticon size={20} icon={GlobeIcon} />
              </NavbarLink>
              <NavbarLink
                selected={selected === "filters"}
                onClick={() => setSelected("filters")}
                sx={{
                  "&:hover": { cursor: "pointer" },
                }}
              >
                <StyledOcticon size={20} icon={FilterIcon} />
              </NavbarLink>
              <NavbarLink
                selected={selected === "charts"}
                onClick={() => setSelected("charts")}
                sx={{
                  "&:hover": { cursor: "pointer" },
                }}
              >
                <StyledOcticon size={20} icon={GraphIcon} />
              </NavbarLink>
              <NavbarLink
                selected={selected === "logs"}
                onClick={() => setSelected("logs")}
                sx={{
                  "&:hover": { cursor: "pointer" },
                }}
              >
                <StyledOcticon size={20} icon={TerminalIcon} />
              </NavbarLink>
              <NavbarLink
                selected={selected === "preferences"}
                onClick={() => setSelected("preferences")}
                sx={{
                  "&:hover": { cursor: "pointer" },
                }}
              >
                <StyledOcticon
                  size={20}
                  icon={colorMode === "night" ? MoonIcon : SunIcon}
                />
              </NavbarLink>
            </NavbarLinks>
          </Navbar>
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
