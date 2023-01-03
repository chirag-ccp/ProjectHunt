import myGet from "../../middlewares/myGet";
import jwt_decode from "jwt-decode";
import AdminTeamView from "../../components/AdminTeamView";
import ViewerTeamView from "../../components/ViewerTeamView";
import User from "../../models/User";

function TeamId({
  teamObject,
  isAdmin,
  teamLeaderObject,
  membersArray,
  requestorId,
}) {
  return (
    <>
      {isAdmin ? (
        <AdminTeamView
          teamObject={teamObject}
          teamLeaderObject={teamLeaderObject}
          membersArray={membersArray}
        />
      ) : (
        <ViewerTeamView
          teamObject={teamObject}
          teamLeaderObject={teamLeaderObject}
          membersArray={membersArray}
          requestorId={requestorId}
        />
      )}
    </>
  );
}

export default TeamId;

export async function getServerSideProps(ctx) {
  // Here we assume the cookie to be in the format
  // "auth=jwt_token"

  const cookie = ctx.req?.headers?.cookie;
  let userId;
  if (cookie) {
    const jwtToken = cookie?.substring(5);
    const decoded = jwt_decode(jwtToken);
    userId = decoded?.userId;
  }

  const teamId = ctx?.query?.teamId;

  let teamObject = await myGet(
    `http://localhost:3000/api/teams/${teamId}`,
    ctx
  );

  teamObject = JSON.parse(JSON.stringify(teamObject?.teamObject));
  let isAdmin = false;
  if (teamObject?.adminId === userId) {
    isAdmin = true;
  }

  let teamLeaderObject = await User.findOne({ _id: teamObject?.adminId });
  let membersArray = await Promise.all(
    teamObject?.memberIds.map(async (memberId) => {
      return await User.findOne({ _id: memberId });
    })
  );

  teamLeaderObject = JSON.parse(JSON.stringify(teamLeaderObject));
  membersArray = JSON.parse(JSON.stringify(membersArray));

  return {
    props: {
      teamObject: teamObject,
      isAdmin: isAdmin,
      teamLeaderObject: teamLeaderObject,
      membersArray: membersArray,
      requestorId: userId,
    },
  };
}
