<template>
  <div ref="remoteContainer"></div>
</template>

<script>
import { loadRemote } from "./loadRemoteModule";

/**
 * Vue component that dynamically embeds a micro frontend module at runtime using Webpack Module Federation.
 *
 * This component loads a remote module from a specified URL and mounts it into a container div.
 * It expects the remote module to expose a `mount` function that accepts a DOM element as its argument.
 *
 * @component
 * @prop {string} remoteUrl - The URL to the remote entry script (e.g., `http://localhost:3001/remoteEntry.js`).
 * @prop {string} scope - The global variable name (scope) used to access the remote container, aka `ModuleFederationPlugin.name` of the target micro-frontend (e.g., `remoteApp`).
 * @prop {string} module - The exposed module name/path to load from the remote (e.g., `./App`).
 *
 * @example
 * <EmbededMicroFrontEnd
 *   remote-url="http://localhost:3001/remoteEntry.js"
 *   scope="remoteApp"
 *   module="./App"
 * />
 */
export default {
  props: ['remoteUrl', 'scope', 'module', 'type'],
  async mounted() {
    loadRemote(this.$props.remoteUrl, this.$props.scope, this.$props.module, this.$props.type || "text/javascript")
    .then((remote) => {
      console.log("loadRemote then mount::", remote);
      remote.mount(this.$refs.remoteContainer);
    })
    .catch((err) => {
      console.error("Failed to load remote:", err);
    });
  },
};
</script>
