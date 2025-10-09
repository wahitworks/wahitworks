// 측정소 정보 수제 데이터
export const MEASURING_STATIONS = [
  {
    id: 1,
    district: '동구',
    dong: '서호동',
    address: '동구 안심로49길 70(반야월초등학교 3층 옥상)',
    established: 2001,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 886280.0,      // 카카오 원본 (정확한 위치)
      y: 661951.0,
      lat: 35.897234,   // 변환한 값 (범용)
      lng: 128.721456,
    },
  },
  {
    id: 2,
    district: '동구',
    dong: '신암동',
    address: '동구 아양로 37길 92(신암5동 행정복지센터 3층 옥상)',
    established: 1997,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 868634.0,      // 카카오 원본 (정확한 위치)
      y: 667613.0,
      lat: 35.890497,   // 변환한 값 (범용)
      lng: 128.633018,
    },
  },
  {
    id: 3,
    district: '서구',
    dong: '내당동',
    address: '서구 서대구로3길 46(내당4동 행정복지센터 3층 옥상)',
    established: 2020,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 850410.0,      // 카카오 원본 (정확한 위치)
      y: 658775.0,
      lat: 35.859382,   // 변환한 값 (범용)
      lng: 128.551872,
    },
  },
  {
    id: 4,
    district: '서구',
    dong: '이현동',
    address: '서구 국채보상로 135(중리초등학교 4층 옥상)',
    established: 2003,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂', '중금속'],
    coordinates: {
      x: 848938.0,      // 카카오 원본 (정확한 위치)
      y: 661731.0,
      lat: 35.869652,   // 변환한 값 (범용)
      lng: 128.545276,
    },
  },
  {
    id: 5,
    district: '남구',
    dong: '대명동',
    address: '남구 성당로30길55(성명초등학교 별관 3층 옥상)',
    established: 1981,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂', '중금속'],
    coordinates: {
      x: 854830.0,      // 카카오 원본 (정확한 위치)
      y: 655110.0,
      lat: 35.845638,   // 변환한 값 (범용)
      lng: 128.571036,
    },
  },
  {
    id: 6,
    district: '북구',
    dong: '산격동',
    address: '북구 연암로 40(서성 산격청사 105동 3층 옥상)',
    established: 2020,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 861274.0,      // 카카오 원본 (정확한 위치)
      y: 668247.0,
      lat: 35.892515,   // 변환한 값 (범용)
      lng: 128.600434,
    },
  },
  {
    id: 7,
    district: '북구',
    dong: '침산동',
    address: '북구 옥산로17길 21(대구일중학교)',
    established: 2000,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 857809.0,      // 카카오 원본 (정확한 위치)
      y: 666736.0,
      lat: 35.886147,   // 변환한 값 (범용)
      lng: 128.584973,
    },
  },
  {
    id: 8,
    district: '북구',
    dong: '태전동',
    address: '북구 칠곡중앙대로 52길 56(태암초등학교 남관 4층 옥상)',
    established: 2003,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 849852.0,      // 카카오 원본 (정확한 위치)
      y: 676522.0,
      lat: 35.923092,   // 변환한 값 (범용)
      lng: 128.550355,
    },
  },
  {
    id: 9,
    district: '중구',
    dong: '남산1동',
    address: '중구 남산로2길 125(명덕초등학교 3층 옥상)',
    established: 2021,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 858839.0,      // 카카오 원본 (정확한 위치)
      y: 658509.0,
      lat: 35.857907,   // 변환한 값 (범용)
      lng: 128.589486,
    },
  },
  {
    id: 10,
    district: '중구',
    dong: '수창동',
    address: '중구 달성로 22길 30(수창초등학교 4층 옥상)',
    established: 1999,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂', '중금속'],
    coordinates: {
      x: 857661.0,      // 카카오 원본 (정확한 위치)
      y: 663073.0,
      lat: 35.874287,   // 변환한 값 (범용)
      lng: 128.584137,
    },
  },
  {
    id: 11,
    district: '수성구',
    dong: '만촌동',
    address: '수성구 국채보상로 1000(동원초등학교 3층 옥상)',
    established: 1995,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 870343.0,      // 카카오 원본 (정확한 위치)
      y: 660751.0,
      lat: 35.865480,   // 변환한 값 (범용)
      lng: 128.639647,
    },
  },
  {
    id: 12,
    district: '수성구',
    dong: '시지동',
    address: '수성구 노변공원로 52(노변초등학교 4층 옥상)',
    established: 2017,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 883471.0,      // 카카오 원본 (정확한 위치)
      y: 653397.0,
      lat: 35.837625,   // 변환한 값 (범용)
      lng: 128.697569,
    },
  },
  {
    id: 13,
    district: '수성구',
    dong: '지산동',
    address: '수성구 무학로 209(한국환경공단 대구경북지역본부 3층 옥상)',
    established: 1999,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂', '중금속'],
    coordinates: {
      x: 868566.0,      // 카카오 원본 (정확한 위치)
      y: 651163.0,
      lat: 35.830474,   // 변환한 값 (범용)
      lng: 128.631560,
    },
  },
  {
    id: 14,
    district: '달서구',
    dong: '본동',
    address: '달서구 구마로26길 62(본동행정복지센터 2층 옥상)',
    established: 2019,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 848108.0,      // 카카오 원본 (정확한 위치)
      y: 651923.0,
      lat: 35.834449,   // 변환한 값 (범용)
      lng: 128.541085,
    },
  },
  {
    id: 15,
    district: '달서구',
    dong: '진천동',
    address: '달서구 월배로 131(월배초등학교 3층 옥상)',
    established: 2017,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 845357.0,      // 카카오 원본 (정확한 위치)
      y: 646904.0,
      lat: 35.816557,   // 변환한 값 (범용)
      lng: 128.528451,
    },
  },
  {
    id: 16,
    district: '달서구',
    dong: '호림동',
    address: '달서구 성서공단로 11길 32(대구기계부품연구원 1동 2층 옥상)',
    established: 2014,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 836277.0,      // 카카오 원본 (정확한 위치)
      y: 652622.0,
      lat: 35.837604,   // 변환한 값 (범용)
      lng: 128.488764,
    },
  },
  {
    id: 17,
    district: '달성군',
    dong: '유가읍',
    stationName: '유가읍',
    address: '달성군 유가읍 태그노북로6길 20(비슬공원)',
    established: 2003,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 830527.0,      // 카카오 원본 (정확한 위치)
      y: 613053.0,
      lat: 35.695306,   // 변환한 값 (범용)
      lng: 128.459260,
    },
  },
  {
    id: 18,
    district: '달성군',
    dong: '다사읍',
    address: '달성군 다사읍 매곡로12길 37(다사읍주민자치센터 3층 옥상)',
    established: 2018,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 829061.0,      // 카카오 원본 (정확한 위치)
      y: 660062.0,
      lat: 35.864912,   // 변환한 값 (범용)
      lng: 128.457162,
    },
  },
  {
    id: 19,
    district: '달성군',
    dong: '화원읍',
    stationName: '화원읍',
    address: '달성군 화원읍 인흥1길 12(화원명곡체육공원)',
    established: 2020,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 839802.0,      // 카카오 원본 (정확한 위치)
      y: 641600.0,
      lat: 35.797435,   // 변환한 값 (범용)
      lng: 128.503780,
    },
  },
  {
    id: 20,
    district: '군위군',
    dong: '군위읍',
    address: '군위군 군위읍 군청로 158(군위종합테니스장 옥상)',
    established: 2020,
    measures: ['PM-10', 'PM-2.5', 'O₃', 'NO₂', 'CO', 'SO₂'],
    coordinates: {
      x: 853745.0,      // 카카오 원본 (정확한 위치)
      y: 763927.0,
      lat: 36.237281,   // 변환한 값 (범용)
      lng: 128.574411,
    },
  },
];