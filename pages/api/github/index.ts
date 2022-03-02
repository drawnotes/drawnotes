import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { sessionOptions } from "../../../utils/session";

const github = "https://api.github.com/graphql";

const errorMessage = {
  message: "This endpoint requires you to be authenticated.",
  documentation_url:
    "https://docs.github.com/graphql/guides/forming-calls-with-graphql#authenticating-with-graphql",
};

async function githubRoute(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) {
    res.status(401).json(errorMessage);
  } else {
    const query = req.body.query;
    const variables = req.body.variables;
    if (Object.keys(variables).includes("ownerId")) {
      variables.ownerId = req.session.user.id;
    }
    const token = req.session.user.accessToken;
    const response = await fetch(github, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });
    const json = await response.json();
    res.status(200).json(json);
  }
}

export default withIronSessionApiRoute(githubRoute, sessionOptions);
