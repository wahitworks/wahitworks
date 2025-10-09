import { createRoot } from "react-dom/client";
import Router from "./routes/Router.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";

createRoot(document.getElementById("root")).render(
  // TODO: store 분배
  <Provider store={store}>
    <Router />
  </Provider>
);
