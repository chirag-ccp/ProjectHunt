import connectMongo from "../../../utils/connectMongo";
import authenticated from "../../../middlewares/authenticated";
import Request from "../../../models/Request";
import Team from "../../../models/Team";
import User from "../../../models/User";

// api request --> /api/requests
// POST = creates a new request
export default authenticated(async function (req, res) {
  if (req.method === "POST") {
    try {
      // Connect to mongo db
      await connectMongo();

      let teamObject = await Team.findOne({ teamName: req?.body.teamName });

      const senderObject = await User.findOne({ _id: req?.body.senderId });
      const receiverObject = await User.findOne({ _id: req?.body.receiverId });

      const request = new Request({
        teamId: teamObject?._id,
        teamName: req?.body.teamName,
        senderId: req?.body.senderId,
        senderName: senderObject?.name,
        receiverId: req?.body.receiverId,
        receiverName: receiverObject?.name,
        senderType: req?.body.senderType,
        status: req?.body.status,
      });
 
      await request.save();

      if (req?.body.senderType.toString() === "admin") {
        teamObject = await Team.findOneAndUpdate(
          { _id: teamObject?._id },
          { sentRequestCount: teamObject?.sentRequestCount + 1 },
          { new: true }
        );
      } else {
        teamObject = await Team.findOneAndUpdate(
          { _id: teamObject?._id },
          { receivedRequestCount: teamObject?.receivedRequestCount + 1 },
          { new: true }
        );
      }

      res.json({ myRequest: request });
    } catch (error) {
      res.json({ error });
    }
  } else {
    res.json({ message: "Invalid Request" });
  }
});
