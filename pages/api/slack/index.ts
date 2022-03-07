import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query.challenge;
  res.status(200).send(query);
};

export default handler;
