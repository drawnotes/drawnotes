import { NextApiRequest, NextApiResponse } from "next";
const { App } = require("@slack/bolt");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const challenge = body.challenge;
  if (body.event && body.event.type === "message") {
    const app = new App({
      token: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
    });
    await app.client.chat.postMessage({
      channel: process.env.SLACK_GENERAL_CHANNEL,
      text: "Hello, Dave",
    });
  }
  if (challenge) {
    res.status(200).send(challenge);
  } else {
    res.status(200).send("OK");
  }
};

export default handler;
