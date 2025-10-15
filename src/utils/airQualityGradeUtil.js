// =====================================
// ||     등급 판정 함수
// =====================================

// 등급 기준 (환경부 기준)
const AIR_QUALITY_STANDARDS = {
  PM10: { good: 30, moderate: 80, bad: 150 },
  PM25: { good: 15, moderate: 35, bad: 75 },
  O3: { good: 0.030, moderate: 0.090, bad: 0.150 },
  NO2: { good: 0.030, moderate: 0.060, bad: 0.200 },
  CO: { good: 2.0, moderate: 9.0, bad: 15.0 },
  SO2: { good: 0.020, moderate: 0.050, bad: 0.150 },
};

// 등급 판정
export const getAirQualityGrade = (value, type) => {
  // type: 'PM10', 'PM25', 'O3', 'NO2', 'CO', 'SO2'

  // 데이터가 없을 경우 처리
  if (value === null || value === undefined || value === '' || value === '-' || value === 0) {
    return 'no-data';
  }

  // 타입별로 기준 자동 선택
  const standard = AIR_QUALITY_STANDARDS[type];
  
  // type이 잘못되었을 때도 no-data
  if (!standard) {
    return 'no-data';
  }

  // 기준에 맞춰서 단계 반환
  if (value <= standard.good) return 'good';
  if (value <= standard.moderate) return 'moderate';
  if (value <= standard.bad) return 'bad';
  return 'very-bad';
};

// 등급 텍스트
export const getAirQualityGradeKo = (grade) => {
  const texts = {
    'good': '좋음',
    'moderate': '보통',
    'bad': '나쁨',
    'very-bad': '매우나쁨',
    'no-data': '데이터 없음',
  };
  return texts[grade] || '데이터 없음';
};
