import { BaseStyles, ThemeProvider } from "@primer/react";
import { SSRProvider } from "@react-aria/ssr";
import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import cookie from "cookie";
import type { NextComponentType, NextPageContext } from "next";
import type { NextRouter } from "next/router";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import "../styles/globals.css";
import { GITHUB_GRAPHQL_PROXY } from "../utils/constants";
import "./_app.css";

declare type ColorMode = "day" | "night";
declare type ColorModeWithAuto = ColorMode | "auto";

export interface AppRenderProps {
  pageProps: object;
  err?: Error;
  Component: NextComponentType<NextPageContext, AppRenderProps, object>;
  router: NextRouter;
  colorMode: string;
  dayScheme: string;
  nightScheme: string;
}

function typedUpdateQuery<Result, Query>(
  cache: Cache,
  input: QueryInput,
  result: any,
  fn: (result: Result, query: Query) => Query
) {
  return cache.updateQuery(input, (data) => fn(result, data as any) as any);
}

export const client = createClient({
  url: GITHUB_GRAPHQL_PROXY,
  exchanges: [dedupExchange, cacheExchange(), fetchExchange],
});

function App({
  Component,
  pageProps,
  colorMode,
  dayScheme,
  nightScheme,
}: AppRenderProps) {
  const props = { ...pageProps };
  return (
    <Provider value={client}>
      <SSRProvider>
        <ThemeProvider
          colorMode={colorMode as ColorModeWithAuto}
          dayScheme={dayScheme}
          nightScheme={nightScheme}
          preventSSRMismatch
        >
          <BaseStyles />
          <Component {...props} />
        </ThemeProvider>
      </SSRProvider>
    </Provider>
  );
}

App.getServerSideProps = async ({ ctx }: any) => {
  const cookies = ctx.req?.headers.cookie;
  const colorMode =
    cookies && cookie.parse(cookies).colorMode
      ? cookie.parse(cookies).colorMode
      : "day";
  const dayScheme =
    cookies && cookie.parse(cookies).dayScheme
      ? cookie.parse(cookies).dayScheme
      : "light";
  const nightScheme =
    cookies && cookie.parse(cookies).nightScheme
      ? cookie.parse(cookies).nightScheme
      : "dark";
  return {
    pageProps: {},
    colorMode: colorMode,
    dayScheme: dayScheme,
    nightScheme: nightScheme,
  };
};

export default App;
