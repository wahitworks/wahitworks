import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import Main from "../components/main/Main.jsx";
import MainDetail from "../components/mainDetail/MainDetail.jsx";
import EditBookmark from "../components/editPages/EditBookmark.jsx"
import EditCard from "../components/editPages/EditCard.jsx";
import AppTutorial from "../components/explainPages/AppTutorial.jsx";
import Introduce from "../components/explainPages/Introduce.jsx";

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
        // 북마크 편집 페이지
        path: "/editbookmark",
        element: <EditBookmark />,
      },
      {
        // 카드 편집 페이지
        path: "/editcard",
        element: <EditCard />,
      },
      {
        // 앱 사용 방법 안내 페이지
        path: "/apptutorial",
        element: <AppTutorial />,
      },
      {
        // 사이트 소개 페이지
        path: "/introduce",
        element: <Introduce />,
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
