import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Card02.css";
import LogoError from "../logo/LogoError.jsx";

// 우리가 만든 Thunk와 Slice의 액션들을 가져옵니다.
import { fetchAirQuality } from "../../store/thunks/airQualityThunk.js";
import { nextDay, prevDay } from "../../store/slices/airQualitySlice.js";

import LogoGood from "../logo/LogoGood.jsx";
import LogoModerate from "../logo/LogoModerate.jsx";
import LogoBad from "../logo/LogoBad.jsx";

// 스켈레톤 컴포넌트 임포트

import Card02LoadingSkeleton from "../commons/Card02LoadingSkeleton.jsx";

// 등급별 텍스트와 이미지를 매핑하는 헬퍼 객체
const labelByGrade = { 1: "좋음", 2: "보통", 3: "나쁨", 4: "매우나쁨" };

function Card02() {
  const dispatch = useDispatch();

  // Redux 스토어에서 필요한 상태들을 선택
  // dailyForecasts: 3일치 예보 입력 예정
  // currentIndex: 버튼으로 날짜이동용
  const { dailyForecasts, currentIndex, loading, error } = useSelector(
    (state) => state.airQuality
  );

  // 컴포넌트가 처음 마운트될 때만 데이터를 불러옴
  useEffect(() => {
    dispatch(fetchAirQuality());
  }, [dispatch]);

  // 1. 로딩 중일 때 표시할 화면
  if (loading) {
    return <Card02LoadingSkeleton />;
  }

  // 2. 에러가 발생했을 때 표시할 화면
  if (error) {
    return (
      <div className="card02-container">
        <h2>대구 대기질 3일 예보</h2>
        <LogoError animated style={{ margin: "10px" }} />
        <p>오류가 발생했습니다.</p>
      </div>
    );
  }
  // 3. 데이터가 비어있을 때 표시할 화면
  // 서버가 불안정할시의 가드
  if (!dailyForecasts || dailyForecasts.length === 0) {
    return (
      <div className="card02-container">
        <h2>대구 대기질 3일 예보</h2>
        <p>표시할 데이터가 없습니다.</p>
        <LogoError animated style={{ margin: "10px" }} />
      </div>
    );
  }

  // ++ grade 별 아이콘 컴포넌트 출력을 위한 함수
  const getAirQualityIcon = (grade) => {
    const icons = {
      1: <LogoGood animated style={{ margin: "10px" }} />,
      2: <LogoModerate animated style={{ margin: "10px" }} />,
      3: <LogoBad animated style={{ margin: "10px" }} />,
    };
    return icons[grade] || <LogoGood animated />;
  };

  // 4. 성공적으로 데이터를 불러왔을 때 표시할 메인 화면 용
  // idx로 연결하여 api의 특정 날짜의 데이터를 오늘, 내일, 모레 3가지 중 한개로 표기
  const currentDayData = dailyForecasts[currentIndex]; //버튼 입력시 idx 변경
  const dayLabels = ["오늘", "내일", "모레"]; //currentIndex와 같은 인덱스 구조로 연결되어 텍스트 출력

  return (
    <>
      <div className="card02-container">
        <h2>대구 대기질 3일 예보</h2>
        <p className="card02-measure-time">{currentDayData.measuredTime}</p>
        {/* 날짜와 좌/우 이동 버튼 */}
        <div className="day-navigation">
          <button
            onClick={() => dispatch(prevDay())}
            // 오늘 정보를 보고있을시 버튼 비활성화
            disabled={currentIndex === 0}
          >
            &lt;
          </button>
          <div className="card02-date-flex-container">
            {dayLabels[currentIndex]}{" "}
            <span className="date-text">{currentDayData.date}</span>
          </div>
          <button
            onClick={() => dispatch(nextDay())}
            // 3일차 (모레) 마지막 정보를 보고있을시 버튼 비활성화
            disabled={currentIndex === dailyForecasts.length - 1}
          >
            &gt;
          </button>
        </div>

        {/* 해당 날짜의 오염원별 예보 */}
        {/* 아래처럼 동적 프로퍼티 적극 사용 + .map()으로 api 오염코드 객체 (forecasts)에 추가사항이 있어도 추가 작업 하드코딩이 불필요. */}
        <div className="forecasts-grid" key={currentIndex}>
          {/* map을 쓰기위해 오염코드 객체 -> 배열변환 */}
          {/* forecasts: 오염코드 pm10, pm25, o3 소문자 변환된 값이 들어있음.*/}
          {/* Object.keys: 객체의 key만 뽑아 배열 생성 -> '문자열' 형식으로 key를 배열에 저장 ['pm10', 'pm25', 'o3'] -> 반환된 배열 .map돌리기 */}
          {Object.keys(currentDayData.forecasts).map((pollutantKey) => {
            const grade = currentDayData.forecasts[pollutantKey]; //pollutantKey에 해당하는 value 1, 2, 3 (오염코드 고유번호)가 저장
            const pollutantNames = {
              // 담긴 문자열 pollutantKey (문자열 배열)을 화면에 출력하기 좋게 문자열로 변경.
              pm25: "초미세먼지",
              pm10: "미세먼지",
              o3: "오존",
            };
            return (
              <div className="forecast-item" key={pollutantKey}>
                {/* 객체 프로퍼티 동적 추가 */}
                {/* pollutantKey가 맵을 돌며 pollutantNames의 키에 해당하는 값을 꺼내 출력 */}
                <h4>{pollutantNames[pollutantKey]}</h4>
                <div className="forecast-img-wrapper">
                  {getAirQualityIcon(grade)}
                </div>
                {/* <img
                // text, img 매핑 헬퍼 객체 숫자 키값에 해당하는 value를 grade를 사용해서 뽑아옴
                src={imgByGrade[grade]}
                alt={labelByGrade[grade]}
                className="forecast-img"
              /> */}
                <p>{labelByGrade[grade]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Card02;
