import "./Main.css";
import { useNavigate } from "react-router-dom";
import Topbtn from "../topBtn/topBtn";

function Main() {
  // 테스트
  const navigate = useNavigate();
  function redirectToMainDetail() {
    navigate("/detail");
  }

  // 스크롤 탑 버튼 이벤트리스너

  return (
    <>
      <div id="main-container">
        <h1 className="main-h1" onClick={redirectToMainDetail}>
          Main *클릭 시 상세페이지로 이동
        </h1>
      </div>
    </>
  );
}

export default Main;
