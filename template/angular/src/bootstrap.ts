import 'zone.js';

import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));

export function mount(el: HTMLElement | Element) {
  // Clear the element first (optional, to avoid duplicates)
  el.innerHTML = '';
  // Create the Angular custom element and append it to the provided container
  const angularElement = document.createElement('angular-element');
  el.appendChild(angularElement);
}

const standaloneRoot = document.querySelector("app-root");
if (standaloneRoot) {
  mount(standaloneRoot);
}
