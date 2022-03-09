import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.headers);
  console.log(req.url);
  console.log(req.method);
  console.log(req.body || "no request body");
  res.status(200).send("OK");
};

export default handler;
