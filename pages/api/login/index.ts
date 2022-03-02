import { NextApiRequest, NextApiResponse } from "next";
import { GITHUB_CALLBACK, GITHUB_CLIENT_ID } from "../../../utils/constants";

const getRedirect = async () => {
  return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK}&scope=repo%20user%3Aemail`;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const referer = req.headers.referer as string;
  const url = new URL(referer);
  const path = url.pathname;
  // const redirect = await getRedirect();
  const redirect = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${
    GITHUB_CALLBACK + path
  }&scope=repo%20user%3Aemail`;
  res.redirect(redirect);
};

export default handler;
