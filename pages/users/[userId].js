import { useState, useRef } from "react";
import myGet from "../../middlewares/myGet";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Dialog } from "primereact/dialog";
import { Messages } from "primereact/messages";
import { AutoComplete } from "primereact/autocomplete";
import jwt_decode from "jwt-decode";
import Team from "../../models/Team";

const myProfileStyles = {
  fieldItem:
    "flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap",
  fieldName: "text-500 w-6 md:w-3 font-medium",
  fieldValue:
    "text-900 mt-3 md:mt-0 w-full md:w-7 md:flex-order-0 flex-order-1",
};

function UserId({ user, adminArray, adminId }) {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [filteredTeams, setFilteredTeams] = useState(null);
  const msgs1 = useRef(null);
  const showError = (summary) => {
    msgs1.current.show({
      severity: "error",
      summary: summary,
      life: 8000,
    });
  };

  const renderHeader = () => {
    return (
      <div>
        {/* <i className="pi pi-users" style={{'fontSize': '1.75rem'}}/> */}
        <span className="ml-2">Add user to Team</span>
      </div>
    );
  };

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="Add"
          className="p-button-outlined"
          onClick={addMember}
          autoFocus
        />
      </div>
    );
  };

  const hideDailog = () => {
    setDisplayResponsive(false);
  };

  const searchTeam = (event) => {
    setTimeout(() => {
      let _filteredTeams;
      if (!event.query.trim().length) {
        _filteredTeams = [...adminArray];
      } else {
        _filteredTeams = adminArray.filter((adminTeam) => {
          return adminTeam.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setFilteredTeams(_filteredTeams);
    }, 250);
  };

  const addMember = async () => {
    if (selectedTeam === "") {
      showError("Please select a team");
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamName: selectedTeam,
        senderId: adminId,
        receiverId: user?._id,
        senderType: "admin",
        status: "live",
      }),
    };

    const response = await fetch(`/api/requests`, options);

    console.log(response);

    setSelectedTeam("");

    hideDailog();
  };

  return (
    <div>
      <Dialog
        header={renderHeader()}
        visible={displayResponsive}
        onHide={hideDailog}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "25rem" }}
        footer={renderFooter("displayResponsive")}
        // maximizable
      >
        <Messages className="z-1" ref={msgs1}></Messages>
        <div className="flex justify-content-center">
          <div className="mt-3">
            <AutoComplete
              value={selectedTeam}
              suggestions={filteredTeams}
              completeMethod={searchTeam}
              dropdown
              forceSelection
              onChange={(e) => setSelectedTeam(e.value)}
            />
          </div>
        </div>
      </Dialog>

      <div className="surface-0 m-8">
        <div className="font-medium text-3xl text-900 mb-3">User Profile</div>
        <div className="text-500 mb-5">
          Click on the button at the bottom to add the user in your team
        </div>
        <ul className="list-none p-0 m-0">
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Name</div>
            <div className={myProfileStyles.fieldValue}>{user?.name}</div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Headline</div>
            <div className={myProfileStyles.fieldValue}>{user?.headline}</div>
          </li>

          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Highlights</div>
            <div className={myProfileStyles.fieldValue}>
              {user?.firstHighlight}
              <br /> <br />
              {user?.secondHighlight}
              <br /> <br />
              {user?.thirdHighlight}
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Technologies</div>
            <div className={myProfileStyles.fieldValue}>
              {user?.technologies.map((technology, technologyIndex) => {
                return (
                  <Chip
                    key={technologyIndex}
                    label={technology}
                    className="mr-2 text-sm"
                  />
                );
              })}
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Description</div>
            <div className={myProfileStyles.fieldValue}>
              {user?.description}
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Coding Profiles</div>
            <div className={myProfileStyles.fieldValue}>
              <div className="mb-5 mt-1">{user?.githubProfile}</div>
              <div className="mb-5">{user?.kaggleProfile}</div>
              <div className="mb-5">{user?.codechefProfile}</div>
              <div className="mb-5">{user?.codeforcesProfile}</div>
              <div className="mb-1">{user?.leetcodeProfile}</div>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <Button
              onClick={() => {
                setDisplayResponsive(true);
              }}
              label="Add to my Team"
              className="w-full"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserId;

export async function getServerSideProps(ctx) {
  // Here we assume the cookie to be in the format
  // "auth=jwt_token"

  const cookie = ctx.req?.headers?.cookie;
  let requestorId;
  if (cookie) {
    const jwtToken = cookie?.substring(5);
    const decoded = jwt_decode(jwtToken);
    requestorId = decoded?.userId;
  }

  let myRequestor = await myGet(
    `http://localhost:3000/api/users/${requestorId}`,
    ctx
  );
  myRequestor = JSON.parse(JSON.stringify(myRequestor?.userObject));
  const userId = ctx?.query?.userId;

  let myUser = await myGet(`http://localhost:3000/api/users/${userId}`, ctx);

  myUser = JSON.parse(JSON.stringify(myUser?.userObject));

  // 1. Get the list of teamObjects that the requestor is admin in and have vacancies
  const teamIdArray = myRequestor?.teamIds;

  let adminMemberArray = await Promise.all(
    teamIdArray?.map(async (teamId) => {
      return await Team.findOne({ _id: teamId });
    })
  );

  const completeArray = JSON.parse(JSON.stringify(adminMemberArray));

  let adminArray = [];

  await completeArray.forEach((adminTeam) => {
    let vacancies =
      adminTeam?.requiredTeamSize -
      1 -
      adminTeam?.memberIds.length -
      adminTeam?.sentRequestCount -
      adminTeam?.receivedRequestCount;

    if (adminTeam?.adminId === requestorId && vacancies > 0) {
      adminArray.push(adminTeam?.teamName);
    }
  });

  return {
    props: {
      user: myUser,
      adminArray: adminArray,
      adminId: JSON.parse(JSON.stringify(requestorId)),
    },
  };
}
