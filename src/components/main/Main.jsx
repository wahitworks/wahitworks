import "./Main.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

// 측정소별 현재 대기질 api 호출
import { getCurrentAirCondition } from "../../store/thunks/currentAirConditionThunk.js";
import useCard01_03Refresh from "../../hooks/useCard01_03Refresh.js";

// 카드 컴포넌트 임포트
// 카드 추가시 추가 임포트및 cardList, defaultCardListOrderArray에 추가 필요.
import CardWrapper from "../cards/CardWrapper.jsx"; // 메인 페이지에서 카드 삭제 기능용
import Card01 from "../cards/Card01.jsx";
import Card02 from "../cards/Card02.jsx";
import Card03 from "../cards/Card03.jsx";
import Card04 from "../cards/Card04.jsx";
import Card05 from "../cards/Card05.jsx";
import Card06 from "../cards/Card06.jsx";
import TestClick from "../commons/TestClick.jsx";

// 카드 id와 실제 컴포넌트를 짝지어주는 목록
const cardList = {
  card01: Card01,
  card02: Card02,
  card03: Card03,
  card04: Card04,
  card05: Card05,
  card06: Card06,
};

function Main() {
  // ===== Hook =====
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ===== 전역 state =====
    // 카드 순서 가져오기
    // 저장값 있을 시: 저장값 출력
    // 없을시 : DEFAULT_ORDER 적용
  const order = useSelector((state) => state.cardOrder.order);
  const measuringStation = useSelector(
    (state) => state.locationSlice.measuringStation
  );


  // =====================================
  // ||     측정소별 실시간 측정정보 조회 : CARD01, CARD03
  // =====================================
  useEffect(() => {
    // ===== 측정소 값, 없을 시 =====
    if (!measuringStation) {
      // console.log('아직 측정소 저장 안됨!');
      return;
    }

    // ===== 측정소 값, 있을 시 -> api 호출 =====
    dispatch(getCurrentAirCondition(measuringStation));
  }, [dispatch, measuringStation]);

  useCard01_03Refresh(measuringStation);

  // card12클릭시 EditCard 페이지로 이동
  const Navigate = () => {
    navigate(`/editcard`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div id="main-container">
        {/* ===== 테스트 컴포넌트 출력 ===== */}
        {/* <TestClick /> */}

        {/* 전체 카드 목록을 순회 */}
        {order.map((cardInfo) => {
          // card.checked가 true인 카드 출력
          if (!cardInfo.checked) {
            return null; // checked가 false이면 아무것도 출력 안함
          }
          // cardInfo.id에 맞는 컴포넌트를 찾습니다.
          const CardComponent = cardList[cardInfo.id];
          // CardWrapper로 감싸서 렌더링
          return CardComponent ? (
            <CardWrapper key={cardInfo.id} cardId={cardInfo.id}>
              <CardComponent />
            </CardWrapper>
          ) : null;
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
    </motion.div>
  );
}

export default Main;
