<template>
    <div>
      <h1>{{ packageJson.name }} App</h1>
      <div class="container">
        <EmbededMicroFrontEnd
          remoteUrl="http://localhost:3001/remoteEntry.js"
          scope="remote"
          module="./mount1"
        />
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
    padding: "10px"
}
</style>