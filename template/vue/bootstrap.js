import { createApp } from 'vue';
import App from "./src/App.vue";

export function mount(el) {
  const app = createApp(App);
  app.mount(el);
}

// Auto-render if run as standalone (e.g. localhost:3001)
if (process.env.NODE_ENV === "development") {
  const standaloneRoot = document.getElementById("root-vue");
  if (standaloneRoot) {
    mount(standaloneRoot);
  }
}
