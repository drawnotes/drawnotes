import { App } from "@slack/bolt";
import { NextApiRequest, NextApiResponse } from "next";
import {
  SLACK_BOT_TOKEN,
  SLACK_GENERAL_CHANNEL,
  SLACK_SIGNING_SECRET,
} from "../../../utils/constants";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const challenge = body.challenge;
  try {
    const app = new App({
      token: SLACK_BOT_TOKEN,
      signingSecret: SLACK_SIGNING_SECRET,
    });
    const result = await app.client.chat.postMessage({
      channel: SLACK_GENERAL_CHANNEL,
      text: JSON.stringify(body),
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
  res.status(200).send(challenge);
};

export default handler;
