import { LOCALSTORAGE_KEYS } from "../constants/localStorageKeys.js";
import { CARD_ORDER_KEY } from "../constants/localStorageKeys.js";

export const localStorageUtil = {
  // ----------------------
  //   북마크 관련
  // ----------------------

  /**
   * 로컬스토리지에 북마크 지역 리스트 저장
   * @param {Array} data - bookmarked regions list
   */
  setBookmarkedRegions: (data) => {
    localStorage.setItem(
      LOCALSTORAGE_KEYS.BOOKMARKED_REGIONS,
      JSON.stringify(data)
    );
  },

  /**
   * 로컬스토리지에 저장된 북마크 지역 리스트 가져오기
   * @returns {Array} bookmarked regions list (없으면 빈 배열 반환)
   */
  getBookmarkedRegions: () => {
    const data = localStorage.getItem(LOCALSTORAGE_KEYS.BOOKMARKED_REGIONS);
    // null 체크: 데이터 없으면 빈 배열 반환
    return data ? JSON.parse(data) : [];
  },


  // ----------------------
  //   측정소 검색 관련
  // ----------------------

  /**
   * 위치 정보를 로컬스토리지에 저장
   * @param {Object} data
   * @param {Object} data.displayLocation - 위치 정보 { name, lat, lng, source }
   * @param {string} data.measuringStation - 측정소명
   */
  setLocationData: (data) => {
    const dataToSave = {
      displayLocation: data.displayLocation,
      measuringStation: data.measuringStation,
      timestamp: Date.now(), // 저장 시간 추가
    };
    localStorage.setItem('LOCATION_DATA', JSON.stringify(dataToSave));
  },

  /**
   * 저장된 위치 정보 가져오기
   * @returns {Object|null} - { displayLocation, measuringStation, timestamp } or null
   */
  getLocationData: () => {
    const data = localStorage.getItem('LOCATION_DATA');
    return data ? JSON.parse(data) : null;
  },

  /**
   * 저장된 위치 정보 삭제
   */
  clearLocationData: () => {
    localStorage.removeItem('LOCATION_DATA');
  },

  /**
   * GPS 위치 데이터가 만료되었는지 확인 (24시간 기준)
   * @param {number} timestamp - 저장된 시간 (밀리초)
   * @returns {boolean} - 만료되었으면 true
   */
  isLocationDataExpired: (timestamp) => {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24시간 (밀리초)
    return Date.now() - timestamp > TWENTY_FOUR_HOURS;
  },
};

// -----------------
//  카드 순서 저장 관련
//  ----------------

/**
 * 카드 순서 로컬스토리지에서 가져오는 getter 함수
 * @param {Array<number>} defaultOrder 저장된 값 없을 시 사용할 기본 템플릿
 * @returns {Array<number>} 최종 카드 순서 배열
 */
export function loadCardOrder(defaultOrder) {
  const saved = localStorage.getItem(CARD_ORDER_KEY);
  // console.log('saved:', saved);
  // CASE.1 저장된 값이 없는 경우 -> 디폴트 반환
  if (!saved) {
    // console.log('저장된 값 없음, 디폴트 반환');
    return defaultOrder;
  }
  // CASE.2 저장된 값이 있는 경우
  const savedOrder = JSON.parse(saved);
  // console.log('savedOrder:', savedOrder);
  // console.log('defaultOrder:', defaultOrder);

  // 저장된 카드의 id 목록
  const savedIds = savedOrder.map(card => card.id);
  // 기본 카드들의 id 목록 (추가된 경우에는 이곳에 존재)
  const defaultIds = defaultOrder.map(card => card.id);
  
  // 새로운 카드 찾기 (defaultOrder에는 있지만 savedOrder에는 없는 것들)
  const newCards = defaultOrder.filter(card => !savedIds.includes(card.id));
  
  // 디폴트에서 삭제된 카드 제거 (savedOrder에는 있지만 defaultOrder에는 없는 것들)
  const validOrder = savedOrder.filter(card => defaultIds.includes(card.id));
  
  // const result = [...validOrder, ...newCards];
  // console.log('최종 반환값:', result);
  // 삭제된 카드를 제거한 배열 + 새 카드
  return [...validOrder, ...newCards];
  
}


/**
 * 카드 순서를 로컬스토리지에 저장하는 setter 함수
 * @param {Array<number>} order 저장할 카드 순서 배열
 */
export function saveCardOrder(order) {
  localStorage.setItem(CARD_ORDER_KEY, JSON.stringify(order));
}
