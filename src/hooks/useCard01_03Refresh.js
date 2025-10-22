import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getCurrentAirCondition } from "../store/thunks/currentAirConditionThunk"

const useCard01_03Refresh = (measuringStation) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const refreshData = () => {
      if(measuringStation) {
        dispatch(getCurrentAirCondition(measuringStation));
      }
    }

    // 1시간(3600000ms)마다 데이터 새로고침
    const intervalId = setInterval(refreshData, 3600000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [dispatch, measuringStation])
}

export default useCard01_03Refresh;