import "./Main.css";
import { useSelector } from "react-redux";

// 카드 컴포넌트 임포트
// 카드 추가시 추가 임포트및 cardList, defaultCardListOrderArray에 추가 필요.
import Card01 from "../cards/Card01.jsx";
import Card02 from "../cards/Card02.jsx";
import Card03 from "../cards/Card03.jsx";
import Card04 from "../cards/Card04.jsx";

function Main() {
  // 카드 순서 가져오기
  // 저장값 있을 시: 저장값 출력
  // 없을시 : DEFAULT_ORDER 적용
  const order = useSelector((state) => state.cardOrder.order);

  // 테스트용 카드 컴포넌트 배열 추후 card 완성 시 교체
  const cardList = [
    { no: 1, component: Card01 },
    { no: 2, component: Card02 },
    { no: 3, component: Card03 },
    { no: 4, component: Card04 },
  ];

  return (
    <>
      <div id="main-container">
        {/* 저장된 카드 순서 || DEFAULT_ORDER [1, 2, 3, 4] 출력 */}
        {order.map((no) => {
          // 번호에 맞는 카드 찾기
          const target = cardList.find((item) => item.no === no);
          // target 변수로 받은 컴포넌트 JSX로 렌더링
          return <target.component key={target.no} />;
        })}
      </div>
    </>
  );
}

export default Main;
