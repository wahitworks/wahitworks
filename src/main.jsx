import { createRoot } from "react-dom/client";
import Router from "./routes/Router.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import swRegister from "./swRegister.js";

// 개발 모드에서만 Eruda (모바일 콘솔) 활성화
if (import.meta.env.DEV) {
  import('eruda').then(eruda => eruda.default.init());
}

swRegister();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router />
  </Provider>
);
