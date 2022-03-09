import { App } from "@slack/bolt";
import { NextApiRequest, NextApiResponse } from "next";
import {
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_USER_OAUTH_TOKEN,
  SLACK_WEBHOOK,
} from "../../../utils/constants";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const botApp = new App({
    token: SLACK_BOT_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
  });

  const userApp = new App({
    token: SLACK_USER_OAUTH_TOKEN,
    signingSecret: SLACK_SIGNING_SECRET,
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
    if (text.includes("cleanup")) {
      const results = await botApp.client.search.messages({
        token: SLACK_USER_OAUTH_TOKEN,
        query: "drawnotes",
        sort: "timestamp",
        sort_dir: "desc",
      });
      if (results.messages && results.messages?.matches!.length > 0) {
        for (const match of results.messages.matches!) {
          await userApp.client.chat.delete({
            channel: match.channel!.id as string,
            ts: match.ts as string,
            as_user: true,
          });
        }
      }
    } else {
      await botApp.client.chat.postMessage({
        channel: channel,
        text: "Did you say something?",
      });
    }
  }
  res.status(200).send("OK");
};

export default handler;
