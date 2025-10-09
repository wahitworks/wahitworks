import "./Main.css";
import { useNavigate } from "react-router-dom";

function Main() {
  // 테스트
  const navigate = useNavigate();
  function redirectToMainDetail() {
    navigate("/detail");
  }
  return (
    <>
      <h1 className="main-h1" onClick={redirectToMainDetail}>
        Main *클릭 시 상세페이지로 이동
      </h1>
    </>
  );
}

export default Main;
