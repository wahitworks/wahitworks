import "./Main.css";
import { useSelector } from "react-redux";

// 카드 컴포넌트 임포트
// 카드 추가시 추가 임포트및 cardList, defaultCardListOrderArray에 추가 필요.
import Card01 from "../cards/Card01.jsx";
import Card02 from "../cards/Card02.jsx";
import Card03 from "../cards/Card03.jsx";
import Card04 from "../cards/Card04.jsx";
import { useNavigate } from "react-router-dom";
import LogoOrigin from "../logo/LogoOrigin.jsx";

// 카드 id와 실제 컴포넌트를 짝지어주는 목록
const cardList = {
  card01: Card01,
  card02: Card02,
  card03: Card03,
  card04: Card04,
};

function Main() {
  // 카드 순서 가져오기
  // 저장값 있을 시: 저장값 출력
  // 없을시 : DEFAULT_ORDER 적용
  const order = useSelector((state) => state.cardOrder.order);
  const navigate = useNavigate();

  // card12클릭시 EditCard 페이지로 이동
  const Navigate = () => {
    navigate(`/editcard`);
  };

  return (
    <>
      <div id="main-container">
        {/* 전체 카드 목록을 순회 */}
        {order.map((cardInfo) => {
          // card.checked가 true인 카드 출력
          if (!cardInfo.checked) {
            return null; // checked가 false이면 아무것도 출력 안함
          }
          // cardInfo.id에 맞는 컴포넌트를 찾습니다.
          const CardComponent = cardList[cardInfo.id];
          // 기존 로직과 동일하게 컴포넌트 렌더링
          return CardComponent ? <CardComponent key={cardInfo.id} /> : null;
        })}
      </div>
      {/* card12 EditCard 페이지로 이동 */}
      <div className="main-add-card-container" onClick={Navigate}>
        <div className="main-add-card">
          <p className="main-add-card-comment">
            + <br />
            카드를 추가해 보세요!
            </p>
        </div>
      </div>
    </>
  );
}

export default Main;
