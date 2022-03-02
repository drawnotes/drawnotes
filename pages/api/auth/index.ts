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
  const authorizationCode = req.query.code as string;
  const accessToken = await getGithubAccessToken(authorizationCode);
  const userProfile: githubUser = await fetchProfile(accessToken);
  const userEmail = await fetchEmail(accessToken);
  const user: User = {
    isLoggedIn: true,
    login: userProfile.login,
    id: userProfile.node_id,
    avatar: userProfile.avatar_url,
    url: userProfile.url,
    name: userProfile.name,
    email: userEmail.email,
    accessToken: accessToken,
  };
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

export default withIronSessionApiRoute(loginRoute, sessionOptions);
