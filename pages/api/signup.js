import connectMongo from "../../utils/connectMongo";
import User from "../../models/User";
import { hash } from "bcrypt";

// api request --> /api/signup
export default async function (req, res) {
  if (req.method === "POST") {
    try {
      // Connect to mongo db
      await connectMongo();

      // Check if user already exists
      let user = await User.findOne({ email: req.body.email });

      // If user already exists
      if (user) {
        res.status("409").json({ message: "User already exists" });
        return;
      }

      hash(req.body.password, 10, async function (err, hash) {
        // Creating user object
        user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });

        // saving user to database
        await user.save();

        // removing the password before sending it back to the client
        user.password = "";
        res.json({ user });
      });
    } catch (error) {
      res.json({ error });
    }
  } else {
    res.json({ message: "Invalid Request" });
  }
}
