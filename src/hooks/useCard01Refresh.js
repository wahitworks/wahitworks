import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchDaeguTodayWeather } from "../store/thunks/weatherThunk";

const useCard01Refresh = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshData = () => {
      dispatch(fetchDaeguTodayWeather());
    };

    refreshData(); // 맨 처음 한 번 실행

    // 1시간(3600000ms)마다 데이터 새로고침
    const intervalId = setInterval(refreshData, 3600000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [dispatch]);
};

export default useCard01Refresh;