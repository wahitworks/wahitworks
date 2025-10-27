import "./App.css";
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";

import Topbtn from "./components/topBtn/TopBtn.jsx";
import Header from "./components/header/Header.jsx";
import AppTutorial from "./components/explainPages/AppTutorial.jsx";
import Toast from "./components/commons/Toast.jsx";
import { PWAInstallContext } from "./contexts/PWAInstallContext.jsx";

import { setShowInstallModal } from "./store/slices/headerSlice.js";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showManualInstallHint, setShowManualInstallHint] = useState(false); // New state
  const [isInstalling, setIsInstalling] = useState(false); // 설치 시도 중 상태 플래그
  const [showLandscapeToast, setShowLandscapeToast] = useState(false); // 가로모드 Toast 표시 여부

  const { isTutorialVisible, showInstallModal } = useSelector(
    (state) => state.headerSlice
  );

  // ======================================================
  // ||     useEffect : 가로모드 감지 → 2초간 Toast 표시
  // ======================================================
  useEffect(() => {
    const checkOrientation = () => {
      // 모바일 가로모드 감지:
      // 1. 가로 > 세로 (가로모드)
      // 2. 가로 < 1000px (최신 플래그십 모바일 포함)
      // 3. 1.8 < 가로/세로 비율 < 2.5 (모바일 가로모드 특유의 비율)
      const ratio = window.innerWidth / window.innerHeight;
      const isLandscape = window.innerWidth > window.innerHeight &&
                          window.innerWidth < 1000 &&
                          ratio > 1.8 && ratio < 2.5;

      if (isLandscape) {
        // 가로모드 감지 시 Toast 표시
        setShowLandscapeToast(true);

        // 2초 후 Toast 자동 숨김
        const timer = setTimeout(() => {
          setShowLandscapeToast(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    };

    checkOrientation(); // 초기 체크
    window.addEventListener('resize', checkOrientation);

    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // ======================================================
  // ||     pwa 설치 모달
  // ======================================================
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
          "유저 앱 설치 거부이력이 있으므로 커스텀 설치 모달을 띄우지 않습니다."
        );
        return; // 모달만 띄우지 않고 종료
      }

      // 커스텀 모달을 띄우기 위해 상태 변경
      dispatch(setShowInstallModal(true));
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isInstalling, dispatch]); // dispatch를 의존성 배열에 추가

  // '아니오' 버튼 클릭 시
  const handleInstallDismiss = () => {
    // 모달 닫기
    dispatch(setShowInstallModal(false));
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
      dispatch(setShowInstallModal(false));
      setIsInstalling(false);
    }
  };

  return (
    <PWAInstallContext.Provider value={{ deferredPrompt, handleInstallAccept }}>
      <>
        {/* 가로모드 경고 Toast (2초간 표시) */}
        <Toast
          show={showLandscapeToast}
          message="세로모드에 최적화되어 있습니다. 세로모드로 사용해 주세요."
          backgroundColor="#333"
          borderColor="#333"
          top="35%"
        />

        <Header />
        <main>
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
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
        {isTutorialVisible && <AppTutorial />}
      </>
    </PWAInstallContext.Provider>
  );
}

export default App;
