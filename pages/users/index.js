import React from "react";
import myGet from "../../middlewares/myGet";
import UserCard from "../../components/userCard";

export default function Users({ users }) {
  console.log(users);
  return (
    <div className="grid my-3 mx-auto">
      {users?.userArray.map((user, userIndex) => {
        return (
          <div key={userIndex} className="col-12 md:col-6 lg:col-4">
            <UserCard
              name={user?.name}
              headline={user?.headline}
              firstHighlight={user?.firstHighlight}
              secondHighlight={user?.secondHighlight}
              thirdHighlight={user?.thirdHighlight}
              technologies={user?.technologies}
              userId={user?._id}
              parentLink={"users"}
            ></UserCard>
          </div>
        );
      })}
    </div>
  );
}

Users.getInitialProps = async (ctx) => {
  const result = await myGet("http://localhost:3000/api/users", ctx);

  return { users: result };
};
