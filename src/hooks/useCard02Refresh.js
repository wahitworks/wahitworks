import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAirQuality } from "../store/thunks/airQualityThunk.js";

/**
 * Card02 컴포넌트의 API들을 1시간마다 주기적으로 디스패치하는 커스텀 훅.
 * Card02는 measuringStation 인자를 필요로 하지 않는 API를 호출합니다.
 */
const useCard02Refresh = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshData = () => {
      dispatch(fetchAirQuality());
    };

    // 1시간(3600000ms)마다 데이터 새로고침
    const intervalId = setInterval(refreshData, 3600000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [dispatch]); // 의존성 배열에서 measuringStation 제거
};

export default useCard02Refresh;
