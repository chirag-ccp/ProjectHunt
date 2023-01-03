import connectMongo from "../../../utils/connectMongo";
import Team from "../../../models/Team";
import authenticated from "../../../middlewares/authenticated";
import User from "../../../models/User";

// api request --> /api/teams
// POST = creates a new team
export default authenticated(async function (req, res) {
  if (req.method === "POST") {
    try {
      // Connect to mongo db
      await connectMongo();

      const team = new Team({
        teamName: req.body.teamName,
        requiredTeamSize: req.body.requiredTeamSize,
        adminId: req.body.userId,
      });

      await team.save();

      const user = await User.findOne({ _id: req.body.userId });

      await user?.teamIds.push(team?._id);

      await user.save();

      res.json({ myTeam: team });
    } catch (error) {
      res.json({ error });
    }
  } else if (req.method === "GET") {
    try {
      // Connect to mongo db
      await connectMongo();

      const teamArray = await Team.find();

      let vacancyArray = [];
      teamArray?.forEach((team) => {
        const vacancyCount =
          team?.requiredTeamSize -
          1 -
          team?.sentRequestCount -
          team?.receivedRequestCount -
          team?.memberIds.length;
        if (vacancyCount > 0) {
          vacancyArray.push(team);
        }
      });

      res.json({ vacancyArray });
    } catch (error) {
      res.json({ error });
    }
  } else {
    res.json({ message: "Invalid Request" });
  }
});
