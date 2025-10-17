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
  const [isInstalling, setIsInstalling] = useState(false); // 설치 시도 중 상태 플래그

  useEffect(() => {
    const handler = (e) => {
      // 현재 설치 과정이 진행 중이면, 새로운 이벤트를 무시
      if (isInstalling) {
        return;
      }

      // 기본 프롬프트를 막고, '리모콘'을 항상 저장
      e.preventDefault();
      setDeferredPrompt(e);

      console.log("beforeinstallprompt event fired!", e); // Added console.log for debugging
      // 사용자가 이전에 '아니오'를 선택했는지 확인
      const installDeclined = localStorage.getItem("installDeclined");
      if (installDeclined === "true") {
        console.log(
          "User has previously declined installation, hiding modal but enabling manual install."
        );
        return; // 모달만 띄우지 않고 종료
      }

      // 커스텀 모달을 띄우기 위해 상태 변경
      setShowInstallModal(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isInstalling]); // isInstalling을 의존성 배열에 추가

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
    if (!deferredPrompt || isInstalling) return;

    setIsInstalling(true);
    try {
      // 사용자가 수동으로 설치를 시도하므로, 과거의 거절 기록은 일단 삭제해준다.
      localStorage.removeItem("installDeclined");

      // 브라우저 프롬프트를 띄운다.
      deferredPrompt.prompt();

      // 사용자의 선택을 기다리고 결과를 받는다.
      const { outcome } = await deferredPrompt.userChoice;

      // 만약 여기서도 거절했다면, 그 기록을 새로 남긴다.
      if (outcome === "dismissed") {
        localStorage.setItem("installDeclined", "true");
        console.log("User dismissed the browser install prompt.");
      } else {
        console.log("User accepted the install prompt.");
      }
    } finally {
      // 모든 과정이 끝나면 상태를 초기화한다.
      setDeferredPrompt(null);
      setShowInstallModal(false);
      setIsInstalling(false);
    }
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
              메뉴에서 언제든 설치가 가능합니다.
            </div>
          )}
        </main>
      </>
    </PWAInstallContext.Provider>
  );
}

export default App;
