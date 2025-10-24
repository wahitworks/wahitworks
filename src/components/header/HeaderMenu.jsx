import "./HeaderMenu.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect } from "react";

// import installIconUrl from "../../assets/icons/install_icon.svg";

import { MdDownload } from "react-icons/md";

import {
  setMenuFlg,
  setSearchFlg,
  setTutorialVisible,
} from "../../store/slices/headerSlice.js";

import { PWAInstallContext } from "../../contexts/PWAInstallContext.jsx";

function HeaderMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deferredPrompt, handleInstallAccept } = useContext(PWAInstallContext);

  // ===== 전역 State =====
  const menuFlg = useSelector((state) => state.headerSlice.menuFlg);

  // ===== 마운트, 언마운트 - 스크롤 방지 설정 =====
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // ===== handle =====

  /**
   * 메뉴 끄기
   */
  const handleMenuClose = () => {
    dispatch(setMenuFlg(false));
    dispatch(setSearchFlg(false));
  };

  return (
    <div className="app-wrapper">
      <AnimatePresence>
        {menuFlg && (
          <>
            {/* 불투명 배경 */}
            <motion.div
              className="header-Menu-background"
              onClick={() => handleMenuClose()}
              initial={{
                opacity: 0,
                backdropFilter: "blur(0px) brightness(100%)",
              }}
              animate={{
                opacity: 1,
                backdropFilter: "blur(3px) brightness(80%)", // 블러 + 어둡게!
              }}
              exit={{
                opacity: 0,
                backdropFilter: "blur(0px) brightness(100%)",
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            />

            {/* 실제 영역 */}
            <div
              className="heacer-Menu-wrapper"
              onClick={() => handleMenuClose()}
            >
              <motion.div
                className="header-Menu-container"
                onClick={(e) => e.stopPropagation()}
                initial={{
                  opacity: 0,
                  filter: "blur(10px)",
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(10px)",
                  x: 20,
                }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
              >
                {/* 상단 영역 */}
                <div className="header-Menu-container-top">
                  <h2 className="header-Menu-container-title">메뉴</h2>
                  <div
                    className="header-Menu-off"
                    onClick={() => handleMenuClose()}
                  >
                    ✕
                  </div>
                </div>

                <hr className="header-Menu-container-bar" />

                {/* 메뉴 영역 */}
                <div className="header-Menu-container-main">
                  <p
                    className="header-Menu-container-list"
                    onClick={() => {
                      handleMenuClose();
                      navigate("/");
                    }}
                  >
                    홈
                  </p>
                  <div className="haeder-Menu-empty-line"></div>
                  {/* <hr className="header-Menu-line" /> */}
                  <p
                    className="header-Menu-container-list"
                    onClick={() => {
                      handleMenuClose();
                      navigate("/editbookmark");
                    }}
                  >
                    내 장소 관리
                  </p>
                  <p
                    className="header-Menu-container-list"
                    onClick={() => {
                      handleMenuClose();
                      navigate("/editcard");
                    }}
                  >
                    카드 관리
                  </p>
                  <div className="haeder-Menu-empty-line"></div>

                  <p
                    className="header-Menu-container-list header-Menu-item-with-icon"
                    onClick={() => {
                      if (deferredPrompt) {
                        handleInstallAccept();
                      } else {
                        alert("새로고침 후 다시 시도해주세요");
                      }
                      handleMenuClose();
                    }}
                  >
                    <span>앱 설치</span>
                    <MdDownload
                      size={"17px"}
                      style={{ transform: "translateY(2px)" }}
                    />
                    {/* <img src={installIconUrl} alt="install icon" /> */}
                  </p>
                  <div className="haeder-Menu-empty-line"></div>
                  <p
                    className="header-Menu-container-list"
                    onClick={() => {
                      // 튜토리얼 시작 명령을 먼저 예약
                      setTimeout(() => {
                        dispatch(setTutorialVisible(true));
                      }, 300); // 충분한 지연 시간

                      navigate("/"); // 메인 페이지로 이동
                      handleMenuClose(); // 메뉴 닫기
                    }}
                  >
                    사용 가이드
                  </p>
                  <p
                    className="header-Menu-container-list"
                    onClick={() => {
                      handleMenuClose();
                      navigate("/introduce");
                    }}
                  >
                    사이트 소개
                  </p>
                </div>

                {/*  최하단 영역 */}
                <div className="header-Menu-container-bottom">
                  <p className="header-Menu-container-ver">대구맑음 ver. 1.0</p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HeaderMenu;
