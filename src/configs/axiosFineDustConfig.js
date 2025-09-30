// 미세 먼지 현황

const aixosAirConfig = {
  // 필수
  SERVICE_KEY: "서비스키 입력",
  STATION_NAME: "종로구",
  DATA_TERM: "MONTH", // 요청 데이터 기간

  // 선택
  RETURN_TYPE: "json",
  NUM_OF_ROWS: "10",
};

export default aixosAirConfig;
