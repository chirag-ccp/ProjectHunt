import Router from "next/router";
import fetch from "isomorphic-unfetch";

export default async function (url, ctx) {
  const cookie = ctx.req?.headers.cookie;

  // The process is client -> next server -> api (called in fetch)
  // If we do not include cookie here in headers,
  // the coookie will remain in next server and will not be passed further to the api
  const response = await fetch(url, {
    headers: {
      cookie,
    },
  });

  // We are on unauthorized
  // on Client Side
  if (response.status === 401 && !ctx.req) {
    Router.replace("/login");
    return {};
  }

  // We are unauthorized
  // on Server Side
  if (response.status === 401 && ctx.req) {
    ctx.res?.writeHead(302, {
      Location: "http://localhost:3000/login",
    });

    ctx.res?.end();
    return;
  }

  const result = await response.json();

  return result;
}
