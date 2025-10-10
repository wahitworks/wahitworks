import Logo from "../commons/Logo";
import "./Main.css";
import Topbtn from "../topBtn/topBtn";

// 카드 컴포넌트 임포트
// 카드 추가시 추가 임포트및 cardList, defaultCardListOrderArray에 추가 필요.
import Card01 from "../cards/Card01.jsx";
import Card02 from "../cards/Card02.jsx";
import Card03 from "../cards/Card03.jsx";
import Card04 from "../cards/Card04.jsx";

function Main() {
  // 테스트용 카드 컴포넌트 배열 추후 card 완성 시 교체
  const cardList = [
    { no: 1, component: Card01 },
    { no: 2, component: Card02 },
    { no: 3, component: Card03 },
    { no: 4, component: Card04 },
  ];

  // 기본 템플릿 순서 (요소의 번호와 cardList의 no가 일치하는 순서대로 출력할 예정)
  // 현재 테스트이기 때문에 번호를 일부러 뒤죽박죽 해놓은 상태임.
  const defaultCardListOrderArray = [2, 3, 1, 4];

  return (
    <>
      <div id="main-container">
        {/* 기본 템플릿 순서 */}
        {defaultCardListOrderArray.map((no) => {
          //지정해둔 기본 템플릿 순서와 맞는 컴포넌트 출력
          const target = cardList.find((item) => item.no === no);
          // 기존에 <'Component /> 방식과 다름
          // target 변수안에 있는 component를 출력하는 방식으로 대체
          return <target.component key={target.no} />;
        })}
      </div>
    </>
  );
}

export default Main;
