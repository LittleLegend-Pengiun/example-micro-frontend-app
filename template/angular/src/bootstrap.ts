import 'zone.js';

import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import packageJson from '../package.json';

const ngVersion = packageJson.dependencies['@angular/core']; // better just take the major version 

(window as any).plattform = (window as any).plattform || {};
let platform = (window as any).plattform[ngVersion];
if (!platform) {
  platform = platformBrowser();
  (window as any).plattform[ngVersion] = platform; 
}
platform.bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch((err: any) => console.error(err));

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
