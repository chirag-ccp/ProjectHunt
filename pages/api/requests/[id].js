import connectMongo from "../../../utils/connectMongo";
import Request from "../../../models/Request";
import authenticated from "../../../middlewares/authenticated";
import Team from "../../../models/Team";
import User from "../../../models/User";

// api request --> /api/requests/:id
export default authenticated(async function (req, res) {
  if (req.method === "GET") {
    try {
      // Connect to mongo db
      await connectMongo();

      const requestsSentForMe = await Request.find({
        senderId: req.query.id,
        status: "live",
        senderType: "member",
      });
      const requestsSentForTeam = await Request.find({
        senderId: req.query.id,
        status: "live",
        senderType: "admin",
      });
      const requestsReceivedForMe = await Request.find({
        receiverId: req.query.id,
        status: "live",
        senderType: "admin",
      });
      const requestsReceivedForTeam = await Request.find({
        receiverId: req.query.id,
        status: "live",
        senderType: "member",
      });

      res.json({
        requestsSentForMe,
        requestsSentForTeam,
        requestsReceivedForMe,
        requestsReceivedForTeam,
      });
    } catch (error) {
      res.json({ error });
    }
  } else if (req.method === "PATCH") {
    try {
      // Connect to mongo db
      await connectMongo();

      // {
      //   _id: new ObjectId("62e11a3b5f4c87ea43e02db3"),
      //   teamId: new ObjectId("62db0936e1bc6bb1b6b8edf8"),
      //   teamName: 'Phone Pe    ',
      //   senderId: new ObjectId("62e1194b28f743ff7688aa52"),
      //   senderName: 'Pratik Dhaygude',
      //   receiverId: new ObjectId("62db018ee1bc6bb1b6b8ed49"),
      //   receiverName: 'Chirag Chainesh Patil',
      //   senderType: 'member',
      //   status: 'accepted',
      //   __v: 0
      // }

      const requestId = req.body._id;
      const newStatus = req.body.status;

      if (newStatus === "accepted") {
        let requestObject = await Request.findByIdAndUpdate(
          { _id: requestId },
          { status: newStatus },
          { new: true }
        );

        requestObject = JSON.parse(JSON.stringify(requestObject));
        const teamId = requestObject?.teamId;
        let teamObject = await Team.findOne({ _id: teamId });
        teamObject = JSON.parse(JSON.stringify(teamObject));
        console.log("What's wrong bro ???? ");
        const senderVariable = req.body.senderType.trim();

        if (senderVariable === "admin") {
          // Received for me
          console.log("Received for me");
          // decrease team's sentRequestCount by 1
          let newSentRequestCount = teamObject?.sentRequestCount - 1;

          // push the id of user into memberIds
          let newMemberIds = teamObject?.memberIds;
          newMemberIds?.push(requestObject?.receiverId);

          teamObject = await Team.findByIdAndUpdate(
            { _id: teamId },
            {
              sentRequestCount: newSentRequestCount,
              memberIds: newMemberIds,
            },
            { new: true }
          );
          console.log(teamObject);
          let newTeamMember = await User.findOne({
            _id: requestObject?.receiverId,
          });
          let membersTeams = newTeamMember.teamIds;
          membersTeams.push(teamId);
          let modifiedTeamMember = await User.findByIdAndUpdate(
            { _id: newTeamMember?._id },
            {
              teamIds: membersTeams,
            },
            {
              new: true,
            }
          );

          res.json({ requestObject });
        } // Received for my team
        else {
          console.log("Received for my team");
          // decrease team's receivedRequestCount by 1
          let newReceivedRequestCount = teamObject?.receivedRequestCount - 1;

          // push the id of user into memberIds
          let newMemberIds = teamObject?.memberIds;
          newMemberIds.push(requestObject?.senderId);
          teamObject = await Team.findByIdAndUpdate(
            { _id: teamId },
            {
              receivedRequestCount: newReceivedRequestCount,
              memberIds: newMemberIds,
            },
            { new: true }
          );

          let newTeamMember = await User.findOne({
            _id: requestObject?.senderId,
          });
          let membersTeams = newTeamMember.teamIds;
          membersTeams.push(teamId);
          let modifiedTeamMember = await User.findByIdAndUpdate(
            { _id: newTeamMember?._id },
            {
              teamIds: membersTeams,
            },
            {
              new: true,
            }
          );

          res.json({ requestObject });
        }
        console.log("i m out bro ???? ");
      } else if (newStatus === "rejected") {
      } else if (newStatus === "withdrawn") {
      }

      res.json({ requestObject });
    } catch (error) {
      res.json({ error });
    }
  } else {
    res.json({ message: "Invalid Request" });
  }
});
