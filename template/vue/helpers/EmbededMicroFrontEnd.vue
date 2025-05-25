<template>
  <div ref="remoteRoot"></div>
</template>

<script setup>
import { onMounted } from "vue";
import { loadRemote } from "./loadRemoteModule";

const { remoteUrl, scope, module } = defineProps(['remoteUrl', 'scope', 'module'])
// export default {
onMounted(() => {
  loadRemote(remoteUrl, scope, module)
    .then((remote) => {
      console.log("loadRemote then moute::", remote);
      remote.mount(this.$refs.remoteRoot);
    })
    .catch((err) => {
      console.error("Failed to load remote:", err);
    });
})
// };
</script>
