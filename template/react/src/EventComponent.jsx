import React from "react";
import { receiveEvents, removeListener, sendEvents } from "../helpers/eventManager";

/**
 * React component that demonstrates cross-framework communication using `CustomEvent`.
 * It listens for events from other microfrontends (Vue and Angular), and can dispatch events
 * to other frameworks.
 *
 * @component
 *
 * @example
 * // Inside a React app
 * <EventComponent />
 *
 * // Expected integration in other apps to send events:
 * window.dispatchEvent(new CustomEvent("vueMessage", { detail: "Hello from Vue!" }));
 * window.dispatchEvent(new CustomEvent("angularMessage", { detail: "Hello from Angular!" }));
 */
const EventComponent = () => {
  const [message, setMessage] = React.useState("");

  /**
   * Handles the click event by dispatching a `reactMessage` custom event with a random number.
   *
   * @function
   * @returns {void}
   */
  function handleClick() {
    const events = [
      {
        name: "reactMessage",
        detail: `Random number ${new Date().getTime() % 10}`,
      },
    ];
    sendEvents(events);
  }

  /**
   * Event handler list for receiving events from other apps.
   * Listens for events from Vue and Angular microfrontends.
   *
   * @type {Array<{ name: string, handler: (event: CustomEvent) => void }>}
   */
  const listOfHandler = [
    {
      name: "vueMessage",
      handler: (event) => {
        setMessage(`Vue: ${event.detail}`);
      },
    },
    {
      name: "angularMessage",
      handler: (event) => {
        setMessage(`Angular: ${event.detail}`);
      },
    },
  ];

  // Subscribe to incoming events on mount and clean up on unmount
  React.useEffect(() => {
    receiveEvents(listOfHandler);
    return () => {
      removeListener(listOfHandler);
    };
  }, [message]);

  return (
    <div>
      {message ? <p>Message receive: {message}</p> : <p>Waiting for data...</p>}
      <button onClick={handleClick}>Send Event React</button>
    </div>
  );
};

export default EventComponent;
