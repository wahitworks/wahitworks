import Logo from "../logo/Logo.jsx";
import "./Introduce.css";
import logoTitle from "../../assets/logos/logo-title-200.svg";

function Introduce () {
  return (
    <>
      <div className="introduce-container">
        <h1 className="introduce-info">인사말</h1>
        <p className="introduce-content">대구의 실시간 대기정보 서비스를 제공하는 대구맑음입니다! 
        대구의 맑은 공기와 함께 이용자 맞춤 서비스를 제공하며 건강한 하루를 보내기를 바라는 마음을 담았습니다.
        </p>
        <div className="introduce-logo-container">
          <Logo animated className="introduce-logo"></Logo>
          <div className="introduce-logo-title" style={{ backgroundImage: `url(${logoTitle})` }}>
          </div>
        </div>
        <br />
        <p className="introduce-content">주요 기능</p>
        <p> - 실시간 대기정보</p>
        <p> - 행동 가이드? ? ?</p>
        <p> - 내 장소 즐겨찾기</p>
        <p> - 카드 편집기능</p>
        <p className="introduce-content">즐겨찾기를 통해 내 장소를 관리하고 내가 카드의 추가 및 삭제, 순서를 바꾸며 여러분들만의 맞춤 앱을 만들어 보세요!</p>
      </div>
    </>
  )
};

export default Introduce;