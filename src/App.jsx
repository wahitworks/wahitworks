import { useState, useEffect } from "react";
import Header from "./components/header/Header.jsx";
import { Outlet } from "react-router-dom";
import Topbtn from "./components/topBtn/topBtn.jsx";
import "./App.css";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showManualInstallHint, setShowManualInstallHint] = useState(false); // New state

  useEffect(() => {
    const handler = (e) => {
      console.log("beforeinstallprompt event fired!", e); // Added console.log for debugging
      // 사용자가 이전에 '아니오'를 선택했는지 확인
      const installDeclined = localStorage.getItem("installDeclined");
      if (installDeclined === "true") {
        console.log("User has previously declined installation.");
        return; // 모달을 띄우지 않고 종료
      }

      // 기본 프롬프트를 막고, '리모콘' 저장
      e.preventDefault();
      setDeferredPrompt(e);
      // 커스텀 모달을 띄우기 위해 상태 변경
      setShowInstallModal(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // '아니오' 버튼 클릭 시
  const handleInstallDismiss = () => {
    // 모달 닫기
    setShowInstallModal(false);
    // '다시는 보지 않기'를 위해 사용자의 선택을 영구적으로 기록
    localStorage.setItem("installDeclined", "true");

    // 수동 설치 힌트 표시
    setShowManualInstallHint(true);
    setTimeout(() => {
      setShowManualInstallHint(false);
    }, 5000); // 5초 후 힌트 숨김
  };

  const handleInstallAccept = async () => {
    if (!deferredPrompt) return;

    // 브라우저 설치창 띄우기
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    // 상태 초기화
    setDeferredPrompt(null);
    setShowInstallModal(false);
  };

  return (
    <>
      <Header />
      <main>
        <Outlet />
        <Topbtn />
        {/* 커스텀 앱 설치 모달 */}
        {showInstallModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <p>'대구맑음' 앱을 홈 화면에 추가하시겠습니까?</p>
              <button
                onClick={handleInstallAccept}
                className="modal-button primary"
              >
                설치
              </button>
              <button onClick={handleInstallDismiss} className="modal-button">
                나중에
              </button>
            </div>
          </div>
        )}
        {/* 수동 설치 힌트 메시지 */}
        {showManualInstallHint && (
          <div className="manual-install-hint">
            앱 설치는 브라우저 주소창의 설치 아이콘을 통해 언제든지 가능합니다.
          </div>
        )}
      </main>
    </>
  );
}

export default App;
