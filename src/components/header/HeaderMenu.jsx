import "./HeaderMenu.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { PWAInstallContext } from "../../contexts/PWAInstallContext.jsx";
import installIconUrl from "../../assets/icons/install_icon.svg";

import { setMenuFlg, setSearchFlg } from "../../store/slices/headerSlice.js";

function HeaderMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deferredPrompt, handleInstallAccept } = useContext(PWAInstallContext);

  // ===== 전역 State =====
  const menuFlg = useSelector((state) => state.headerSlice.menuFlg);

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
                <p
                  className="header-Menu-container-list"
                  onClick={() => {
                    handleMenuClose();
                    navigate("/apptutorial");
                  }}
                >
                  사용 가이드
                </p>
                <p
                  className="header-Menu-container-list header-Menu-item-with-icon"
                  onClick={() => {
                    if (deferredPrompt) {
                      handleInstallAccept();
                    } else {
                      alert(
                        "앱이 이미 설치되어 있거나, 설치를 지원하지 않는 환경입니다."
                      );
                    }
                    handleMenuClose();
                  }}
                >
                  <span>앱 설치</span>
                  <img src={installIconUrl} alt="install icon" />
                </p>
                <p
                  className="header-Menu-container-list"
                  onClick={() => {
                    handleMenuClose();
                    navigate("/introduce");
                  }}
                >
                  About
                </p>
              </div>
              <div className="header-Menu-container-bottom">
                <p className="header-Menu-container-ver">대구맑음 ver. 1.0</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HeaderMenu;
