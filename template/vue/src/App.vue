<template>
  <div>
    <h1>{{ packageJson.name }} App</h1>
    <div class="container" style="border: 1px dashed #ccc;
    padding: 10px;">
      <EventComponent />
      <!-- <EmbededMicroFrontEnd
        remoteUrl="http://localhost:3000/remoteEntry.js"
        scope="container"
        module="./mount"
      /> -->
    </div>
  </div>
</template>

<script setup>
import packageJson from "../package.json";
import EmbededMicroFrontEnd from "../helpers/EmbededMicroFrontEnd.vue";
import EventComponent from "./EventComponent.vue";
</script>
