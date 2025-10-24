import "./Card03.css";
import { useRef, useState, useEffect } from "react";
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
  } = useSelector(state => state.currentAirCondition);
  const loading = useSelector(state => state.currentAirCondition.loading);
  const error = useSelector(state => state.currentAirCondition.error);

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
      'good': <LogoGood animated style={{ margin: "10px" }} />,
      'moderate': <LogoModerate animated style={{ margin: "10px" }} />,
      'bad': <LogoBad animated style={{ margin: "10px" }} />,
      'very-bad': <LogoVeryBad animated style={{ margin: "10px" }} />,
      'no-data': <LogoError animated style={{ margin: "10px" }} />,
      'special': <LogoError animated style={{ margin: "10px" }} />,
    };
    return icons[grade] || <LogoError animated style={{ margin: "10px" }} />;
  };

  // ===== 대기질 항목 렌더링 함수 =====
  const renderAirQualityItem = (label, unit, value, type, flg) => {
    const info = getAirQualityInfo(value, type, flg);
    return (
      <div className="card03-result-item">
        <div className="card03-result-title-background">
          <p className="card03-font-b">{label}</p>
        </div>
        {
          value !== null && value !== undefined && Number(value) !== 0 ? (
            <span className="card03-margin-top card03-margin-bottom card03-font-small-12-gray">
              {value}{type.startsWith('PM') ? ' ㎍/㎥' : ' ppm'}
            </span>
          ) : (
            '-'
          )
        }
        <div className="card03-icon-wrapper">{getAirQualityIcon(info.grade)}</div>
        <div className={`card06-result-grade-background card06-grade-color-${info.grade}`}>
          <p className="card03-result-info card03-margin-bottom">{info.text}</p>
        </div>
      </div>
    );
  };


  // ===== 드래그 끝났을 때 ===============
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // console.log('🎯 드래그 끝:', { page, offset, velocity });

    // 빠른 스와이프 또는 충분한 거리
    if (Math.abs(velocity) > 500 || Math.abs(offset) > 100) {
      if (offset < 0 && page < totalPages - 1) {
        setPage(page + 1);
        // console.log('→ 다음 페이지');
      } else if (offset > 0 && page > 0) {
        setPage(page - 1);
        // console.log('← 이전 페이지');
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
        <p className="card03-title-sub card03-font-small-12-gray">{dataTime} {measuringStation} 측정소</p>
          
          {/* 정보 출력 영역 */}
          <div className="card03-swipe-wrapper" ref={containerRef}>
          { measuringStation
          ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={page}
                className="card03-swipe-page"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0.9, x: page > 0 ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0.9, x: page > 0 ? -30 : 30 }}
                transition={{
                  type: "tween",
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {page === 0 ? (
                  <>
                    {renderAirQualityItem('미세먼지', 'PM-10', currentPM10, 'PM10', pm10Flag)}
                    {renderAirQualityItem('초미세먼지', 'PM-2.5', currentPM25, 'PM25', pm25Flag)}
                    {renderAirQualityItem('오존', 'O₃', currentO3, 'O3', o3Flag)}
                  </>
                ) : (
                  <>
                    {renderAirQualityItem('이산화질소', 'NO₂', currentNO2, 'NO2', no2Flag)}
                    {renderAirQualityItem('일산화탄소', 'CO', currentCO, 'CO', coFlag)}
                    {renderAirQualityItem('아황산가스', 'SO₂', currentSO2, 'SO2', so2Flag)}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="card03-swipe-container-no-station">
              <p> 측정소 정보가 없습니다. </p>
            </div>
          )}
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