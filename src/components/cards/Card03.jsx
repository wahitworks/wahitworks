import "./Card03.css";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion';

import { GoDotFill } from "react-icons/go";

import LogoGood from '../logo/LogoGood.jsx';
import LogoModerate from '../logo/LogoModerate.jsx';
import LogoBad from '../logo/LogoBad.jsx';
import LogoVeryBad from '../logo/LogoVeryBad.jsx';
import LogoError from "../logo/LogoError.jsx";
import LoadingSkeleton from "../commons/LoadingSkeleton.jsx";

import { getAirQualityInfo } from "../../utils/airQualityGradeUtil.js";

function Card03() {

  // ===== 전역 state - 한 번에 가져오기 =====
  const {
    currentPM10,
    currentPM25,
    currentO3,
    currentNO2,
    currentCO,
    currentSO2,
    dataTime,
    pm10Flag,
    pm25Flag,
    o3Flag,
    no2Flag,
    coFlag,
    so2Flag,
    loading,
    error,
  } = useSelector(state => state.currentAirCondition);

  const measuringStation = useSelector(state => state.locationSlice.measuringStation);

  // ===== 로컬 State ================
  const [page, setPage] = useState(0);
  const totalPages = 2;
  
  // ===== 랜더링 필요없는 Ref ============
  const containerRef = useRef(null);
  
  //  console.log('Card03 렌더링:', { loading, dataTime, currentPM10 });
  
  // ===== 등급에 맞는 아이콘 컴포넌트 반환 =====
  const getAirQualityIcon = (grade) => {
    const icons = {
      'good': <LogoGood animated />,
      'moderate': <LogoModerate animated />,
      'bad': <LogoBad animated />,
      'very-bad': <LogoVeryBad animated />,
      'no-data': <LogoError animated />,
      'special': <LogoError animated />,
    };
    return icons[grade] || <LogoGood animated />;
  };
  
  // ===== 대기질 항목 렌더링 함수 =====
  const renderAirQualityItem = (label, unit, value, type, flg) => {
    const info = getAirQualityInfo(value, type, flg);
    // console.log('value:', value);
    // console.log('typeof value:', typeof value);
    // console.log('value === 0:', value === 0);
    // console.log('value === "0":', value === "0");
    // console.log('Number(value):', Number(value));
    // console.log('Flg: pm10Flag-', pm10Flag, 'pm25Flag-', pm25Flag, 'o3Flag-', o3Flag, 'no2Flag-', no2Flag, 'coFlag-', coFlag, 'so2Flag-', so2Flag);
    return (
      <div className="card03-result-item">
        <p className="card03-font-b">{label}</p>
        <p className="card03-font-small-gray card03-margin-bottom">{unit}</p>
        <p className="card03-font-b card03-margin-bottom card03-font-small">
          {
            value !== null && value !== undefined && Number(value) !== 0 ?
            `${value}${type.startsWith('PM') ? '㎍/㎥' : 'ppm'}` :
            '-'
          }
        </p>
        <div className="card03-icon-wrapper">{getAirQualityIcon(info.grade)}</div>
        <p className="card03-result-info card03-font-nowrap card03-font-b card03-margin-top">{info.text}</p>
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
    
  // ===== 로딩 스켈레톤 =====
  // loading 중이거나 아직 API 응답을 받지 않았으면 스켈레톤 표시 (단, 에러가 아닐 때만)
  if((loading || currentPM10 === 0 ) && !error) {
    return (
        <LoadingSkeleton
          width="90%"
          height="328px"
          borderRadius="15px"
          backgroundColor="#e6e9ecff"
          highlightColor="#f8f9fa"
          lines={[
            { width: '60%', height: '50px', align: 'center' },
            { width: '50%', height: '20px', align: 'center' },
            { width: '100%', height: '191px' },
            { width: '20%', height: '20px', align: 'center' },
          ]}
        />
    );
  }

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
                {renderAirQualityItem('미세먼지', 'PM-10', currentPM10, 'PM10', pm10Flag)}
                {renderAirQualityItem('초미세먼지', 'PM-2.5', currentPM25, 'PM25', pm25Flag)}
                {renderAirQualityItem('오존', 'O₃', currentO3, 'O3', o3Flag)}
              </div>
              <div className="card03-swipe-page">
                {renderAirQualityItem('이산화질소', 'NO₂', currentNO2, 'NO2', no2Flag)}
                {renderAirQualityItem('일산화탄소', 'CO', currentCO, 'CO', coFlag)}
                {renderAirQualityItem('아황산가스', 'SO₂', currentSO2, 'SO2', so2Flag)}
              </div>
            </motion.div>
          : <div className="card03-swipe-container-no-station">
              <p> 측정소 정보가 없습니다. </p>
            </div>
          }
          </div>

          {/* 페이지네이션 */}
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