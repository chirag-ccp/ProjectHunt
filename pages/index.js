import { Button } from "primereact/button";
import Router from "next/router";

export default function Home() {
  return (
    <div className="align-center text-center">
      <h1 className="m-8 text-center max-w-32rem">
        {" "}
        Hunt ⛏️ down your Dream{" "}
        <span style={{ color: "rgb(153 0 255)" }}>Team</span> and{" "}
        <span style={{ color: "#006aff" }}>Projects</span> in the Techy Forest
      </h1>
      <Button
        label="Enter the Forest"
        value="Enter"
        onClick={() => {
          Router.push("login");
        }}
        className="w-2-rem p-button mx-auto"
        style={{ borderRadius: "1rem" }}
      />
    </div>
  );
}
