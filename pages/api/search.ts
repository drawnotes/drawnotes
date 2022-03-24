import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { filter, getImages, getLinks } from "../../utils/search";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const search = req.url?.replace("/api", "");
  const url = "https://google.com" + search;
  const response = await fetch(url);
  if (response.ok) {
    const text = await response.text();
    const filtered = filter(text);
    if (search?.includes("&tbm=isch")) {
      const images = getImages(filtered);
      res.status(200).json(images);
    } else {
      const links = getLinks(filtered);
      res.status(200).json(links);
    }
  } else {
    res.status(response.status).send(response.statusText);
  }
}
