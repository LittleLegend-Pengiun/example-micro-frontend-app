import React from "./react/node_modules/react/index.js";
import { createRoot } from "./react/node_modules/react-dom/client.js";
import App from "./src/App";

export function mount(el) {
  const root = createRoot(el);
  root.render(<App />);
}

// Auto-render if run as standalone (e.g. localhost:3001)
if (process.env.NODE_ENV === "development") {
  const standaloneRoot = document.getElementById("root");
  if (standaloneRoot) {
    mount(standaloneRoot);
  }
}
