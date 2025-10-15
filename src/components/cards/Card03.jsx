import "./Card03.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoDotFill } from "react-icons/go";
import { RiFileWarningLine } from "react-icons/ri";
import { motion, AnimatePresence } from 'framer-motion';

import LogoGood from '../logo/LogoGood.jsx';
import LogoModerate from '../logo/LogoModerate.jsx';
import LogoBad from '../logo/LogoBad.jsx';
import LogoVeryBad from '../logo/LogoVeryBad.jsx';
import LogoError from "../logo/LogoError.jsx";

import { getCurrentAirCondition } from "../../store/thunks/currentAirConditionThunk.js";
import { getAirQualityGrade, getAirQualityGradeKo } from "../../utils/airQualityGradeUtil.js";

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

  // ===== 컴포넌트 State ================
  const [page, setPage] = useState(0);
  const totalPages = 2;

  // ===== 랜더링 필요없는 Ref ============
  const containerRef = useRef(null);


  // ===== 등급에 맞는 아이콘 컴포넌트 반환 =====
  const getAirQualityIcon = (grade) => {
    const icons = {
      'good': <LogoGood animated />,
      'moderate': <LogoModerate animated />,
      'bad': <LogoBad animated />,
      'very-bad': <LogoVeryBad animated />,
      'no-data' : <LogoError animated />,
    };
    return icons[grade] || <LogoGood animated />;
  };

  // ===== 대기질 항목 렌더링 함수 =====
  const renderAirQualityItem = (label, unit, value, type) => {
    const grade = getAirQualityGrade(value, type);
    // console.log('value:', value);
    // console.log('typeof value:', typeof value);
    // console.log('value === 0:', value === 0);
    // console.log('value === "0":', value === "0");
    // console.log('Number(value):', Number(value));
    return (
      <div className="card03-result-item">
        <p className="card03-font-b">{label}</p>
        <p className="card03-font-small-gray card03-margin-bottom">{unit}</p>
        { value !== null && value !== undefined && Number(value) !== 0 ? <p className="card03-font-b card03-margin-bottom card03-font-small">{value}{type.startsWith('PM') ? '㎍/㎥' : 'ppm'}</p> : null}
        <div className="card03-icon-wrapper">{getAirQualityIcon(grade)}</div>
        <p className="card03-font-b card03-margin-top">{getAirQualityGradeKo(grade)}</p>
      </div>
    );
  };


  // ===== 드래그 끝났을 때 ===============
  const handleDragEnd = (event, info) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const offset = info.offset.x; // 드래그한 거리
    const velocity = info.velocity.x; // 드래그 속도
    
    // 빠르게 드래그하면 페이지 넘김
    if (Math.abs(velocity) > 500) {
      if (velocity < 0 && page < totalPages - 1) {
        setPage(page + 1); // 왼쪽으로 빠르게 → 다음 페이지
      } else if (velocity > 0 && page > 0) {
        setPage(page - 1); // 오른쪽으로 빠르게 → 이전 페이지
      }
    }
    // 절반 이상 드래그하면 페이지 넘김
    else if (Math.abs(offset) > containerWidth / 3) {
      if (offset < 0 && page < totalPages - 1) {
        setPage(page + 1); // 왼쪽으로 드래그
      } else if (offset > 0 && page > 0) {
        setPage(page - 1); // 오른쪽으로 드래그
      }
    }
  };


  useEffect(() => {
    // =====================================
    // ||     측정소 값이 없을 경우 -> 종료
    // =====================================
    if(!measuringStation) {
      // console.log('아직 측정소 저장 안됨!');
      return;
    }
    
    // =====================================
    // ||     측정소 값이 있을 경우 -> api 받아오기
    // =====================================
    dispatch(getCurrentAirCondition(measuringStation));

  }, [measuringStation])

  return (
    <>
      <div className="card03-container">
        <h1 className="card03-title">지금 대기 상태</h1>
        <p className="card03-title-sub card03-font-small-gray">{dataTime} 측정</p>
          
          {/* 정보 출력 영역 */}
          <div className="card03-swipe-wrapper">
          { measuringStation 
          ? <motion.div className="card03-swipe-container"
              ref={containerRef}
              drag = "x"
              dragConstraints={{ left: 0, right: 0 }} // 드래그 범위
              dragElastic={0.5}  // 탄성효과
              onDragEnd={handleDragEnd}
              animate={{
                x: -page * (containerRef.current?.offsetWidth || 0) // 페이지 전환 애니메이션
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <div className="card03-swipe-page">
                {renderAirQualityItem('미세먼지', 'PM-10', currentPM10, 'PM10')}
                {renderAirQualityItem('초미세먼지', 'PM-2.5', currentPM25, 'PM25')}
                {renderAirQualityItem('오존', 'O₃', currentO3, 'O3')}
              </div>
              <div className="card03-swipe-page">
                {renderAirQualityItem('이산화질소', 'NO₂', currentNO2, 'NO2')}
                {renderAirQualityItem('일산화탄소', 'CO', currentCO, 'CO')}
                {renderAirQualityItem('아황산가스', 'SO₂', currentSO2, 'SO2')}
              </div>
            </motion.div>
          : <div className="card03-swipe-container-no-station">
              <p> 측정소 정보가 없습니다. </p>
            </div>
          }
          </div>

          {/* 페이지 네이션 */}
          <div className="card03-pagination-dots-container">
            {
              Array(2).fill(0).map((_, index) => (
                <motion.div 
                  className={`card03-pagination-dot card03-pagination-${index === page ? 'activate' : 'disabled'}`} 
                  key={index}
                  onClick={() => setPage(index)}
                  whileTap={{ scale: 1.2 }}
                  style={{ cursor: 'pointer' }} 
                >
                  <GoDotFill />
                </motion.div>
              ))
            }
          </div>
      </div>
    </>
  );
}
export default Card03;