import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { sessionOptions } from "../../../utils/session";

export const config = {
  api: {
    bodyParser: false,
  },
};

const allowHeaders = [
  "accept-encoding",
  "accept-language",
  "accept",
  "access-control-allow-origin",
  "authorization",
  "cache-control",
  "connection",
  "content-length",
  "content-type",
  "dnt",
  "git-protocol",
  "pragma",
  "range",
  "referer",
  "user-agent",
  "x-authorization",
  "x-http-method-override",
  "x-requested-with",
];

interface Headers {
  [key: string]: any;
}

const removeParams = ["city", "region", "ua", "country", "ip", "long", "lat"];

async function proxyRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Remove Next.js API route from url
    const baseUrl = req.url!.replace("/api/proxy/", "");
    const url = new URL("https://" + baseUrl);
    removeParams.forEach((param) => url.searchParams.delete(param));
    let headers: Headers = {};
    for (let header of allowHeaders) {
      if (req.headers[header]) {
        headers[header] = req.headers[header];
      }
    }
    // GitHub uses user-agent sniffing for git/* and changes its behavior which is frustrating
    if (!headers["user-agent"] || !headers["user-agent"].startsWith("git/")) {
      headers["user-agent"] = "git/@isomorphic-git/cors-proxy";
    }
    if (req.session.user) {
      headers["authorization"] = `Basic ${Buffer.from(
        req.session.user.accessToken!
      ).toString("base64")}`;
    }
    const response = await fetch(url.href, {
      method: req.method,
      headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req : undefined,
    });
    res.statusCode = response.status;
    if (response.redirected) {
      res.setHeader("x-redirected-url", response.url);
    }
    response.body!.pipe(res);
  } catch (err) {
    const error: any = err;
    res.status(500).send(error.message);
  }
}

export default withIronSessionApiRoute(proxyRoute, sessionOptions);
