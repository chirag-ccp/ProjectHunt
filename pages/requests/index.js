import React, { useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tooltip } from "primereact/tooltip";
import Link from "next/link";
import jwt_decode from "jwt-decode";
import myGet from "../../middlewares/myGet";
import Router from "next/router";

const myStyles = {
  cardDiv: "col-12 md:col-6 lg:col-3 w-12 sm:w-6 md:w-4 lg:w-3 text-primary",
  card: "cursor-pointer border-solid border-white hover:border-solid hover:border-primary flex justify-content-center text-align-center",
  panel: "mb-3 mt-5 shadow-3",
};

function Requests({
  requestsSentForMe,
  requestsSentForTeam,
  requestsReceivedForMe,
  requestsReceivedForTeam,
}) {
  const renderReceivedForTeamCardTitle = (myRequest) => {
    return (
      <Link href={`http://localhost:3000/users/${myRequest?.senderId}`}>
        <a>
          <Tooltip target=".requestSender" content={`Click to view profile`} />
          <span style={{ paddingLeft: "0rem" }} className="requestSender">
            {myRequest?.senderName}
          </span>
        </a>
      </Link>
    );
  };

  const renderReceivedForMeCardTitle = (myRequest) => {
    return (
      <Link href={`http://localhost:3000/teams/${myRequest?.teamId}`}>
        <a>
          <Tooltip target=".requestSender" content={`Click to view team`} />
          <span style={{ paddingLeft: "0rem" }} className="requestSender">
            {myRequest?.teamName}
          </span>
        </a>
      </Link>
    );
  };
 
  const renderSentForTeamCardTitle = (myRequest) => {
    return (
      <Link href={`http://localhost:3000/users/${myRequest?.receiverId}`}>
        <a>
          <Tooltip target=".requestSender" content={`Click to view profile`} />
          <span style={{ paddingLeft: "0rem" }} className="requestSender">
            {myRequest?.receiverName}
          </span>
        </a>
      </Link>
    );
  };

  const renderSentForMeCardTitle = (myRequest) => {
    return (
      <Link href={`http://localhost:3000/teams/${myRequest?.teamId}`}>
        <a>
          <Tooltip target=".requestSender" content={`Click to view team`} />
          <span style={{ paddingLeft: "0rem" }} className="requestSender">
            {myRequest?.teamName}
          </span>
        </a>
      </Link>
    );
  };

  const changeRequestStatus = async (myRequest, newStatus) => {
    // myRequest.preventDefault();

    const requestBody = {
      _id: myRequest?._id,
      status: newStatus,
    };
    console.log("newStatus by ccp = ", requestBody);
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(`/api/requests/${myRequest._id}`, options);
    console.log(response);
    // Router.push(`/teams/${myRequest.teamId}`);
  };

  return (
    <div className="m-7">
      {/* {JSON.stringify(receivedRequestsArray)}
      {JSON.stringify(sentRequestsArray)} */}
      <h2 className="ml-2">Requests</h2>

      <Panel
        header="Received for my Team"
        className={myStyles.panel}
        toggleable
      >
        <div className="grid">
          {requestsReceivedForTeam.map((myRequest, myRequestIndex) => {
            return (
              <div key={myRequestIndex} className={myStyles.cardDiv}>
                <Card
                  title={renderReceivedForTeamCardTitle(myRequest)}
                  subTitle={myRequest.teamName}
                  className={myStyles.card}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      label="Reject"
                      className="p-button-rounded p-button-danger text-sm p-2"
                      onClick={() => {
                        changeRequestStatus(myRequest, "rejected");
                      }}
                    />
                    <Button
                      label="Accept"
                      className="p-button-rounded p-button-success text-sm p-2 ml-3"
                      onClick={() => {
                        changeRequestStatus(myRequest, "accepted");
                      }}
                    />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel header="Received for me" className={myStyles.panel} toggleable>
        <div className="grid">
          {requestsReceivedForMe.map((myRequest, myRequestIndex) => {
            return (
              <div key={myRequestIndex} className={myStyles.cardDiv}>
                <Card
                  title={renderReceivedForMeCardTitle(myRequest)}
                  subTitle={"Sent by team admin"}
                  className={myStyles.card}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      label="Reject"
                      className="p-button-rounded p-button-danger text-sm p-2"
                      onClick={() => {
                        changeRequestStatus(myRequest, "rejected");
                      }}
                    />
                    <Button
                      label="Accept"
                      className="p-button-rounded p-button-success text-sm p-2 ml-3"
                      onClick={() => {
                        changeRequestStatus(myRequest, "accepted");
                      }}
                    />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel header="Sent for my team" className={myStyles.panel} toggleable>
        <div className="grid">
          {requestsSentForTeam.map((myRequest, myRequestIndex) => {
            return (
              <div key={myRequestIndex} className={myStyles.cardDiv}>
                <Card
                  title={renderSentForTeamCardTitle(myRequest)}
                  subTitle={myRequest?.teamName}
                  className={myStyles.card}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      label="Withdraw"
                      className="p-button-rounded p-button-warning text-sm p-2"
                      onClick={() => {
                        changeRequestStatus(myRequest, "withdrawn");
                      }}
                    />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel header="Sent for me" className={myStyles.panel} toggleable>
        <div className="grid">
          {requestsSentForMe.map((myRequest, myRequestIndex) => {
            return (
              <div key={myRequestIndex} className={myStyles.cardDiv}>
                <Card
                  title={renderSentForMeCardTitle(myRequest)}
                  // subTitle={subtitle}
                  className={myStyles.card}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      label="Withdraw"
                      className="p-button-rounded p-button-warning text-sm p-2"
                      onClick={() => {
                        changeRequestStatus(myRequest, "withdrawn");
                      }}
                    />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

export default Requests;

export async function getServerSideProps(ctx) {
  // Here we assume the cookie to be in the format
  // "auth=jwt_token"

  const cookie = ctx.req?.headers?.cookie;
  let userId;

  let allRequests;

  if (cookie) {
    const jwtToken = cookie?.substring(5);
    const decoded = jwt_decode(jwtToken);
    userId = decoded?.userId;

    allRequests = await myGet(
      `http://localhost:3000/api/requests/${userId}`,
      ctx
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

  allRequests = JSON.parse(JSON.stringify(allRequests));
  const requestsSentForMe = allRequests?.requestsSentForMe;
  const requestsSentForTeam = allRequests?.requestsSentForTeam;
  const requestsReceivedForMe = allRequests?.requestsReceivedForMe;
  const requestsReceivedForTeam = allRequests?.requestsReceivedForTeam;

  return {
    props: {
      userId: userId,
      requestsSentForMe: requestsSentForMe,
      requestsSentForTeam: requestsSentForTeam,
      requestsReceivedForMe: requestsReceivedForMe,
      requestsReceivedForTeam: requestsReceivedForTeam,
    },
  };
}
