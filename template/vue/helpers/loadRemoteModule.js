/**
 * Dynamically loads a remote module from a specified URL using Webpack 5 Module Federation.
 *
 * This function appends a `<script>` tag to load the remote container, initializes shared scopes,
 * and retrieves a specific exposed module from the remote scope.
 *
 * @async
 * @function loadRemote
 * @param {string} remoteUrl - The URL to the remote container's JavaScript file.
 * @param {string} scope - The global variable name under `window` used by the remote container. Usually this is the `ModuleFederationPlugin.name` in `webpack.config.js` of the target micro-frontend.
 * @param {string} module - The module path (as exposed in Module Federation config) to load from the remote.
 * @param {string} type - The type of the script tag.
 * @returns {Promise<*>} - A Promise that resolves to the loaded remote module.
 *
 * @throws Will reject the Promise if the script fails to load or the remote scope/module is not found.
 *
 * @example
 * const module = await loadRemote("http://localhost:3001/remoteEntry.js", "remoteApp", "./MyComponent");
 * const MyComponent = module.default;
 */
export async function loadRemote(remoteUrl, scope, module, type) {
  await __webpack_init_sharing__("default");

  // Check if this is an Angular microfrontend (ES module)
  if (
    type === "module" ||
    remoteUrl.includes("angular") ||
    scope === "angular"
  ) {
    return loadAngularRemote(remoteUrl, scope, module);
  }

  // Original logic for React/Vue microfrontends
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = remoteUrl;
    script.type = type;
    script.async = true;

    console.log("loadRemote inside script::", script);

    script.onload = async () => {
      console.log(window);
      const container = window[scope];

      if (!container) return reject(`Remote scope ${scope} not found`);
      await container.init(__webpack_share_scopes__.default);
      const factory = await container.get(module);

      const Module = factory();

      resolve(Module);
    };

    script.onerror = () => reject(`Failed to load remote: ${remoteUrl}`);
    document.head.appendChild(script);
  });
}

// New function to handle Angular ES module remotes
async function loadAngularRemote(remoteUrl, scope, module) {
  try {
    // Use dynamic import for ES modules
    const container = await import(/* webpackIgnore: true */ remoteUrl);
    console.log("container::", container);

    // Initialize the container with shared scope
    await container.init(__webpack_share_scopes__.default);

    // Get the specific module (e.g., "./mount")
    const factory = await container.get(module);
    const Module = factory();

    return Module;
  } catch (error) {
    throw new Error(`Failed to load Angular remote: ${error.message}`);
  }
}
