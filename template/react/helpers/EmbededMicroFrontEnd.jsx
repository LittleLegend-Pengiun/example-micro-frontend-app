import React, { useRef, useEffect } from "react";
import { loadRemote } from "./loadRemoteModule";


/**
 * Embeds a micro frontend module dynamically at runtime using Webpack Module Federation.
 *
 * This React component loads a remote module from a specified URL and mounts it into a DOM element.
 * It expects the remote module to expose a `mount` function, which takes a DOM element as its argument.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.remoteUrl - The URL to the remote entry script (e.g., `http://localhost:3001/remoteEntry.js`).
 * @param {string} props.scope - The global variable name (scope) used to access the remote container, aka `ModuleFederationPlugin.name` of the target micro-frontend (e.g., `remoteApp`).
 * @param {string} props.module - The exposed module name/path to load from the remote (e.g., `./App`).
 *
 * @example
 * <EmbededMicroFrontEnd
 *   remoteUrl="http://localhost:3001/remoteEntry.js"
 *   scope="remoteApp"
 *   module="./App"
 * />
 *
 * @returns {JSX.Element} A `div` element where the remote component will be mounted.
 */
function EmbededMicroFrontEnd({ remoteUrl, scope, module }) {
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

export default EmbededMicroFrontEnd;
