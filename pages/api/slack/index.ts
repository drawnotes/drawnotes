import { NextApiRequest, NextApiResponse } from "next";
const { App } = require("@slack/bolt");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });

  const headers = req.headers;
  const url = req.url;
  const method = req.method;
  const body = req.body;
  const event = req.body.event;
  console.log({ headers });
  console.log({ url });
  console.log({ method });
  console.log({ body });
  const challenge = body.challenge;
  if (challenge) {
    console.log({ challenge });
    res.status(200).send(challenge);
  }
  if (event && event.type === "message") {
    const text = event.text;
    const channel = event.channel;
    console.log({ text });
    console.log({ channel });
    await app.client.chat.postMessage({
      channel: event.channel,
      text: "Did you say something?",
    });
  }
  res.status(200).send("OK");
};

export default handler;
