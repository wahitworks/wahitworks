import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosUltraFineDust from "../../configs/axiosUltraFineDust.js";

/**
 * API 원본 데이터를 앱에서 사용하기 좋은 형태로 변환하는 함수.
 * @param {object} body - API 응답의 body 부분.
 * @returns {array} - [{ date: "YYYY-MM-DD", forecasts: { pm25: 1, pm10: 2, o3: 4 } }, ...]
 */
const transformData = (body) => {
  // API 문자 등급을 UI에서 사용하는 숫자 등급으로 변환하는 규칙
  const gradeMap = { 좋음: 1, 보통: 2, 나쁨: 3 }; // '나쁨'은 3등급으로 확정

  // API 오염원 코드를 우리가 사용할 이름으로 변환하는 규칙
  const pollutantMap = { PM25: "pm25", PM10: "pm10", O3: "o3" };

  // 날짜별로 결과를 담을 임시 저장소 객체
  const resultsByDate = {};

  // API가 데이터를 주지 않았을 경우를 대비한 안전장치
  if (!body || !body.items) {
    return [];
  }

  // API 데이터를 하나씩 확인하며 resultsByDate에 정리
  body.items.forEach((item) => {
    const date = item.informDate;
    const pollutant = pollutantMap[item.informCode];

    // 날짜나 오염원 코드가 없으면 이 항목은 건너뜁니다. (안전장치)
    if (!date || !pollutant) return;

    // '대구' 등급 추출
    const daeguGradeMatch = item.informGrade.match(/대구\s*:\s*([가-힣]+)/);
    if (!daeguGradeMatch || !daeguGradeMatch[1]) return;

    const gradeText = daeguGradeMatch[1];
    const grade = gradeMap[gradeText] || 0; // "좋음" -> 1

    // resultsByDate 객체에 날짜별로 데이터 저장
    if (!resultsByDate[date]) {
      resultsByDate[date] = {
        date: date,
        forecasts: {},
      };
    }
    resultsByDate[date].forecasts[pollutant] = grade;
  });

  // 객체를 날짜순으로 정렬된 배열로 변환하여 반환
  return Object.values(resultsByDate).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};

// 이제 여러 오염원을 다루므로 thunk 이름을 fetchAirQuality로 변경합니다.
export const fetchAirQuality = createAsyncThunk(
  "airQuality/fetchData", // action type도 airQuality로 변경
  async (_, thunkAPI) => {
    try {
      const response = await axiosUltraFineDust.get(
        "ArpltnInforInqireSvc/getMinuDustFrcstDspth",
        {
          params: {
            sidoName: "대구",
          },
        }
      );

      const body = response.data.response.body;

      if (response.data.response.header.resultCode !== "00") {
        throw new Error(response.data.response.header.resultMsg);
      }

      // 위에서 완성한 transformData 함수를 호출합니다.
      const transformed = transformData(body);

      return transformed;
    } catch (error) {
      console.error("API 호출 중 에러 발생:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
