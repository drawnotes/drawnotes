import { NextApiRequest, NextApiResponse } from "next";
const { App } = require("@slack/bolt");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });

  const headers = req.headers;
  const body = req.body;
  const event = req.body.event;
  console.log({ headers });
  console.log({ body });
  console.log(body.event.blocks);
  const challenge = body.challenge;
  if (challenge) {
    res.status(200).send(challenge);
  }
  if (event && event.type === "app_mention") {
    const text = event.text;
    const channel = event.channel;
    await app.client.chat.postMessage({
      channel: channel,
      text: "Did you say something?",
    });
  }
  res.status(200).send("OK");
};

export default handler;
