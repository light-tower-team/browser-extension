import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { App } from "./App.tsx";

const root = document.getElementById("root");

if (!root) {
  throw new Error("The root was not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
