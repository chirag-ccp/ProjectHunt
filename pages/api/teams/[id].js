import connectMongo from "../../../utils/connectMongo";
import Team from "../../../models/Team";
import authenticated from "../../../middlewares/authenticated";
// import User from "../../../models/User";

// api request --> /api/teams/:id
export default authenticated(async function (req, res) {
  if (req.method === "GET") {
    try {
      // Connect to mongo db
      await connectMongo();

      const teamObject = await Team.findOne({ _id: req.query.id });

      res.json({ teamObject });
    } catch (error) {
      res.json({ error });
    }
  } else if (req.method === "PATCH") {
    try {
      // Connect to mongo db
      await connectMongo();
      const teamId = req.body._id;
      const teamObject = await Team.findOneAndUpdate(
        { _id: teamId },
        req.body,
        { new: true }
      );

      res.json({ teamObject });
    } catch (error) {
      res.json({ error: "Team not found" });
    }
  } else {
    res.json({ message: "Invalid Request" });
  }
});
