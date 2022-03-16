import "@fontsource/libre-baskerville";
import { MarkGithubIcon } from "@primer/octicons-react";
import { Box, StyledOcticon, Text, ThemeProvider } from "@primer/react";
import Cookie from "js-cookie";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineLinkedin } from "react-icons/ai";
import { VscFilePdf } from "react-icons/vsc";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { NextPrimerLink } from "../components/NextPrimerLink";
import NotesLogo from "../components/NotesLogo";
import { getBeaconMessage } from "../utils/getBeaconMessage";
import { useGetOrientation } from "../utils/useGetOrientation";

declare type ColorMode = "day" | "night";
declare type ColorModeWithAuto = ColorMode | "auto";

interface Props {
  preferredColorMode: ColorModeWithAuto;
  preferredDayScheme: string;
  preferredNightScheme: string;
  country: string;
  region: string;
  city: string;
  lat: string;
  long: string;
  ip: string;
  ua: string;
}

const Home: NextPage<Props> = ({
  preferredColorMode,
  preferredDayScheme,
  preferredNightScheme,
  country,
  region,
  city,
  lat,
  long,
  ip,
  ua,
}) => {
  const { orientation, height } = useGetOrientation();
  const [colorMode, setColorMode] = useState<ColorModeWithAuto>(
    preferredColorMode || "day"
  );
  const [dayScheme, setDayScheme] = useState(preferredDayScheme || "light");
  const [nightScheme, setNightScheme] = useState(
    preferredNightScheme || "dark"
  );

  const message = useMemo(
    () => getBeaconMessage({ country, region, city, lat, long, ip, ua }),
    [country, region, city, lat, long, ip, ua]
  );

  useEffect(() => {
    async function sendBeacon(msg: string) {
      await fetch("/api/beacon", {
        method: "POST",
        body: msg,
      });
    }
    if (typeof window !== "undefined") {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/beacon", JSON.stringify(message));
      } else {
        sendBeacon(JSON.stringify(message));
      }
    }
  }, [message]);

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
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        color="fg.default"
        bg="canvas.default"
      >
        <ColorModeSwitcher />

        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            fontFamily="Libre Baskerville"
            m={2}
            mt={height && height < 800 ? 0 : 10}
          >
            <Box fontSize={height && height < 800 ? 50 : [40, 60, 80, 100]}>
              <Text>ansel brandt</Text>
            </Box>
            <Box
              fontSize={[14, 14, 16, 20]}
              mt={height && height < 800 ? 0 : 4}
            >
              <Box m={2}>
                <Text>Typescript, React, Next.js, GraphQL</Text>
              </Box>
              <Box m={2}>
                <Text>Mapping, GIS, data wrangling</Text>
              </Box>
              <Box m={2}>
                <Text>
                  <Box>
                    <NextPrimerLink href="/dashboard">
                      Realtime data visualization
                    </NextPrimerLink>
                  </Box>
                </Text>
              </Box>
              <Box m={2}>
                <Text>IoT</Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          mt={height && height < 800 ? 0 : 6}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <NextPrimerLink href="/notes">
            <Box
              color="fg.default"
              sx={{
                "&:hover": {
                  color: "accent.fg",
                },
              }}
            >
              <Box m={1} width={[50, 60, 80, 100]}>
                <NotesLogo />
              </Box>
              <Box fontFamily="Libre Baskerville" m={1}>
                <Text>Draw Notes</Text>
              </Box>
            </Box>
          </NextPrimerLink>
        </Box>
        <Box display="flex" mt={height && height < 800 ? 0 : 10}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            m={4}
          >
            <Box m={1}>
              <NextPrimerLink href="/anselbrandt.pdf">
                <StyledOcticon
                  icon={VscFilePdf}
                  size={25}
                  color="fg.default"
                  sx={{
                    "&:hover": {
                      color: "accent.fg",
                    },
                  }}
                />
              </NextPrimerLink>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            m={4}
          >
            <Box m={1}>
              <NextPrimerLink href='"https://github.com/anselbrandt"'>
                <StyledOcticon
                  icon={MarkGithubIcon}
                  size={25}
                  color="fg.default"
                  sx={{
                    "&:hover": {
                      color: "accent.fg",
                    },
                  }}
                />
              </NextPrimerLink>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            m={4}
          >
            <Box m={1}>
              <NextPrimerLink href='"https://www.linkedin.com/in/anselbrandt"'>
                <StyledOcticon
                  icon={AiOutlineLinkedin}
                  size={25}
                  color="fg.default"
                  sx={{
                    "&:hover": {
                      color: "accent.fg",
                    },
                  }}
                />
              </NextPrimerLink>
            </Box>
          </Box>
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

export default Home;
