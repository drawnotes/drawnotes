import { App } from "@slack/bolt";
import { NextApiRequest, NextApiResponse } from "next";
import { SLACK_WEBHOOK } from "../../../utils/constants";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });

  const headers = req.headers;
  const body = req.body;
  const event = req.body.event;
  const challenge = body.challenge;
  const location = {
    city: headers["x-vercel-ip-city"],
    region: headers["x-vercel-ip-country-region"],
    country: headers["x-vercel-ip-country"],
    lat: headers["x-vercel-ip-latitude"],
    long: headers["x-vercel-ip-longitude"],
    ip: headers["x-real-ip"],
    ua: headers["user-agent"],
  };
  const blocks = {
    text: `Server request from ${location.city}, ${location.region} ${location.country}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${location.ua}
${location.city}, ${location.region} ${location.country}
${location.ip}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Google Map",
            },
            url: `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.long}`,
          },
        ],
      },
    ],
  };
  await fetch(SLACK_WEBHOOK, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blocks),
  });
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
