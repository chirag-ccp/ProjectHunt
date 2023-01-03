import connectMongo from "../../../utils/connectMongo";
import User from "../../../models/User";
import authenticated from "../../../middlewares/authenticated";

// api request --> /api/users
export default authenticated(async function (req, res) {
  if (req.method === "GET") {
    try {
      // Connect to mongo db
      await connectMongo();

      const userArray = await User.find();

      res.json({ userArray });
    } catch (error) {
      res.json({ error });
    }
  } else {
    res.json({ message: "Invalid Request" });
  }
});
