import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import Main from "../components/main/Main.jsx";
import MainDetail from "../components/mainDetail/MainDetail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        // useNavigate 테스트 용 상세 페이지
        path: "/detail",
        element: <MainDetail />,
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
