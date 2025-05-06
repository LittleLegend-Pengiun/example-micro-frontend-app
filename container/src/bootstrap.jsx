import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import ExternalComponent from "../helpers/ExternalComponent.jsx"

const App = () => {
  return (
    <div>
      <h1>Container App</h1>
      <div style={{ border: "1px dashed #ccc", padding: "10px" }}>
        <ExternalComponent
          remoteUrl="http://localhost:3001/remoteEntry.js"
          scope="remote"
          module="./mount1"
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
