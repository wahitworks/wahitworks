import { LOCALSTORAGE_KEYS } from '../constants/localStorageKeys.js';

export const localStorageUtil = {
  // ----------------------
  //   북마크 관련
  // ----------------------

  /**
   * 로컬스토리지에 북마크 지역 리스트 저장
   * @param {Array} data - bookmarked regions list
   */
  setBookmarkedRegions: (data) => {
    localStorage.setItem(LOCALSTORAGE_KEYS.BOOKMARKED_REGIONS, JSON.stringify(data));
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

}