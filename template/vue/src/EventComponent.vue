<template>
  <div>
    <p v-if="message">Message receive: {{ message }}</p>
    <p v-else>Waiting for data...</p>
    <button @click="handleClick">Send Vue message</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  receiveEvents,
  removeListener,
  sendEvents,
} from "../helpers/eventManager";

const message = ref("");

function handleClick() {
  const events = [
    {
      name: "vueMessage",
      detail: `Random number ${new Date().getTime() % 10}`,
    },
  ];
  sendEvents(events);
}

const listOfHandler = [
  {
    name: "reactMessage",
    handler: (event) => {
      message.value = event.detail;
    },
  },
];

onMounted(() => {
  receiveEvents(listOfHandler);
});

onUnmounted(() => {
  removeListener(listOfHandler);
});
</script>
