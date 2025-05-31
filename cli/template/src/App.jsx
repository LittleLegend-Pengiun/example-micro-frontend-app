import React from "react";
import EmbededMicroFrontEnd from "../helpers/EmbededMicroFrontEnd.jsx";
import packageJson from "../package.json";

const App = () => {
  return (
    <div>
      <h1>{packageJson.name} App</h1>
      <div
        style={{ border: "1px dashed #ccc", padding: "10px", margin: "20px" }}
      >
        <h2>Micro-Frontend Integration Example</h2>
        <p>
          To import another micro-frontend, uncomment and modify the following
          component:
        </p>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {`<EmbededMicroFrontEnd
  remoteUrl="http://localhost:3001/remoteEntry.js"  // URL to the remote app's entry point
  scope="remote-app-name"                           // Name of the remote app (must match its package.json name)
  module="./mount"                                  // The exposed module path from the remote app
/>`}
        </pre>
        <p style={{ color: "#666", fontSize: "14px" }}>
          Note: Make sure the remote app is running and the parameters match its
          configuration.
        </p>
      </div>
    </div>
  );
};

export default App;
