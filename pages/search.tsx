import "@fontsource/libre-baskerville";
import { Box, TextInput, ThemeProvider } from "@primer/react";
import Cookie from "js-cookie";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ColorModeSwitcher from "../components/ColorModeSwitcher";
import { NextPrimerLink } from "../components/NextPrimerLink";
import useSearch from "../utils/useSearch";

interface Query {
  query: string;
  nonce: number;
}

declare type ColorMode = "day" | "night";
declare type ColorModeWithAuto = ColorMode | "auto";

interface Props {
  preferredColorMode: ColorModeWithAuto;
  preferredDayScheme: string;
  preferredNightScheme: string;
}

const Search: NextPage<Props> = ({
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
  const router = useRouter();
  const { query } = useRouter();
  const { q } = query;
  const [input, setInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<Query | {}>({});
  const { results, error, loading } = useSearch(searchQuery as Query);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (q) {
      setInput(q as string);
      const nonce = new Date().getTime();
      setSearchQuery({
        query: q,
        nonce: nonce,
      });
    }
  }, [q]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setInput(value);
  };

  const handleSubmit = (event: KeyboardEvent) => {
    if (event.key === "Enter" && input) {
      inputRef.current?.blur();
      const nonce = new Date().getTime();
      setSearchQuery({
        query: input,
        nonce: nonce,
      });
      const searchTerms = encodeURIComponent(input);
      router.push(`/search?q=${searchTerms}`);
    }
  };

  return (
    <ThemeProvider
      colorMode={colorMode}
      dayScheme={dayScheme}
      nightScheme={nightScheme}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <Box
        width="100vw"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent={`${loading ? "" : "center"}`}
        color="fg.default"
        bg="canvas.default"
        pb={100}
      >
        <ColorModeSwitcher />
        <Box m={4} color="fg.muted" fontFamily="Libre Baskerville">
          Google text-only search
        </Box>
        <Box m={4}>
          <TextInput
            ref={inputRef}
            type="text"
            placeholder="search"
            value={input}
            onChange={handleChange}
            onKeyPress={handleSubmit}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            p={4}
          />
        </Box>
        <Box maxWidth="720px">
          {error && (
            <Box>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </Box>
          )}
          {results &&
            results.map((result, index) => {
              return (
                <Box key={index} m={4}>
                  <Box color="fg.muted">{result.source}</Box>
                  <Box my={2}>
                    <NextPrimerLink href={result.href}>
                      {result.title}
                    </NextPrimerLink>
                  </Box>
                  <Box
                    color="fg.muted"
                    fontFamily="Libre Baskerville"
                    fontSize={14}
                  >
                    {result.blurb}
                  </Box>
                </Box>
              );
            })}
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
  return {
    props: {
      preferredColorMode: colorMode,
      preferredDayScheme: dayScheme,
      preferredNightScheme: nightScheme,
    },
  };
}

export default Search;
