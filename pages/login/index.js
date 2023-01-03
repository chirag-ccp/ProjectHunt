import React, { useState, useRef } from "react";
import Router from "next/router";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";

export default function () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const msgs1 = useRef(null);

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const showError = (summary) => {
    msgs1.current.show({
      severity: "error",
      summary: summary,
      life: 8000,
    });
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    if (email === "" || password === "") {
      showError("All the fields are required");
      return;
    }

    if (validateEmail(email) === false) {
      showError("Invalid email, it should be of the form: example@email.com");
      return;
    }

    if (password.length < 8) {
      showError("Password must be atleast 8 characters long");
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    };

    const response = await fetch("/api/login", options);

    if (response.status === 401) {
      showError("Invalid Credentials");
      return;
    }

    Router.push("/");
  };

  return (
    <>
      <Messages className="z-1" ref={msgs1}></Messages>

      <form className="z-0">
        <div className="flex align-items-center justify-content-center mt-8">
          <div className="surface-card p-4 shadow-2 border-round-3xl w-9 sm:7 md:w-5 lg:w-4">
            <div className="text-center mb-5">
              <div className="text-900 text-3xl font-medium mb-3">Sign In</div>
            </div>

            <div>
              <InputText
                id="email"
                placeholder="Email"
                type="text"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3 text-center"
                style={{ borderRadius: "3rem" }}
              />

              <InputText
                id="password"
                placeholder="Password"
                type="password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3 text-center"
                style={{ borderRadius: "3rem" }}
              />

              <Button
                label="Sign In"
                value="Login"
                onClick={formSubmit}
                className="w-full mt-3 mb-4"
                style={{ borderRadius: "3rem" }}
              />
              <div className="text-center mb-5">
                <span className="text-600 font-medium line-height-3">
                  New here?
                </span>

                <Link href="/signup">
                  <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                    Create an account
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
