// https://softwareengineeringdaily.com/category/all-episodes/exclusive-content/Podcast/

import "@fontsource/libre-baskerville";
import { Box, TextInput, ThemeProvider } from "@primer/react";
import Fuse from "fuse.js";
import Cookie from "js-cookie";
import type { NextPage } from "next";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { NextPrimerLink } from "../components/NextPrimerLink";
import episodeDescriptions from "../sampledata/fulltext.json";

declare type ColorMode = "day" | "night";
declare type ColorModeWithAuto = ColorMode | "auto";

interface Result {
  title: string;
  href: string;
  date: string;
  excerpt: string;
  src: string;
  terms: string;
}

interface Props {
  preferredColorMode: ColorModeWithAuto;
  preferredDayScheme: string;
  preferredNightScheme: string;
}

const Softwaredaily: NextPage<Props> = ({
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
  const inputRef = useRef<HTMLInputElement>(null);
  const episodes = episodeDescriptions as Result[];
  const fuse = new Fuse(episodes, {
    keys: ["title", "terms"],
    ignoreLocation: true,
    threshold: 0,
  });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[] | undefined>(
    episodes as Result[]
  );
  const debounceRef = useRef<number | undefined>();

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
    if (query === "") {
      setResults(episodes as Result[]);
    } else {
      clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(async () => {
        const searchResults = fuse
          .search(query)
          .map((result) => result.item) as Result[];
        setResults(searchResults);
      }, 500);
    }
  }, [query]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setQuery(value);
  };

  const handleSubmit = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (query) {
        const searchResults = fuse
          .search(query)
          .map((result) => result.item) as Result[];
        setResults(searchResults);
      } else {
        setResults(episodes as Result[]);
      }
    }
  };

  return (
    <ThemeProvider
      colorMode={colorMode}
      dayScheme={dayScheme}
      nightScheme={nightScheme}
    >
      <Box
        width="100vw"
        minHeight="100vh"
        color="fg.default"
        bg="canvas.default"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <ColorModeSwitcher />
        <Box mt={10} mb={4}>
          Software Daily Podcasts
        </Box>
        <Box mb={10} mt={4}>
          <TextInput
            ref={inputRef}
            type="text"
            placeholder="search"
            value={query}
            onChange={handleChange}
            onKeyPress={handleSubmit}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            p={4}
          />
        </Box>
        <Box maxWidth="800px">
          {results &&
            results.slice(0, 100).map((result, index) => (
              <Box key={index} m={4} display="flex">
                <Box>
                  <Box m={2}>
                    <NextPrimerLink href={result.href}>
                      {result.title}
                    </NextPrimerLink>
                  </Box>
                  <Box m={2}>{result.date}</Box>
                  <Box m={2}>{result.excerpt}</Box>
                </Box>
                {result.src && (
                  <Box m={2}>
                    <Image src={result.src} width={600} height={300} />
                  </Box>
                )}
              </Box>
            ))}
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

export default Softwaredaily;
