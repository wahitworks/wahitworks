// ============================================
// ||     기본 접두사 정의
// ============================================
const STORAGE_PREFIX = "DaeguMalgeum_";

// ============================================
// ||     실제 사용할 KEY들 정의
// ============================================
export const LOCALSTORAGE_KEYS = {
  // 코드에서 사용하는 이름 : 실제 로컬스토리지 KEY
  BOOKMARKED_REGIONS: `${STORAGE_PREFIX}bookmarkedRegions`,
};

// ============================================
// ||     Object.freeze로 불변 객체로 만들기
// ============================================
Object.freeze(LOCALSTORAGE_KEYS);


// -----
// 카드 순서 키
// -----
export const CARD_ORDER_KEY = "CARD_ORDER_V1";
