import { Box, ThemeProvider, useTheme } from "@primer/react";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

declare type ColorMode = "day" | "night";
declare type ColorModeWithAuto = ColorMode | "auto";

const Custom404 = () => {
  const { setDayScheme, setNightScheme, resolvedColorMode } = useTheme();
  const [colorMode, setColorMode] = useState<ColorModeWithAuto>(
    resolvedColorMode || "day"
  );

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
    <ThemeProvider colorMode={colorMode}>
      <Box
        height="100vh"
        width="100vw"
        bg="canvas.default"
        color="fg.default"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Box>
          <img src="/assets/oops.gif" width="100%" height="100%" />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Custom404;
