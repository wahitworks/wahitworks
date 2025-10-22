import "./Card05.css";
import { useState } from "react";
// import InfoTooltip from "../commons/InfoTooltip.jsx";

// 1. 부모 컴포넌트 - 탭 + 범례 표시
function Card05() {

  const [selectedPollutant, setSelectedPollutant] = useState('PM10');

  // 2. 탭 메뉴 데이터 (한눈에 보이게!)
  const tabs = [
    { id: 'PM10', label: '미세먼지' },
    { id: 'PM25', label: '초미세먼지' },
    { id: 'O3', label: '오존' },
    { id: 'CO', label: '일산화탄소' },
    { id: 'NO2', label: '이산화질소' },
    { id: 'SO2', label: '아황산가스' }
  ];

  // 3. 각 오염물질별 등급 기준 데이터
  const gradeStandard = {
    PM10: [
      { grade: '좋음', range: '0~30', color: 'var(--personal-blue)', unit: 'μg/m³' },
      { grade: '보통', range: '31~80', color: 'var(--mint)', unit: 'μg/m³' },
      { grade: '나쁨', range: '81~150', color: 'var(--yellow)', unit: 'μg/m³' },
      { grade: '매우나쁨', range: '151+', color: 'var(--red)', unit: 'μg/m³' }
    ],
    PM25: [
      { grade: '좋음', range: '0~15', color: 'var(--personal-blue)', unit: 'μg/m³' },
      { grade: '보통', range: '16~35', color: 'var(--mint)', unit: 'μg/m³' },
      { grade: '나쁨', range: '36~75', color: 'var(--yellow)', unit: 'μg/m³' },
      { grade: '매우나쁨', range: '76+', color: 'var(--red)', unit: 'μg/m³' }
    ],
    O3: [
      { grade: '좋음', range: '0~0.030', color: 'var(--personal-blue)', unit: 'ppm' },
      { grade: '보통', range: '0.031~0.090', color: 'var(--mint)', unit: 'ppm' },
      { grade: '나쁨', range: '0.091~0.150', color: 'var(--yellow)', unit: 'ppm' },
      { grade: '매우나쁨', range: '0.151+', color: 'var(--red)', unit: 'ppm' }
    ],
    CO: [
      { grade: '좋음', range: '0~2.0', color: 'var(--personal-blue)', unit: 'ppm' },
      { grade: '보통', range: '2.1~9.0', color: 'var(--mint)', unit: 'ppm' },
      { grade: '나쁨', range: '9.1~15.0', color: 'var(--yellow)', unit: 'ppm' },
      { grade: '매우나쁨', range: '15.1+', color: 'var(--red)', unit: 'ppm' }
    ],
    NO2: [
      { grade: '좋음', range: '0~0.030', color: 'var(--personal-blue)', unit: 'ppm' },
      { grade: '보통', range: '0.031~0.060', color: 'var(--mint)', unit: 'ppm' },
      { grade: '나쁨', range: '0.061~0.200', color: 'var(--yellow)', unit: 'ppm' },
      { grade: '매우나쁨', range: '0.201+', color: 'var(--red)', unit: 'ppm' }
    ],
    SO2: [
      { grade: '좋음', range: '0~0.020', color: 'var(--personal-blue)', unit: 'ppm' },
      { grade: '보통', range: '0.021~0.050', color: 'var(--mint)', unit: 'ppm' },
      { grade: '나쁨', range: '0.051~0.150', color: 'var(--yellow)', unit: 'ppm' },
      { grade: '매우나쁨', range: '0.151+', color: 'var(--red)', unit: 'ppm' }
    ]
  };

  return (
    <>
      <div className="card05-container">
        <div className="card05-title-box">
          <h2 className="card05-title">대기질 등급 기준</h2>
          {/* <InfoTooltip message={'환경정책기본법시행령[2015.1.1 시행] 환경기준(제2조 관련)'}
            width="100%"
            top="4%"
          /> */}
        </div>
        {/* 4. 탭 메뉴 */}
        <div className="card05-tab-menu">
          {tabs.map(tab => (
            <button
            key={tab.id}
            // 5. 선택된 탭은 'active' 클래스 추가
            className={`card05-tab-button ${selectedPollutant === tab.id ? 'card05-active' : ''}`}
            onClick={() => setSelectedPollutant(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 6. 선택된 탭의 등급 카드들 출력 */}
        <div className="card05-grade-container">
          {gradeStandard[selectedPollutant].map((gradeInfo, index) => (
            <Card05Grade
            key={index}
            grade={gradeInfo.grade}
            range={gradeInfo.range}
            color={gradeInfo.color}
            unit={gradeInfo.unit}
            />
          ))}
        </div>
        <p className="card05-source-info">환경정책기본법시행령[2015.1.1 시행] 환경기준(제2조 관련)</p>
      </div>
    </>
  );
}
export default Card05;

// 7. 자식 컴포넌트 - 등급 카드
function Card05Grade({ grade, range, color, unit }) {
  return (
    <>
      <div className="card05-grade-items">
        <div
          className="card05-grade-color"
          style={{ backgroundColor: color }}
        />
        <p className="card05-grade-item-title">{grade}</p>
        <p className="card05-grade-item-range">{range} {unit}</p>
      </div>
    </>
  );
}