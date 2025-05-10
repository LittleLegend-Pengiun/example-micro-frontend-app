import React from "react";
import packageJson from "../package.json";
import MainPage from "./pages/MainPage";

/*
  React Component Entry Point
  Edit from here to code your mini app
*/
const MiniApp = () => (
  <div
    style={{
      textAlign: "center",
      border: "1px solid grey",
      borderRadius: "5px",
    }}
    id={`${packageJson.name}-mini-app-id`}
  >
    <h1 style={{ textAlign: "center", borderBottom: "1px solid grey" }}>
      Mini App: {packageJson.name}
    </h1>
    <MainPage />
  </div>
);

export default MiniApp;
