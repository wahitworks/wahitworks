import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosUltraFineDust from "../../configs/axiosUltraFineDust.js";

/**
 * API 원본 데이터를 앱에서 사용하기 좋은 형태로 변환하는 함수.
 * @param {object} body - API 응답의 body 부분.
 * @returns {array} - [{ date: "YYYY-MM-DD", forecasts: { pm25: 1, pm10: 2, o3: 4 } }, ...]
 */
const transformData = (body) => {
  // API 값 변환표
  // (lookup) nValue가 있을때: xValue로 바꿔라.
  // 문자열 좋음, 나쁨등을 숫자 데이터로 변환하여 등급으로 사용하기 용이하게 함.
  const gradeMap = { 좋음: 1, 보통: 2, 나쁨: 3 };

  // API 값 변환표
  // (lookup) nValue가 있을때: xValue로 바꿔라.
  // js에서 소문자가 이용하기 용이.
  const pollutantMap = { PM25: "pm25", PM10: "pm10", O3: "o3" };

  // 날짜별로 결과를 담을 임시 저장소 객체
  const resultsByDate = {};

  // API가 데이터를 주지 않았을 경우를 대비한 안전장치
  // body가 없을경우와 items이 아예 비어있을시의 2가지 경우
  if (!body || !body.items) {
    return [];
  }

  // API 데이터를 하나씩 확인하며 resultsByDate에 정리
  body.items.forEach((item) => {
    const date = item.informDate; //날짜 넣기 (3일분 'YYYY-MM-DD' 포멧 날짜 넣기)
    const pollutant = pollutantMap[item.informCode]; //informCode (pm25, pm10, o3) 넣기 및 소문자 변환 (line18 참조)
    const measuredTime = item.dataTime; //측정 시간
    // 날짜와 오염 항목(pm25, pm10, o3)없을 시 코드 진행을 위한 가드
    if (!date || !pollutant) return;

    // 지역별 오염도 상태를 캐치그룹 ((/대구\s*:\s*([가-힣]+)/)) 을 사용하여 대구만 추출
    // .match는 배열반환 예시:
    // [
    //   "대구 : 보통", // [0] 전체 매칭된 문자열
    //   "보통"          // [1] ()로 캡처한 값
    // ]
    // 즉 .match로 전체 문자열 먼저 확인 -> 대구 : 'value' 있는지 확인까지.
    const daeguGradeMatch = item.informGrade.match(/대구\s*:\s*([가-힣]+)/);
    if (!daeguGradeMatch || !daeguGradeMatch[1]) return; //대구 : 'value' 있는지 확인까지.

    const gradeText = daeguGradeMatch[1]; //좋음 || 보통 || 나쁨 문자열
    const grade = gradeMap[gradeText] || 0; // 오염도 단계 좋음 || 보통 || 나쁨를 number data로 변경 (1,2,3)

    // resultsByDate 객체에 날짜별로 데이터 저장
    // 왜? 우리는 날짜마다 3가지 값을 받아옴 (pm10, pm25, o3). 이걸 그룹화 해줘야함
    // resultByDate = {}
    // informCode (pm25, pm10, o3)
    // date = API의 3일분 'YYYY-MM-DD'
    // 객체 프로퍼티 동적 추가 문법: obj['string' || var] = [객체에 key와 값 (프로퍼티) 추가]
    // resultsByDate {}에 [key값]을 추가 해줌.
    // 참고로 obj['string']으로 들어가도 문자열이 그대로 key가됌.
    // 1. '문자열' 이용시 이름 그대로 키를 추가또는 중복키 값 덮어쓰기
    // 2. 변수 사용시 변수의 값이 key로 할당됌.
    if (!resultsByDate[date]) {
      resultsByDate[date] = {
        date: date,
        forecasts: {},
        measuredTime,
      };
    }
    // pollutant: pollutantMap으로 pm25, pm10, o3 (소문자)변환된 값 담김
    // grade: gradeMap으로 오염도 단계 좋음 || 보통 || 나쁨이 number data로 변환된 값(1,2,3)
    // forecasts에 객체 동적 프로퍼티 추가로 pollutant: grade추가
    // 예시:
    // {
    //   "2025-10-15": {
    //     date: "2025-10-15",
    //     forecasts: {
    //       pm25: 2  // ← 지금 여기 추가된 것
    //     }
    //   }
    // }
    resultsByDate[date].forecasts[pollutant] = grade;
  });

  // 1. Object.values를 사용하여 객체 -> 배열로 변환 *.map() 사용 유리
  //   [
  //   { date: "2025-10-15", forecasts: { pm25: 2, pm10: 3, o3: 1 } },
  //   { date: "2025-10-16", forecasts: { pm25: 1, pm10: 2, o3: 2 } }
  // ]
  // 위의 변환된 배열을 .sort로 순회 -> 날짜비교를 위해 날짜객체로 변경
  // a-b: a가 양수일시 b를 앞으로
  // a = 10, b = 5, a-b = 5(양수)이니 b의 날짜가 더 빠르니 앞으로 당겨옴
  return Object.values(resultsByDate).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};

export const fetchAirQuality = createAsyncThunk(
  "airQuality/fetchData",
  // '_' payload 불필요
  async (_, thunkAPI) => {
    try {
      // 미리 설정해둔 axios로 api 호출
      const response = await axiosUltraFineDust.get(
        "ArpltnInforInqireSvc/getMinuDustFrcstDspth",
        {
          params: {
            sidoName: "대구",
          },
        }
      );
      // API 데이터 값 접근
      const body = response.data.response.body;
      // api 호출 성공 코드 '00'의 값 || 타입이 다를시 에러 메시지 출력
      // === 엄격 비교 (값 & 타입)
      // !== 비엄격 (값 || 타입) 둘장에 하나라도 다를시 true
      if (response.data.response.header.resultCode !== "00") {
        throw new Error(response.data.response.header.resultMsg);
      }

      // 호출된 API값을 최종 가공
      const transformed = transformData(body);

      return transformed;
    } catch (error) {
      console.error("API 호출 중 에러 발생:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
