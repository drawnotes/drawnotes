import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { githubUser, User } from "../../../types";
import {
  fetchEmail,
  fetchProfile,
  getGithubAccessToken,
} from "../../../utils/githubOauth";
import { sessionOptions } from "../../../utils/session";

const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { path } = req.query;
  const referer = (path as string[]).join("/");
  const authorizationCode = req.query.code as string;
  const accessToken = await getGithubAccessToken(authorizationCode);
  const userProfile: githubUser = await fetchProfile(accessToken);
  const userEmail = await fetchEmail(accessToken);
  const email =
    userEmail.visibility === "private"
      ? `${userProfile.id}+${userProfile.login}@users.noreply.github.com`
      : userEmail.email;
  const user: User = {
    isLoggedIn: true,
    login: userProfile.login,
    id: userProfile.node_id,
    avatar: userProfile.avatar_url,
    url: userProfile.url,
    name: userProfile.name,
    email: email,
    accessToken: accessToken,
  };
  req.session.user = user;
  await req.session.save();
  res.redirect("/" + referer);
};

export default withIronSessionApiRoute(loginRoute, sessionOptions);
