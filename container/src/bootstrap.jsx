import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { loadRemote } from "./loadRemoteModule";
import EmbeddedMiniApp from "./miniapp1/EmbeddedMiniApp";

const App = () => {
  return (
    <div>
      <h1>Container App</h1>
      <EmbeddedMiniApp />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
