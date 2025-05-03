import React, { useEffect, useRef } from "react";
import { loadRemote } from "../loadRemoteModule";
import remoteConfigs from "./remoteConfigs.json";

const EmbeddedMiniApp = () => {
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
      {remoteConfigs.remotes.map((_, index) => (
        <div
          key={index}
          ref={(el) => (mountRefs.current[index] = el)}
          style={{
            border: "1px dashed #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
      ))}

      {/* <div>
        <div
          key={index}
          ref={(el) => (mountRefs.current[0] = el)}
          style={{
            border: "1px dashed #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
        <div
          key={index}
          ref={(el) => (mountRefs.current[1] = el)}
          style={{
            border: "1px dashed #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
      </div>

      <div>
        <div
          key={index}
          ref={(el) => (mountRefs.current[2] = el)}
          style={{
            border: "1px dashed #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
        <div
          key={index}
          ref={(el) => (mountRefs.current[3] = el)}
          style={{
            border: "1px dashed #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        />
      </div> */}
    </div>
  );
};

export default EmbeddedMiniApp;
