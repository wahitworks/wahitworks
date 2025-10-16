import { useState, useEffect } from "react";
import Header from "./components/header/Header.jsx";
import { Outlet } from "react-router-dom";
import Topbtn from "./components/topBtn/topBtn.jsx";
import "./App.css";
import { PWAInstallContext } from "./contexts/PWAInstallContext.jsx";

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
      e.preventDefault(); // 이벤트 리스너로 받은 e의 메써드
      setDeferredPrompt(e); // 받은 이벤트 객체로 로컬 state 변경
      // 커스텀 모달을 띄우기 위해 상태 변경
      setShowInstallModal(true);
    };

    window.addEventListener("beforeinstallprompt", handler); //'이벤트이름', '실행할 함수' 이벤트리스너가 이벤트 객체를 handler함수의 첫 인자로 넘겨줌

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
    deferredPrompt.prompt(); //이벤트 객체의 설치 팝업 꺼내는 함수
    await deferredPrompt.userChoice;

    // 상태 초기화
    setDeferredPrompt(null);
    setShowInstallModal(false);
  };

  return (
    <PWAInstallContext.Provider value={{ deferredPrompt, handleInstallAccept }}>
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
              추후 수동 설치는 해당 홈페이지 우측 상단 메뉴에서 가능합니다.
            </div>
          )}
        </main>
      </>
    </PWAInstallContext.Provider>
  );
}

export default App;
