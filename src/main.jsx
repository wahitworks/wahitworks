import { createRoot } from "react-dom/client";
import Router from "./routes/Router.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import swRegister from "./swRegister.js";

// 개발 모드에서만 Eruda (모바일 콘솔) 활성화
// import.meta.env.DEV: {boolean} 앱이 개발 환경에서 실행 중인지 여부이며, 항상 import.meta.env.PROD와 반대되는 값을 가집니다.
if (import.meta.env.DEV) {
  import("eruda").then((eruda) => eruda.default.init());
}

swRegister();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router />
  </Provider>
);
