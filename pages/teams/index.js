import React, { useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Messages } from "primereact/messages";
import { Card } from "primereact/card";
import jwt_decode from "jwt-decode";
import Team from "../../models/Team";
import myGet from "../../middlewares/myGet";
import Router from "next/router";

const myStyles = {
  cardDiv: "col-12 md:col-6 lg:col-3 w-12 sm:w-6 md:w-4 lg:w-3 text-primary",
  card: "cursor-pointer border-solid border-white hover:border-solid hover:border-primary",
  panel: "mb-3 mt-5 shadow-3",
};

function Teams({ userId, adminArray, memberArray }) {
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [myAdminArray, setMyAdminArray] = useState(adminArray);
  const [myMemberArray, setMyMemberArray] = useState(memberArray);
  const msgs1 = useRef(null);

  // console.log("User Id = ", userId);
  // console.log("Admin array = ", adminArray);
  // console.log("Member array = ", memberArray);

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
        <span className="ml-2">Create New Team</span>
      </div>
    );
  };

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="Submit"
          className="p-button-outlined"
          onClick={submitNewTeam}
          autoFocus
        />
      </div>
    );
  };

  const hideDailog = () => {
    setDisplayResponsive(false);
  };

  const submitNewTeam = async () => {
    // console.log("name = ", teamName);
    // console.log("size = ", teamSize);
    if (teamName === "") {
      showError("Team Name is required");
      return;
    }

    if (teamSize < 2 || teamSize > 10) {
      showError("Team should have 2 to 10 members");
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamName: teamName,
        requiredTeamSize: teamSize,
        userId: userId,
      }),
    };

    const response = await fetch(`/api/teams`, options);

    console.log(response);

    setTeamName("");
    setTeamSize("");

    hideDailog();
    // R.replace(router.asPath);
  };

  return (
    <div className="m-7">
      <h2 className="ml-2">
        My Teams{" "}
        <Button
          label="Create"
          icon="pi pi-plus"
          iconPos="left"
          style={{ float: "right" }}
          onClick={() => {
            setDisplayResponsive(true);
          }}
        />{" "}
      </h2>

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
            <InputText
              id="teamName"
              placeholder="Enter Team Name"
              type="text"
              value={teamName}
              name="teamName"
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full mb-3 text-left"
              style={{ borderRadius: "0.5rem" }}
            />
            <br />
            <InputNumber
              inputId="minmax-buttons"
              value={teamSize}
              onValueChange={(e) => setTeamSize(e.value)}
              mode="decimal"
              min={2}
              max={10}
              showButtons={true}
              placeholder="Enter Team Size"
              className="w-full mb-3 text-left"
              style={{ borderRadius: "0.5rem" }}
            />
          </div>
        </div>
      </Dialog>

      <Panel header="Created by you" className={myStyles.panel} toggleable>
        <div className="grid">
          {myAdminArray.map((myTeam, myTeamIndex) => {
            const vacant =
              myTeam?.requiredTeamSize - myTeam?.memberIds.length - 1;
            const subtitle =
              vacant == 1 ? "1 member required" : `${vacant} members required`;

            return (
              <div key={myTeamIndex} className={myStyles.cardDiv}>
                <Card
                  title={myTeam.teamName}
                  subTitle={subtitle}
                  className={myStyles.card}
                  onClick={() => {
                    Router.push(`teams/${myTeam._id}`);
                  }}
                >
                  Current Size: {myTeam?.memberIds.length + 1}
                </Card>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel header="Joined by you" className={myStyles.panel} toggleable>
        <div className="grid">
          {myMemberArray.map((myTeam, myTeamIndex) => {
            const vacant =
              myTeam?.requiredTeamSize - myTeam?.memberIds.length - 1;
            const subtitle =
              vacant == 1 ? "1 member required" : `${vacant} members required`;

            return (
              <div key={myTeamIndex} className={myStyles.cardDiv}>
                <Card
                  title={myTeam.teamName}
                  subTitle={subtitle}
                  className={myStyles.card}
                  onClick={() => {
                    Router.push(`teams/${myTeam._id}`);
                  }}
                >
                  Current Size: {myTeam.memberIds.length + 1}
                </Card>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

export default Teams;

export async function getServerSideProps(ctx) {
  // Here we assume the cookie to be in the format
  // "auth=jwt_token"

  const cookie = ctx.req?.headers?.cookie;
  let userId;
  let adminMemberArray = [];

  if (cookie) {
    const jwtToken = cookie?.substring(5);
    const decoded = jwt_decode(jwtToken);
    userId = decoded?.userId;

    // 1. Fetch team id array from user
    const myUser = await myGet(
      `http://localhost:3000/api/users/${userId}`,
      ctx
    );

    const teamIdArray = myUser?.userObject?.teamIds;

    // 2. Take all teams which the user belongs to (admin as well as members)
    adminMemberArray = await Promise.all(
      teamIdArray?.map(async (teamId) => {
        return await Team.findOne({ _id: teamId });
      })
    );
  } else {
    // We are on unauthorized
    // on Client Side
    if (!ctx.req) {
      Router.replace("/login");
      return {};
    }

    // We are unauthorized
    // on Server Side
    if (ctx.req) {
      ctx.res?.writeHead(302, {
        Location: "http://localhost:3000/login",
      });

      ctx.res?.end();
      return;
    }
  }

  // console.log("Enjoy = ", adminMemberArray);
  const completeArray = JSON.parse(JSON.stringify(adminMemberArray));

  let adminArray = [];
  let memberArray = [];
  await completeArray.forEach((adminTeam) => {
    if (adminTeam?.adminId === userId) {
      adminArray.push(adminTeam);
    } else {
      memberArray.push(adminTeam);
    }
  });
  return {
    props: {
      userId: userId,
      adminArray: adminArray,
      memberArray: memberArray,
    },
  };
}
