import { useEffect } from "react";
import { useDispatch } from "react-redux";

/**
 * 주어진 thunk들을 1시간마다 주기적으로 디스패치하는 커스텀 훅.
 * 특정 thunk는 measuringStation 인자를 필요로 할 수 있습니다.
 *
 * @param {Array<Function>} thunksToRefresh - 매시간 새로고침할 thunk 함수들의 배열.
 * @param {string} measuringStation - getCurrentAirCondition 및 fetchFineDustData에 필요한 측정소 이름.
 */
const useRefresh = (thunksToRefresh, measuringStation) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshData = () => {
      thunksToRefresh.forEach((thunk) => {
        // 측정소 필요한 thunk 네이밍 검열
        if (
          thunk.name === "getCurrentAirCondition" ||
          thunk.name === "fetchFineDustData"
        ) {
          // 검열 후 측정소 값 있을 시 인자로 넘겨 호출
          if (measuringStation) {
            dispatch(thunk(measuringStation));
          }
        } else {
          // 그 외 thunk는 인자 없이 호출
          dispatch(thunk());
        }
      });
    };

    // 컴포넌트 마운트 시 즉시 데이터 가져오기
    refreshData();

    // 1시간(3600000ms)마다 데이터 새로고침
    const intervalId = setInterval(refreshData, 3600000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [dispatch, measuringStation, thunksToRefresh]); // 의존성 배열에 dispatch 추가
};

export default useRefresh;
