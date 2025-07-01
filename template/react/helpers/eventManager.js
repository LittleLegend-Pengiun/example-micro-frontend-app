/**
 * Dispatches custom events globally on the `window` object.
 *
 * @param {Array<{ name: string, detail: any }>} events - An array of event objects to dispatch.
 * Each object must contain a `name` (event type) and `detail` (event payload).
 *
 * @example
 * sendEvents([
 *   { name: 'customEvent', detail: { message: 'Hello' } }
 * ]);
 */
export function sendEvents(events) {
    for (const event of events) {
        const newEvent = new CustomEvent(event.name, { detail: event.detail });
        window.dispatchEvent(newEvent);
    }
}

/**
 * Adds global event listeners on the `window` object.
 *
 * @param {Array<{ name: string, handler: EventListener }>} listOfHandler - An array of event handlers.
 * Each object must contain the `name` of the event and a `handler` function.
 *
 * @example
 * receiveEvents([
 *   { name: 'customEvent', handler: (e) => console.log(e.detail) }
 * ]);
 */
export function receiveEvents(listOfHandler) {
    for (const eventHandler of listOfHandler) {
        window.addEventListener(eventHandler.name, eventHandler.handler);
    }
}

/**
 * Removes global event listeners from the `window` object.
 *
 * @param {Array<{ name: string, handler: EventListener }>} listOfHandler - An array of event handlers.
 * Each object must contain the `name` of the event and the `handler` function to remove.
 *
 * @example
 * removeListener([
 *   { name: 'customEvent', handler: existingHandler }
 * ]);
 */
export function removeListener(listOfHandler) {
    for (const eventHandler of listOfHandler) {
        window.removeEventListener(eventHandler.name, eventHandler.handler);
    }
}
