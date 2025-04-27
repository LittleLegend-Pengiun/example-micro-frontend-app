import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { loadRemote } from "./loadRemoteModule";
import remoteConfigs from "./remoteConfigs.json";

const EmbbededMiniApp = () => {
  const mountRefs = useRef([]);

  useEffect(() => {
    remoteConfigs.remotes.forEach((config, index) => {
      loadRemote(config.url, config.scope, config.module)
        .then((remote) => {
          console.log(`loadRemote then mount::`, remote);
          remote.mount(mountRefs.current[index]);
        })
        .catch((err) => {
          console.error("Failed to load remote:", err);
        });
    });
  }, []);

  return (
    <div>
      <h1>Container App</h1>
      {remoteConfigs.remotes.map((_, index) => (
        <div
          key={index}
          ref={(el) => (mountRefs.current[index] = el)}
          style={{ border: "1px dashed #ccc", padding: "10px", marginBottom: "10px" }}
        />
      ))}
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
