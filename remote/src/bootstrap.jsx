import React from "react";
import { createRoot } from "react-dom/client";
import Button from "./Button";

export function mount(el) {
  const root = createRoot(el);
  root.render(
    <div>
      <h2>Remote App</h2>
      <Button />
    </div>
  );
}

// Auto-render if run as standalone (e.g. localhost:3001)
if (process.env.NODE_ENV === "development") {
  const standaloneRoot = document.getElementById("_remote-root");
  if (standaloneRoot) {
    mount(standaloneRoot);
  }
}
