import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../../../utils/session";
const { App } = require("@slack/bolt");

const botApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const userApp = new App({
  token: process.env.SLACK_USER_OAUTH_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.session.user && req.session.user.login === "anselbrandt") {
    try {
      const results = await botApp.client.search.messages({
        token: process.env.SLACK_USER_OAUTH_TOKEN,
        query: "drawnotes",
      });
      for (const match of results.messages.matches) {
        await userApp.client.chat.delete({
          channel: match.channel.id,
          ts: match.ts,
          as_user: true,
        });
      }
      res
        .status(200)
        .send(`deleted ${results.messages.matches.length} messages`);
    } catch (error: any) {
      if (error.message !== "An API error occurred: message_not_found") {
        console.log(error);
        res.status(500).send(error.message);
      }
    }
  } else {
    res.redirect("/404");
  }
};

export default withIronSessionApiRoute(handler, sessionOptions);
