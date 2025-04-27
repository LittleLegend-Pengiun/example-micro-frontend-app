import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { loadRemote } from "./loadRemoteModule";

const App = () => {
  const mountRef = useRef(null);
  const mountRef2 = useRef(null);

  useEffect(() => {
    loadRemote("http://localhost:3001/remoteEntry.js", "remote", "./mount1")
      .then((remote) => {
        console.log("loadRemote then moute::", remote);
        remote.mount(mountRef.current);
      })
      .catch((err) => {
        console.error("Failed to load remote:", err);
      });
    loadRemote("http://localhost:3001/remoteEntry.js", "remote", "./mount1")
      .then((remote) => {
        console.log("loadRemote then moute::", remote);
        remote.mount(mountRef2.current);
      })
      .catch((err) => {
        console.error("Failed to load remote:", err);
      });
  }, []);

  return (
    <div>
      <h1>Container App</h1>
      <div
        ref={mountRef}
        style={{ border: "1px dashed #ccc", padding: "10px" }}
      />
      <div
        ref={mountRef2}
        style={{ border: "1px dashed #ccc", padding: "10px" }}
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
