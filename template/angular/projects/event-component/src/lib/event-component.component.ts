import { Component, OnInit, OnDestroy } from '@angular/core';

/**
 * Angular component that demonstrates cross-framework communication using `CustomEvent`.
 * It listens for events from other microfrontends (Vue and React), and can dispatch events
 * to other frameworks.
 *
 * @example
 * <lib-event-component></lib-event-component>
 *
 * // To send events from other apps:
 * window.dispatchEvent(new CustomEvent("vueMessage", { detail: "Hello from Vue!" }));
 * window.dispatchEvent(new CustomEvent("reactMessage", { detail: "Hello from React!" }));
 */
@Component({
  selector: 'lib-event-component',
  templateUrl: './event-component.component.html',
  styleUrls: ['./event-component.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {
  message = '';

  // List of event listeners
  private listeners = [
    {
      name: 'vueMessage',
      handler: (event: CustomEvent) => {
        this.message = `Vue: ${event.detail}`;
      }
    },
    {
      name: 'reactMessage',
      handler: (event: CustomEvent) => {
        this.message = `React: ${event.detail}`;
      }
    }
  ];

  ngOnInit(): void {
    // Register listeners
    this.listeners.forEach(({ name, handler }) => {
      window.addEventListener(name, handler as EventListener);
    });
  }

  ngOnDestroy(): void {
    // Remove listeners
    this.listeners.forEach(({ name, handler }) => {
      window.removeEventListener(name, handler as EventListener);
    });
  }

  /**
   * Dispatches a custom event named 'angularMessage' with a random number as detail.
   */
  sendEvent(): void {
    const event = new CustomEvent('angularMessage', {
      detail: `Random number ${new Date().getTime() % 10}`
    });
    window.dispatchEvent(event);
  }
}
