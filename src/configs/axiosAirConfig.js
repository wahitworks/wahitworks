// ============================================
// ||     현재 대기 상태
// ============================================

const axiosAirConfig = {
  // 필수
  BASE_URL: "https://app12.green-meerkat.kro.kr/B552584",
  SERVICE_KEY: "834qgh90a2304fj23985yfg2w3ryfci8g32trict6jni56",
  STATION_NAME: "종로구",

  // 선택
  RETURN_TYPE: "json",
  NUM_OF_ROWS: "48",
  NUM_OF_ROWS_2: "96",
  PAGE_NO: "8",
  VER: "1.5",
  DATA_TERM: "DAILY",
  DATA_TERM_2: "MONTH",
};

export default axiosAirConfig;
