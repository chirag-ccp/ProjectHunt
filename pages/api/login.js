import connectMongo from "../../utils/connectMongo";
import User from "../../models/User";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import cookie from "cookie";

// api request --> /api/signup
export default async function (req, res) {
  if (req.method === "POST") {
    try {
      // Connect to mongo db
      await connectMongo();

      // Check if user already exists
      const user = await User.findOne({ email: req.body.email });

      // If user already exists
      if (user) {
        compare(req.body.password, user.password, function (err, result) {
          if (!err && result === true) {
            var token = sign(
              { userId: user._id, userEmail: user.email },
              process.env.SECRET,
              { expiresIn: "1h" }
            );

            res.setHeader(
              "Set-Cookie",
              cookie.serialize("auth", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
              })
            );
            res.send({ message: "Logged in successfully" });
          } else {
            res.status("401").json({ message: "Invalid Credentials" });
          }
        });
      } else {
        res.status("401").json({ message: "Invalid Credentials" });
      }
    } catch (error) {
      res.json({ error });
    }
  } else {
    res.json({ message: "Invalid Request" });
  }
}
