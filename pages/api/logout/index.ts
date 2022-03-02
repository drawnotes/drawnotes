import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../types";
import { sessionOptions } from "../../../utils/session";

const logoutRoute = async (req: NextApiRequest, res: NextApiResponse<User>) => {
  req.session.destroy();
  res.redirect("/");
};

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
