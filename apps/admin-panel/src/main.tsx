import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexProvider } from "convex/react";
import { ConvexReactClient } from "convex/react";
import App from "./App";
import "./index.css";

window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.error("[Global Error]", { msg, url, lineNo, columnNo, error });
  return false;
};

window.onunhandledrejection = (event) => {
  console.error("[Unhandled Promise Rejection]", event.reason);
};

const convexUrl = import.meta.env.VITE_CONVEX_URL;
console.log("[main.tsx] Initializing Convex with URL:", convexUrl);
console.log("[main.tsx] Admin secret:", import.meta.env.VITE_ADMIN_SECRET);

const convex = new ConvexReactClient(convexUrl as string);

console.log("[main.tsx] Rendering app...");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>,
);
