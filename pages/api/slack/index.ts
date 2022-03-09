import { App } from "@slack/bolt";
import { NextApiRequest, NextApiResponse } from "next";
import {
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_USER_OAUTH_TOKEN,
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
  if (challenge) {
    res.status(200).send(challenge);
  }
  if (event && event.type === "app_mention") {
    const text = event.text;
    const channel = event.channel;
    if (text.includes("cleanup")) {
      const results = await botApp.client.search.messages({
        token: SLACK_USER_OAUTH_TOKEN,
        query: channel === "C02SFS0T28L" ? "google" : "drawnotes",
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
      const cleanup = await botApp.client.search.messages({
        token: SLACK_USER_OAUTH_TOKEN,
        query: "cleanup",
        sort: "timestamp",
        sort_dir: "desc",
      });
      if (cleanup.messages && cleanup.messages?.matches!.length > 0) {
        for (const match of cleanup.messages.matches!) {
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
