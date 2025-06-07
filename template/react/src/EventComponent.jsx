import React from "react";
import { receiveEvents, removeListener, sendEvents } from "../helpers/eventManager";

const EventComponent = () => {
  const [message, setMessage] = React.useState("");

  function handleClick() {
    const events = [
      {
        name: "reactMessage",
        detail: `Random number ${new Date().getTime() % 10}`,
      },
    ];
    sendEvents(events);
  }

  const listOfHandler = [
    {
      name: "vueMessage",
      handler: (event) => {
        setMessage(event.detail);
      },
    },
  ];

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
