<template>
  <div>
    <h1>{{ packageJson.name }} App</h1>
    <div class="container">
      <!-- <EmbededMicroFrontEnd remoteUrl="http://localhost:4200/remoteEntry.js" scope="angularApp" module="./mount"
        type="module" /> -->
    </div>
  </div>
</template>

<script setup>
import packageJson from "../package.json";
import EmbededMicroFrontEnd from "../helpers/EmbededMicroFrontEnd.vue";
</script>

<style scoped>
.container {
  border: "1px dashed #ccc";
  padding: "10px";
}
</style>
