import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { fetchFineDustData } from "../store/thunks/fineDustThunk";

/**
 * Card04용. 각 북마크 항목별로 미세먼지 데이터 새로고침
 * @param {string} stationName - fetchFineDustDatat에 필요한 측정소 이름
 */
const useCard04Refresh = (stationName) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshData = () => {
      if (stationName) { // stationName이 있을 때만 호출
        dispatch(fetchFineDustData({ stationName: stationName }));
      } 
    };

    // 컴포넌트 마운드 시 즉시 데이터 호출
    refreshData();

    // 1시간(3600000ms)마다 데이터 새로고침
    const intervalId = setInterval(refreshData, 3600000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [dispatch, stationName])
}

export default useCard04Refresh;