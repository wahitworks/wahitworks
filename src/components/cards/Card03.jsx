import "./Card03.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoDot } from "react-icons/go";
import { GoDotFill } from "react-icons/go";

import LogoGood from '../logo/LogoGood.jsx';
import LogoModerate from '../logo/LogoModerate.jsx';
import LogoBad from '../logo/LogoBad.jsx';
import LogoVeryBad from '../logo/LogoVeryBad.jsx';

import { getCurrentAirCondition } from "../../store/thunks/currentAirConditionThunk.js";

function Card03() {
  const dispatch = useDispatch();

  // ===== 전역 state =====
  const currentPM10 = useSelector(state => state.currentAirCondition.currentPM10)
  const currentPM25 = useSelector(state => state.currentAirCondition.currentPM25)
  const currentO3 = useSelector(state => state.currentAirCondition.currentO3)
  const currentNO2 = useSelector(state => state.currentAirCondition.currentNO2)
  const currentCO = useSelector(state => state.currentAirCondition.currentCO)
  const currentSO2 = useSelector(state => state.currentAirCondition.currentSO2)
  const dataTime = useSelector(state => state.currentAirCondition.dataTime);

  const loading = useSelector(state => state.currentAirCondition.loading);

  const measuringStation = useSelector(state => state.locationSlice.measuringStation);

  // ===== 컴포넌트 State ==========
  const [page, setPage] = useState(0);

  // ===== 랜더링 필요없는 Ref ============
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  //
  const handleScroll = () => {
    if(!containerRef.current) return;
    // 현재 스크롤 위치
    const scrollLeft = containerRef.current.scrollLeft;
    // 컨테이너 너비
    const containerWidth = containerRef.current.offsetWidth;
    // 현재 페이지 (반올림)
    const currentPage = Math.round(scrollLeft/containerWidth);

    setPage(currentPage);
    console.log(currentPage);
  }

  useEffect(() => {
    // =====================================
    // ||     측정소 값이 없을 경우 -> 종료
    // =====================================
    if(!measuringStation) {
      // console.log('아직 측정소 저장 안됨!');
      return;
    }

    dispatch(getCurrentAirCondition(measuringStation));

  }, [measuringStation])

  return (
    <>
      <div className="card03-container">
        <h1 className="card03-title">지금 대기 상태</h1>
        <p className="card03-title-sub card03-font-small">{dataTime} 측정</p>

          { measuringStation 
          ? <div className="card03-swipe-container"
              ref={containerRef} onScroll={handleScroll}
            >
              <div className="card03-swipe-page">
                <div className="card03-result-item">
                  <p className="card03-font-b">미세먼지</p>
                  <p className="card03-font-small">PM-10</p>
                  <p className="card03-font-b">{currentPM10}㎍/㎥</p>
                  <LogoGood animated style={{ margin: '10px' }} />
                  <p className="card03-font-b">좋음</p>
                </div>
                <div className="card03-result-item">
                  <p className="card03-font-b">초미세먼지</p>
                  <p className="card03-font-small">PM-2.5</p>
                  <p className="card03-font-b">{currentPM25}㎍/㎥</p>
                  <LogoModerate animated style={{ margin: '10px' }} />
                  <p className="card03-font-b">좋음</p>
                </div>
                <div className="card03-result-item">
                  <p className="card03-font-b">오존</p>
                  <p className="card03-font-small">O₃</p>
                  <p className="card03-font-b">{currentO3}ppm</p>
                  <LogoBad animated style={{ margin: '10px' }} />
                  <p className="card03-font-b">보통</p>
                </div>
              </div>
              <div className="card03-swipe-page">
                <div className="card03-result-item">
                  <p className="card03-font-b">이산화질소</p>
                  <p className="card03-font-small">NO₂</p>
                  <p className="card03-font-b">{currentNO2}ppm</p>
                  <LogoVeryBad animated style={{ margin: '10px' }} />
                  <p className="card03-font-b">보통</p>
                </div>
                <div className="card03-result-item">
                  <p className="card03-font-b">일산화탄소</p>
                  <p className="card03-font-small">CO</p>
                  <p className="card03-font-b">{currentCO}ppm</p>
                  <LogoVeryBad animated style={{ margin: '10px' }} />
                  <p className="card03-font-b">보통</p>
                </div>
                <div className="card03-result-item">
                  <p className="card03-font-b">아황산가스</p>
                  <p className="card03-font-small">SO₂</p>
                  <p className="card03-font-b">{currentSO2}ppm</p>
                  <LogoVeryBad animated style={{ margin: '10px' }} />
                  <p className="card03-font-b">보통</p>
                </div>
              </div>
            </div>
          : <div className="card03-swipe-container-no-station">
              <p> 측정소 정보가 없습니다. </p>
            </div>
          }
          <div className="card03-pagination-dots-container">
            {
              Array(2).fill(0).map((dot, index) => (
                <div className={`card03-pagination-dot card03-pagination-${index === page ? 'activate' : 'disabled'}`} key={index} >
                  ▪
                </div>
              ))
            }
          </div>
      </div>
    </>
  );
}
export default Card03;