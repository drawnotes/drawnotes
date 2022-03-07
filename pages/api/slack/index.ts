import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const challenge = body.challenge;
  res.status(200).send(challenge);
};

export default handler;
