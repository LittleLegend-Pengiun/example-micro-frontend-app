import React, { useRef, useEffect } from "react";
import { loadRemote } from "./loadRemoteModule";

function ExternalComponent({ remoteUrl, scope, module }) {
  const mountRef = useRef(null);
  useEffect(() => {
    loadRemote(remoteUrl, scope, module)
      .then((remote) => {
        console.log("loadRemote then moute::", remote);
        remote.mount(mountRef.current);
      })
      .catch((err) => {
        console.error("Failed to load remote:", err);
      });
    
  }, []);
  return <div ref={mountRef} />;
}

export default ExternalComponent;
