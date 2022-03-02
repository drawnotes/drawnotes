import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = req.url;
  const query = req.query;
  const headers = req.headers;
  res.status(200).send(
    JSON.stringify({
      url: url,
      query: query,
      headers: headers,
    })
  );
};

export default handler;
