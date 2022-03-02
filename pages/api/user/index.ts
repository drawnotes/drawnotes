import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../types";
import { sessionOptions } from "../../../utils/session";

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    const user = req.session.user;
    delete user.accessToken;
    res.json({
      ...user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      login: "",
      id: "",
      avatar: "",
      url: "",
      name: "",
      email: "",
    });
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions);
