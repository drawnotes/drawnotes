import { BaseStyles, ThemeProvider } from "@primer/react";
import { SSRProvider } from "@react-aria/ssr";
import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache";
import type { AppProps } from "next/app";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import "../styles/globals.css";
import { GITHUB_GRAPHQL_PROXY } from "../utils/constants";
import "./_app.css";

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

function App({ Component, pageProps }: AppProps) {
  const props = { ...pageProps };
  return (
    <Provider value={client}>
      <SSRProvider>
        <ThemeProvider>
          <BaseStyles />
          <Component {...props} />
        </ThemeProvider>
      </SSRProvider>
    </Provider>
  );
}

export default App;
