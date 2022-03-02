// https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps

import {
  GITHUB_CALLBACK,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from "../utils/constants";

const accessToken = {
  baseUrl: "https://github.com/login/oauth/access_token",
  params: (code: string) => {
    client_id: GITHUB_CLIENT_ID;
    client_secret: GITHUB_CLIENT_SECRET;
    code: code;
  },
};

export const getGithubAccessToken = async (authorizationCode: string) => {
  const response = await fetch(
    `${accessToken.baseUrl}?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${authorizationCode}&redirect_uri=${GITHUB_CALLBACK}`,
    {
      method: "POST",
    }
  );
  const body = await response.text();
  const oauthResponse: any = body.split("&").reduce((accumulator, current) => {
    const [k, v] = current.split("=");
    return Object.assign(accumulator, { [k]: v });
  }, {});
  const { access_token } = oauthResponse;
  return access_token;
};

export const fetchProfile = async (accessToken: string) => {
  const response = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  return await response.json();
};

export const fetchEmail = async (accessToken: string) => {
  const response = await fetch("https://api.github.com/user/emails", {
    method: "GET",
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  const emails = await response.json();
  return emails[0];
};
