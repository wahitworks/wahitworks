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
  return saved ? JSON.parse(saved) : defaultOrder;
}

/**
 * 카드 순서를 로컬스토리지에 저장하는 setter 함수
 * @param {Array<number>} order 저장할 카드 순서 배열
 */
export function saveCardOrder(order) {
  localStorage.setItem(CARD_ORDER_KEY, JSON.stringify(order));
}
