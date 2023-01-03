import connectMongo from "../../../utils/connectMongo";
import User from "../../../models/User";
import authenticated from "../../../middlewares/authenticated";

// api endpoint --> /api/users/:id
// http requests supported --> GET, PATCH, DELETE
export default authenticated(async function (req, res) {
  if (req.method === "GET") {
    try {
      // Connect to mongo db
      await connectMongo();
      const userId = req.query.id;
      const userObject = await User.findOne({ _id: userId });
      userObject.password = "";
      res.json({ userObject });
    } catch (error) {
      res.json({ error: "User not found" });
    }
  } else if (req.method === "PATCH") {
    try {
      // Connect to mongo db
      await connectMongo();
      const userId = req.body._id;
      const userObject = await User.findOneAndUpdate(
        { _id: userId },
        req.body,
        { new: true }
      );

      res.json({ userObject });
    } catch (error) {
      res.json({ error: "User not found" });
    }
  } else if (req.method === "DELETE") {
    try {
      await connectMongo();
      const userId = req.query.id;
      const userObject = await User.findOneAndDelete({ _id: userId });

      res.json({ userObject });
    } catch (error) {
      res.json({ error: "User not found" });
    }
  } else {
    res.json({ message: "Invalid Request" });
  }
});
