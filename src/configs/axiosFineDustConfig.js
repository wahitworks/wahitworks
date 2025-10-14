// 미세 먼지 현황

const aixosFineDustConfig = {
  // 필수
  SERVICE_KEY: "834qgh90a2304fj23985yfg2w3ryfci8g32trict6jni56",
  STATION_NAME: "평리동",
  DATA_TERM: "MONTH", // 요청 데이터 기간

  // 선택
  RETURN_TYPE: "json",
  NUM_OF_ROWS: "10",
};

export default aixosFineDustConfig;
