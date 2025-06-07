export function sendEvents(events) {
    for (const event of events) {
        const newEvent = new CustomEvent(event.name, { detail: event.detail });
        window.dispatchEvent(newEvent);
    }
}

export function receiveEvents(listOfHandler) {
    for (const eventHandler of listOfHandler) {
        window.addEventListener(eventHandler.name, eventHandler.handler);
    }
}

export function removeListener(listOfHandler) {
    for (const eventHandler of listOfHandler) {
        window.removeEventListener(eventHandler.name, eventHandler.handler);
    }
}
