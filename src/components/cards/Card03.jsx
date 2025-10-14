import "./Card03.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import LogoGood from '../commons/LogoGood.jsx';
import LogoModerate from '../commons/LogoModerate.jsx';
import LogoBad from '../commons/LogoBad.jsx';
import LogoVeryBad from '../commons/LogoVeryBad.jsx';

import { getCurrentAirCondition } from "../../store/thunks/currentAirConditionThunk.js";
import { p } from "framer-motion/client";

function Card03() {
  const dispatch = useDispatch();

  const currentPM10 = useSelector(state => state.currentAirCondition.currentPM10)
  const currentPM25 = useSelector(state => state.currentAirCondition.currentPM25)
  const currentO3 = useSelector(state => state.currentAirCondition.currentO3)
  const currentNO2 = useSelector(state => state.currentAirCondition.currentNO2)
  const currentCO = useSelector(state => state.currentAirCondition.currentCO)
  const currentSO2 = useSelector(state => state.currentAirCondition.currentSO2)
  const dataTime = useSelector(state => state.currentAirCondition.dataTime);

  const loading = useSelector(state => state.currentAirCondition.loading);

  const measuringStation = useSelector(state => state.locationSlice.measuringStation);

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
        <div className="card03-result-cotainer">

          { measuringStation 
          ? <div className="card03-swipe-container">
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
          : <p> 측정소 정보가 없습니다. </p>
          }
        </div>
      </div>
    </>
  );
}
export default Card03;