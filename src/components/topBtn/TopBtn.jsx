import { useEffect } from "react";
import "./TopBtn.css";
import { useLocation } from "react-router-dom";

function Topbtn() {
  //   페이지 이동 시 버튼 생성 || 숨김 재실행 유무를 위한 url값 불러오기
  const location = useLocation();
  useEffect(() => {
    // topBtn 불러오기
    const btn = document.getElementById("topBtn");

    // 스크롤 유무에 따라 버튼 숨김 || 생성
    const checkScroll = () => {
      const hasScroll =
        document.documentElement.scrollHeight > window.innerHeight;
      btn.style.display = hasScroll ? "block" : "none";
    };
    // window 스크롤 생성 시 버튼 생성 || 숨김
    window.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    // 초기 실행 1회
    checkScroll();

    // 등록된 이벤트 리스너 삭제
    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [location.pathname]);

  // 버튼 클릭시 최상단으로 부드럽게 이동 기능
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <button id="topBtn" onClick={scrollToTop}>
        topBtn
      </button>
    </>
  );
}

export default Topbtn;
