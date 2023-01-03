import Router from "next/router";

function logout({ message }) {
  return <div>{message}</div>;
}

export default logout;

logout.getInitialProps = async (ctx) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch("http://localhost:3000/api/logout", options);

  // on Client Side
  if (!ctx.req) {
    Router.replace("/login");
    return {};
  }

  // on Server Side
  if (ctx.req) {
    ctx.res?.writeHead(302, {
      Location: "http://localhost:3000/",
    });

    ctx.res?.end();
    return;
  }

  return { message: "Logout Successful" };
};
