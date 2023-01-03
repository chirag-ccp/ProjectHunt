import { useState } from "react";
import myGet from "../../middlewares/myGet";
import jwt_decode from "jwt-decode";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import techStack from "../../utils/techStack";

const myProfileStyles = {
  fieldItem:
    "flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap",
  fieldName: "text-500 w-6 md:w-3 font-medium",
  fieldValue:
    "text-900 mt-3 md:mt-0 w-full md:w-7 md:flex-order-0 flex-order-1",
};

function Profile({ user }) {
  const initialProfile = {
    name: user?.userObject.name,
    headline: user?.userObject.headline,
    firstHighlight: user?.userObject.firstHighlight,
    secondHighlight: user?.userObject.secondHighlight,
    thirdHighlight: user?.userObject.thirdHighlight,
    technologies: user?.userObject.technologies,
    description: user?.userObject.description,
    githubProfile: user?.userObject.githubProfile,
    kaggleProfile: user?.userObject.kaggleProfile,
    codechefProfile: user?.userObject.codechefProfile,
    codeforcesProfile: user?.userObject.codeforcesProfile,
    leetcodeProfile: user?.userObject.leetcodeProfile,
    contactNumber: user?.userObject.contactNumber,
  };
  const [name, setName] = useState(initialProfile.name);
  const [headline, setHeadline] = useState(initialProfile.headline);
  const [firstHighlight, setFirstHighlight] = useState(
    initialProfile.firstHighlight
  );
  const [secondHighlight, setSecondHighlight] = useState(
    initialProfile.secondHighlight
  );
  const [thirdHighlight, setThirdHighlight] = useState(
    initialProfile.thirdHighlight
  );

  const [availableTechnologies, setAvailableTechnologies] = useState(techStack);
  const [technologies, setTechnologies] = useState(initialProfile.technologies);
  const [filteredTechnologies, setFilteredTechnologies] = useState(null);
  const [description, setDescription] = useState(initialProfile.description);
  const [githubProfile, setGithubProfile] = useState(
    initialProfile.githubProfile
  );
  const [kaggleProfile, setKaggleProfile] = useState(
    initialProfile.kaggleProfile
  );
  const [codechefProfile, setCodechefProfile] = useState(
    initialProfile.codechefProfile
  );
  const [codeforcesProfile, setCodeforcesProfile] = useState(
    initialProfile.codeforcesProfile
  );
  const [leetcodeProfile, setLeetcodeProfile] = useState(
    initialProfile.leetcodeProfile
  );
  const [contactNumber, setContactNumber] = useState(
    initialProfile.contactNumber
  );

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
      _id: user?.userObject._id,
      name: name,
      headline: headline,
      description: description,
      technologies: technologies,
      firstHighlight: firstHighlight,
      secondHighlight: secondHighlight,
      thirdHighlight: thirdHighlight,
      githubProfile: githubProfile,
      kaggleProfile: kaggleProfile,
      codechefProfile: codechefProfile,
      codeforcesProfile: codeforcesProfile,
      leetcodeProfile: leetcodeProfile,
      contactNumber: contactNumber,
    };

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(`/api/users/${user?.userObject._id}`, options);
    console.log(response);
  };

  return (
    <div>
      <div className="surface-0 m-8">
        <div className="font-medium text-3xl text-900 mb-3">My Profile</div>
        <div className="text-500 mb-5">
          Click on the respective field contents to modify the field
        </div>
        <ul className="list-none p-0 m-0">
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Name</div>
            <div className={myProfileStyles.fieldValue}>
              <Inplace closable>
                <InplaceDisplay>
                  {name || <span className="text-500">Enter your name</span>}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Headline</div>
            <div className={myProfileStyles.fieldValue}>
              <Inplace closable>
                <InplaceDisplay>
                  {headline || <span className="text-500">Enter Headline</span>}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Contact Number</div>
            <div className={myProfileStyles.fieldValue}>
              <Inplace closable>
                <InplaceDisplay>
                  {contactNumber || (
                    <span className="text-500">Enter your Contact Number</span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Highlights</div>
            <div className={myProfileStyles.fieldValue}>
              <Inplace closable className="mb-4">
                <InplaceDisplay>
                  {firstHighlight || (
                    <span className="text-500">Enter first highlight</span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={firstHighlight}
                    onChange={(e) => setFirstHighlight(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
              <Inplace closable className="mb-4">
                <InplaceDisplay>
                  {secondHighlight || (
                    <span className="text-500">Enter second highlight</span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={secondHighlight}
                    onChange={(e) => setSecondHighlight(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
              <Inplace closable className="mb-0">
                <InplaceDisplay>
                  {thirdHighlight || (
                    <span className="text-500">Enter third highlight</span>
                  )}
                </InplaceDisplay>
                <InplaceContent>
                  <InputText
                    value={thirdHighlight}
                    onChange={(e) => setThirdHighlight(e.target.value)}
                    autoFocus
                  />
                </InplaceContent>
              </Inplace>
            </div>
          </li>
          <li className={myProfileStyles.fieldItem}>
            <div className={myProfileStyles.fieldName}>Technologies</div>
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
                      Choose the technologies you know
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
                    <span className="text-500">Enter Description</span>
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
            <div className={myProfileStyles.fieldName}>Coding Profiles</div>
            <div className={myProfileStyles.fieldValue}>
              <div className="mb-5 mt-1">
                <Inplace closable>
                  <InplaceDisplay>
                    {githubProfile || (
                      <span className="text-500">Add Github Profile url</span>
                    )}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputText
                      value={githubProfile}
                      onChange={(e) => setGithubProfile(e.target.value)}
                      autoFocus
                    />
                  </InplaceContent>
                </Inplace>
              </div>
              <div className="mb-5">
                <Inplace closable>
                  <InplaceDisplay>
                    {kaggleProfile || (
                      <span className="text-500">Add Kaggle Profile url</span>
                    )}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputText
                      value={kaggleProfile}
                      onChange={(e) => setKaggleProfile(e.target.value)}
                      autoFocus
                    />
                  </InplaceContent>
                </Inplace>
              </div>
              <div className="mb-5">
                <Inplace closable>
                  <InplaceDisplay>
                    {codeforcesProfile || (
                      <span className="text-500">
                        Add Codeforces Profile url
                      </span>
                    )}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputText
                      value={codeforcesProfile}
                      onChange={(e) => setCodeforcesProfile(e.target.value)}
                      autoFocus
                    />
                  </InplaceContent>
                </Inplace>
              </div>
              <div className="mb-5">
                <Inplace closable>
                  <InplaceDisplay>
                    {codechefProfile || (
                      <span className="text-500">Add Codechef Profile url</span>
                    )}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputText
                      value={codechefProfile}
                      onChange={(e) => setCodechefProfile(e.target.value)}
                      autoFocus
                    />
                  </InplaceContent>
                </Inplace>
              </div>
              <div className="mb-1">
                <Inplace closable>
                  <InplaceDisplay>
                    {leetcodeProfile || (
                      <span className="text-500">Add Leetcode Profile url</span>
                    )}
                  </InplaceDisplay>
                  <InplaceContent>
                    <InputText
                      value={leetcodeProfile}
                      onChange={(e) => setLeetcodeProfile(e.target.value)}
                      autoFocus
                    />
                  </InplaceContent>
                </Inplace>
              </div>
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
}

export default Profile;

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

  const result = await myGet(`http://localhost:3000/api/users/${userId}`, ctx);

  return { props: { user: result } };
}
