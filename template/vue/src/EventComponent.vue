<template>
  <div>
    <p v-if="message">Message receive: {{ message }}</p>
    <p v-else>Waiting for data...</p>
    <button @click="handleClick">Send Vue message</button>
  </div>
</template>

<script>
import {
  receiveEvents,
  removeListener,
  sendEvents,
} from "../helpers/eventManager";

/**
 * Vue component that demonstrates inter-framework communication
 * using CustomEvent-based messaging (e.g., between microfrontends).
 *
 * - Sends a `vueMessage` event on button click.
 * - Listens for `reactMessage` from other apps (e.g., React).
 *
 * @component
 */
export default {
  name: "RemoteEventComponent",

  data() {
    return {
      /**
       * Message received from external `CustomEvent`.
       * @type {string}
       */
      message: "",
      /**
       * @type {Array<{ name: string, handler: (event: CustomEvent) => void }>}
       */
      listOfHandler: [],
    };
  },

  methods: {
    /**
     * Emits a `vueMessage` event with a random number.
     */
    handleClick() {
      const events = [
        {
          name: "vueMessage",
          detail: `Random number ${new Date().getTime() % 10}`,
        },
      ];
      sendEvents(events);
    },

    /**
     * Event handler for `reactMessage` that updates the message state.
     *
     * @param {CustomEvent} event
     */
    handleReactMessage(event) {
      this.message = event.detail;
    },
  },

  mounted() {
    this.listOfHandler = [
      {
        name: "reactMessage",
        handler: this.handleReactMessage,
      },
    ];

    receiveEvents(this.listOfHandler);
  },

  unmounted() {
    removeListener(this.listOfHandler);
  },
};
</script>
