import { App } from "@slack/bolt";
import { NextApiRequest, NextApiResponse } from "next";
import {
  SLACK_BOT_TOKEN,
  SLACK_SIGNING_SECRET,
  SLACK_USER_OAUTH_TOKEN,
  SLACK_VERIFICATION_TOKEN,
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

  const body = req.body;
  const event = req.body.event;
  const challenge = body.challenge;
  if (body.token === SLACK_VERIFICATION_TOKEN) {
    if (challenge) {
      res.status(200).send(challenge);
    }
    if (event && event.type === "app_mention") {
      const text = event.text;
      const channel = event.channel;
      if (text.includes("cleanup")) {
        const results = await botApp.client.conversations.history({
          channel: channel,
        });
        if (results.messages && results.messages.length > 0) {
          for (const match of results.messages) {
            await userApp.client.chat.delete({
              channel: channel,
              ts: match.ts as string,
              as_user: true,
            });
          }
        }
        await userApp.client.chat.delete({
          channel: channel,
          ts: event.ts,
          as_user: true,
        });
      } else {
        await botApp.client.chat.postMessage({
          channel: channel,
          text: "Did you say something?",
        });
      }
      res.status(200).send("OK");
    }
  } else {
    res.redirect("/404");
  }
};

export default handler;
