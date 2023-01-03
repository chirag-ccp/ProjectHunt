import React, { useState } from "react";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import { Tooltip } from "primereact/tooltip";
import techStack from "../utils/techStack";
import Link from "next/link";
import Router from "next/router";

// teamObject
// {"_id":"62d703c5b0319d1c9edad559","teamName":"Safari","requiredTeamSize":2,"adminId":"62d7036cb0319d1c9edad550","memberIds":[],"requiredTechnologies":[],"requirementLine1":"","requirementLine2":"","requirementLine3":"","description":"","__v":0}

// teamLeaderObject
// {"_id":"62d7036cb0319d1c9edad550","name":"Tim Cook","email":"tim@apple.com","password":"$2b$10$llnh3CXM8yP.Xb2rLTER/OvahHpJkAIKVlszmO8Iik51/1PvSeBQy","headline":"CEO @ Apple","description":"Would like to visit India","technologies":["Node.js","Express.js","Mongo db","React.js"],"firstHighlight":"Works on Macbook","secondHighlight":"Knowledge about tech","thirdHighlight":"Lives in the US","githubProfile":"","kaggleProfile":"","codechefProfile":"","codeforcesProfile":"","leetcodeProfile":"","contactNumber":"9876543210","teamIds":["62d7039db0319d1c9edad555","62d703c5b0319d1c9edad559","62d70569b0319d1c9edad55d","62d812ae45494ee7bf727ca4","62d8136745494ee7bf727cb2","62d821d945494ee7bf727ce0","62d822f745494ee7bf727cec","62d8231e45494ee7bf727cf9","62d823d845494ee7bf727d10","62d848d0f997f5a3a82435c1","62d8490df997f5a3a82435d1","62d84932f997f5a3a82435ee"],"__v":12}

const myProfileStyles = {
  fieldItem:
    "flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap",
  fieldName: "text-500 w-6 md:w-3 font-medium",
  fieldValue:
    "text-900 mt-3 md:mt-0 w-full md:w-7 md:flex-order-0 flex-order-1",
};

const AdminTeamView = ({ teamObject, teamLeaderObject, membersArray }) => {
  const [teamName, setTeamName] = useState(teamObject?.teamName);
  const [requiredTeamSize, setRequiredTeamSize] = useState(
    teamObject?.requiredTeamSize
  );
  const [technologies, setTechnologies] = useState(
    teamObject?.requiredTechnologies
  );
  const [availableTechnologies, setAvailableTechnologies] = useState(techStack);
  const [filteredTechnologies, setFilteredTechnologies] = useState(null);
  const [requirementLine1, setRequirementLine1] = useState(
    teamObject?.requirementLine1
  );
  const [requirementLine2, setRequirementLine2] = useState(
    teamObject?.requirementLine2
  );
  const [requirementLine3, setRequirementLine3] = useState(
    teamObject?.requirementLine3
  );
  const [description, setDescription] = useState(teamObject?.description);

  const searchTechnology = (event) => {
    setTimeout(() => {
      let _filteredTechnologies;
      if (!event.query.trim().length) {
        _filteredTechnologies = [...availableTechnologies];
      } else {
        _filteredTechnologies = availableTechnologies.filter((avalTech) => {
          return avalTech.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setFilteredTechnologies(_filteredTechnologies);
    }, 250);
  };

  const updateProfile = async (event) => {
    event.preventDefault();

    const requestBody = {
      _id: teamObject._id,
      teamName: teamName,
      requiredTeamSize: requiredTeamSize,
      requiredTechnologies: technologies,
      requirementLine1: requirementLine1,
      requirementLine2: requirementLine2,
      requirementLine3: requirementLine3,
      description: description,
    };

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(`/api/teams/${teamObject._id}`, options);
    console.log(response);
    Router.push(`/teams/${teamObject._id}`);
  };

  return (
    <div>
      <div className="surface-0 m-8">
        <div className="font-medium text-3xl text-900 mb-3">Team Details</div>
        <div className="text-500 mb-5">
          Click on the respective field contents to modify the field
        </div>
        <ul className="list-none p-0 m-0">
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Name</div>
            <div className={myProfileStyles.fieldValue}>
              <Inplace closable>
                <InplaceDisplay>
                  {teamName || (
                    <span className="text-500">Enter team name</span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Team Capacity</div>
            <div className={myProfileStyles.fieldValue}>
              <Inplace closable>
                <InplaceDisplay>
                  {requiredTeamSize || (
                    <span className="text-500">
                      Enter your desired team size
                    </span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={requiredTeamSize}
                    onChange={(e) => setRequiredTeamSize(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Team Leader</div>
            <div className={myProfileStyles.fieldValue}>
              <Link
                href={`http://localhost:3000/users/${teamLeaderObject?._id}`}
              >
                <a>
                  <Tooltip
                    target=".teamLeader"
                    content={`Click to view profile`}
                  />
                  <span
                    style={{ paddingLeft: "0.7rem" }}
                    className="teamLeader"
                  >
                    {teamLeaderObject?.name}
                  </span>
                </a>
              </Link>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Team Members</div>
            <div className={myProfileStyles.fieldValue}>
              {membersArray?.map((memberObject, memberIndex) => {
                return (
                  <div key={memberIndex}>
                    {memberIndex > 0 && (
                      <div>
                        <br />
                      </div>
                    )}
                    <Link
                      href={`http://localhost:3000/users/${memberObject?._id}`}
                    >
                      <a>
                        <Tooltip
                          target={`.teamMember${memberIndex}`}
                          content={`Click to view profile`}
                        />
                        <span
                          className={`teamMember${memberIndex}`}
                          style={{ paddingLeft: "0.7rem" }}
                        >
                          {memberObject?.name}
                        </span>
                      </a>
                    </Link>{" "}
                  </div>
                );
              })}
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Requirements</div>
            <div className={myProfileStyles.fieldValue}>
              <Inplace closable className="mb-4">
                <InplaceDisplay>
                  {requirementLine1 || (
                    <span className="text-500">Enter first requirement</span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={requirementLine1}
                    onChange={(e) => setRequirementLine1(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
              <Inplace closable className="mb-4">
                <InplaceDisplay>
                  {requirementLine2 || (
                    <span className="text-500">Enter second requirement</span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={requirementLine2}
                    onChange={(e) => setRequirementLine2(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
              <Inplace closable className="mb-0">
                <InplaceDisplay>
                  {requirementLine3 || (
                    <span className="text-500">Enter third requirement</span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={requirementLine3}
                    onChange={(e) => setRequirementLine3(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Tech Stack</div>
            <div className={myProfileStyles.fieldValue}>
              <Inplace closable>
                <InplaceDisplay>
                  {technologies.map((technology, technologyIndex) => {
                    return (
                      <Chip
                        key={technologyIndex}
                        removable
                        label={technology}
                        className="mr-2 text-sm"
                      />
                    );
                  })}
                  {technologies.length === 0 && (
                    <span className="text-500">
                      Choose the technologies required for the project
                    </span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <AutoComplete
                    multiple
                    value={technologies}
                    suggestions={filteredTechnologies}
                    completeMethod={searchTechnology}
                    onChange={(e) => setTechnologies(e.value)}
                  />
                </InplaceContent>
              </Inplace>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Description</div>
            <div className={myProfileStyles.fieldValue}>
              <Inplace closable>
                <InplaceDisplay>
                  {description || (
                    <span className="text-500">
                      Enter detailed description about the project
                    </span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Requests sent</div>
            <div className={myProfileStyles.fieldValue}>
              <span style={{ paddingLeft: "0.7rem" }}>
                {teamObject?.sentRequestCount}
              </span>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Requests received</div>
            <div className={myProfileStyles.fieldValue}>
              <span style={{ paddingLeft: "0.7rem" }}>
                {teamObject?.receivedRequestCount}
              </span>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Current Vacancies</div>
            <div className={myProfileStyles.fieldValue}>
              <span style={{ paddingLeft: "0.7rem" }}>
                {teamObject?.requiredTeamSize -
                  teamObject?.receivedRequestCount -
                  teamObject?.sentRequestCount -
                  1 -
                  teamObject?.memberIds.length}
              </span>
            </div>
          </li>

          <li className={myProfileStyles.fieldItem}>
            <Button
              onClick={updateProfile}
              label="Save Changes"
              className="w-full"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminTeamView;
