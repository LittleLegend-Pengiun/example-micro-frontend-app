<template>
  <div ref="remoteContainer"></div>
</template>

<script>
import { loadRemote } from "./loadRemoteModule";

export default {
  name: 'RemoteWrapper',
  props: ['remoteUrl', 'scope', 'module'],
  async mounted() {
    loadRemote(this.$props.remoteUrl, this.$props.scope, this.$props.module)
    .then((remote) => {
      console.log("loadRemote then moute::", remote);
      remote.mount(this.$refs.remoteContainer);
    })
    .catch((err) => {
      console.error("Failed to load remote:", err);
    });
  },
};
</script>
