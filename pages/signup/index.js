import React, { useState, useRef } from "react";
import Router from "next/router";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
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

    if (
      name === " " ||
      email === "" ||
      password === "" ||
      reEnterPassword === ""
    ) {
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

    if (password !== reEnterPassword) {
      showError("Passwords do not match");
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, email: email, password: password }),
    };

    const response = await fetch("http://localhost:3000/api/signup", options);

    if (response.status === 409) {
      showError("User Already Exists");
      return;
    }

    // const result = await response.json();

    Router.push("login");
  };

  return (
    <>
      <Messages ref={msgs1}></Messages>
      <form>
        <div className="flex align-items-center justify-content-center mt-6">
          <div className="surface-card p-4 shadow-2 border-round-3xl w-9 sm:7 md:w-5 lg:w-4">
            <div className="text-center mb-5">
              <div className="text-900 text-3xl font-medium mb-3">Sign Up</div>
            </div>

            <div>
              <InputText
                id="name"
                placeholder="Enter your name"
                type="text"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-3 text-center"
                style={{ borderRadius: "3rem" }}
              />

              <InputText
                id="email"
                placeholder="Enter email"
                type="email"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3 text-center"
                style={{ borderRadius: "3rem" }}
              />

              <InputText
                id="password"
                placeholder="Enter password"
                type="password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3 text-center"
                style={{ borderRadius: "3rem" }}
              />

              <InputText
                id="reEnterPassword"
                placeholder="Re-enter password"
                type="password"
                value={reEnterPassword}
                name="reEnterPassword"
                onChange={(e) => setReEnterPassword(e.target.value)}
                className="w-full mb-3 text-center"
                style={{ borderRadius: "3rem" }}
              />

              <Button
                label="Sign Up"
                value="Sign Up"
                onClick={formSubmit}
                className="w-full mt-3 mb-4"
                style={{ borderRadius: "3rem" }}
              />
              <div className="text-center mb-5">
                <span className="text-600 font-medium line-height-3">
                  Already have an account?
                </span>

                <Link href="/login">
                  <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                    Sign in
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
