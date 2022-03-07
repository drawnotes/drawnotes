// Expose environment variables to the browser by prefixing with NEXT_PUBLIC_

export const APIKEY = process.env.NEXT_PUBLIC_APIKEY as string;
export const MAPBOX_ACCESS_TOKEN = process.env
  .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
export const GITHUB_CLIENT_ID =
  process.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID_DEV;
export const GITHUB_CLIENT_SECRET =
  process.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET_DEV;
export const GITHUB_CALLBACK =
  process.env.NEXT_PUBLIC_GITHUB_CALLBACK || "http://localhost:3000/api/auth";
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD as string;
export const GITHUB_GRAPHQL_PROXY =
  process.env.NEXT_PUBLIC_GITHUB_GRAPHQL_PROXY ||
  "http://localhost:3000/api/github";
export const GITHUB_GIT_PROXY =
  process.env.NEXT_PUBLIC_GITHUB_GIT_PROXY || "http://localhost:3000/api/proxy";
export const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK as string;
export const SLACK_CHANNEL_ID = process.env
  .NEXT_PUBLIC_SLACK_CHANNEL_ID as string;
