import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Card02.css";

// 우리가 만든 Thunk와 Slice의 액션들을 가져옵니다.
import { fetchAirQuality } from "../../store/thunks/airQualityThunk.js";
import { nextDay, prevDay } from "../../store/slices/airQualitySlice";

// 이미지 에셋들을 가져옵니다.
import veryBad from "../../assets/weather-indicators/verybad.jpg";
import bad from "../../assets/weather-indicators/bad.jpg";
import normal from "../../assets/weather-indicators/normal.jpg";
import good from "../../assets/weather-indicators/good.jpg";

// 등급별 텍스트와 이미지를 매핑하는 헬퍼 객체
const labelByGrade = { 1: "좋음", 2: "보통", 3: "나쁨", 4: "매우나쁨" };
const imgByGrade = { 1: good, 2: normal, 3: bad, 4: veryBad };

function Card02() {
  const dispatch = useDispatch();

  // Redux 스토어에서 필요한 상태들을 선택합니다.
  const { dailyForecasts, currentIndex, loading, error } = useSelector(
    (state) => state.airQuality
  );

  // 컴포넌트가 처음 마운트될 때만 데이터를 불러옵니다.
  useEffect(() => {
    dispatch(fetchAirQuality());
  }, [dispatch]);

  // 1. 로딩 중일 때 표시할 화면
  if (loading) {
    return (
      <div className="card02-container">
        <h2>초미세먼지 예보</h2>
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 2. 에러가 발생했을 때 표시할 화면
  if (error) {
    return (
      <div className="card02-container">
        <h2>초미세먼지 예보</h2>
        <p>에러가 발생했습니다: {error}</p>
      </div>
    );
  }

  // 3. 데이터가 비어있을 때 표시할 화면
  if (!dailyForecasts || dailyForecasts.length === 0) {
    return (
      <div className="card02-container">
        <h2>대기질 예보</h2>
        <p>표시할 데이터가 없습니다.</p>
      </div>
    );
  }

  // 4. 성공적으로 데이터를 불러왔을 때 표시할 메인 화면
  const currentDayData = dailyForecasts[currentIndex];
  const dayLabels = ["오늘", "내일", "모레"];

  return (
    <div className="card02-container">
      <h2>대기질 3일 예보</h2>

      {/* 날짜와 좌/우 이동 버튼 */}
      <div className="day-navigation">
        <button
          onClick={() => dispatch(prevDay())}
          disabled={currentIndex === 0}
        >
          이전 날
        </button>
        <h3>
          {dayLabels[currentIndex]}{' '}
          <span className="date-text">({currentDayData.date})</span>
        </h3>
        <button
          onClick={() => dispatch(nextDay())}
          disabled={currentIndex === dailyForecasts.length - 1}
        >
          다음 날
        </button>
      </div>

      {/* 해당 날짜의 오염원별 예보 */}
      <div className="forecasts-grid">
        {Object.keys(currentDayData.forecasts).map((pollutantKey) => {
          const grade = currentDayData.forecasts[pollutantKey];
          const pollutantNames = { pm25: '초미세먼지', pm10: '미세먼지', o3: '오존' };
          return (
            <div className="forecast-item" key={pollutantKey}>
              <h4>{pollutantNames[pollutantKey]}</h4>
              <img
                src={imgByGrade[grade]}
                alt={labelByGrade[grade]}
                className="forecast-img"
              />
              <p>{labelByGrade[grade]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Card02;
