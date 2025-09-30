import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./routes/Router.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  // TODO: store 분배
  <StrictMode>
    <Router />
  </StrictMode>
);
