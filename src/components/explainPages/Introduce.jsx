import LogoOrigin from "../logo/LogoOrigin.jsx";
import "./Introduce.css";
import logoTitle from "../../assets/logos/logo-title-200.svg";
import { motion } from "framer-motion";

function Introduce () {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="introduce-container">
        {/* <h1 className="introduce-info">인사말</h1>
        <p className="introduce-content-title">
        대구의 실시간 대기정보 서비스를 제공하는 <span className="introduse-app-title">대구맑음</span>입니다!<br />
        대구의 맑은 공기와 함께 이용자 맞춤 서비스를 제공하며 건강한 하루를 보내기를 바라는 마음을 담았습니다.
        </p>
        <div className="introduce-logo-container">
          <LogoOrigin animated className="introduce-logo" />
          <div className="introduce-logo-title" style={{ backgroundImage: `url(${logoTitle})` }}></div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <div className="introduce-content">
          <p className="introduce-content-title">주요 기능</p>
          <p> - 실시간 대기정보</p>
          <p> - 오늘의 행동요령</p>
          <p> - 내 장소 즐겨찾기</p>
          <p> - 카드 편집기능</p>
        </div>
        <p className="introduce-content-title">즐겨찾기를 통해 내 장소를 관리하고 내가 카드의 추가 및 삭제, 순서를 바꾸며 여러분들만의 맞춤 앱을 만들어 보세요!</p> */}


        {/* <h1 className="introduce-info">인사말</h1> */}
        <div className="introduce-logo-container introduce-logo-flex">
          <div className="introduce-logo-forflex">
          <LogoOrigin animated />
          </div>
          <div className="introduce-logo-title-forflex" style={{ backgroundImage: `url(${logoTitle})` }}></div>
        </div>
        <p className="introduce-font-bold introduce-font-line">
          <span className="introduce-color-persnalblue">대구의 실시간 대기정보 서비스</span>
        를<br /> 제공하는 <span className="introduce-color-persnalblue">대구맑음</span>입니다!<br /><br />
        대구의 맑은 공기와 함께<br /> 이용자 맞춤 서비스를 제공하며<br /> 건강한 하루를 보내기를 바라는 마음을 담았습니다.
        </p>
        <div className="introduce-content introduce-font-bold">
          <p className="introduce-content-title introduce-color-deepblue">주요 기능</p>
          <p> - 실시간 대기정보</p>
          <p> - 대기정보 3일 예보</p>
          <p> - 오늘의 행동요령</p>
          <p> - 장소 즐겨찾기</p>
          <p> - 기능 카드 편집</p>
        </div>
        <div className="introduce-font-bold introduce-font-line">
          <p>자주 가는 곳을 즐겨찾고,<br /> 원하는 정보만 카드로 채워보세요.<br /><br /> 직접 카드를 편집하여<br /> 여러분들만의 맞춤 앱을 만들어 보세요!</p>
        </div>
      </div>
    </motion.div>
  )
};

export default Introduce;