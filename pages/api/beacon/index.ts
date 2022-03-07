import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { IS_PROD, SLACK_WEBHOOK } from "../../../utils/constants";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  if (IS_PROD) {
    await fetch(SLACK_WEBHOOK, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    });
  }
  res.status(200).send("OK");
};

export default handler;
