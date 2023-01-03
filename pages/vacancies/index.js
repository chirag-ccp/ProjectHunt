import React from "react";
import myGet from "../../middlewares/myGet";
import UserCard from "../../components/userCard";
import jwt_decode from "jwt-decode";

export default function Vacancies({ vacancies }) {
  console.log(vacancies);
  return (
    <div className="grid my-3 mx-auto">
      {/* {JSON.stringify(vacancies)} */}
      {vacancies?.map((vacancy, vacancyIndex) => {
        return (
          <div key={vacancyIndex} className="col-12 md:col-6 lg:col-4">
            <UserCard
              name={vacancy?.teamName}
              headline={"Created by ccp"}
              firstHighlight={vacancy?.requirementLine1}
              secondHighlight={vacancy?.requirementLine2}
              thirdHighlight={vacancy?.requirementLine3}
              technologies={vacancy?.requiredTechnologies}
              userId={vacancy?._id}
              parentLink={"teams"}
            ></UserCard>
          </div>
        );
      })}
      {vacancies.length == 0 && <h2>No Vacancies found</h2>}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const result = await myGet("http://localhost:3000/api/teams", ctx);

  let vacancies = JSON.parse(JSON.stringify(result?.vacancyArray));

  // Here we assume the cookie to be in the format
  // "auth=jwt_token"

  const cookie = ctx.req?.headers?.cookie;
  let userId;
  let validVacancies = [];
  if (cookie) {
    const jwtToken = cookie?.substring(5);
    const decoded = jwt_decode(jwtToken);
    userId = decoded?.userId;

    vacancies.forEach((vacancy) => {
      let isAdmin = vacancy?.adminId === userId ? true : false;
      let isMember = false;
      vacancy?.memberIds.forEach((memberId) => {
        if (memberId === userId) {
          isMember = true;
        }
      });
      if (isAdmin === false && isMember === false) {
        validVacancies.push(vacancy);
      }
    });
  }

  return {
    props: {
      vacancies: validVacancies,
    },
  };
}
