import React from "react";
import EmbededMicroFrontEnd from "../helpers/EmbededMicroFrontEnd.jsx";

const App = () => {
  return (
    <div>
      <h1>Container App</h1>
      <div style={{ border: "1px dashed #ccc", padding: "10px" }}>
        <EmbededMicroFrontEnd
          remoteUrl="http://localhost:3001/remoteEntry.js"
          scope="remote"
          module="./mount1"
        />
      </div>
    </div>
  );
};

export default App;
