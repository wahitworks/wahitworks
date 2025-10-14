import "./Card01.css";
import React, { useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";

import { getCurrentLocation } from "../../store/thunks/locationThunk";
import { LOCATION_STATION_MAP } from "../../constants/locationStationMap";
import { fetchFineDustData } from "../../store/thunks/fineDustThunk";

// 아이콘 import 나중에 svg로 변경하면서 변경 필요
import goodIcon from "../../assets/weather-indicators/good.jpg";
import veryBadIcon from "../../assets/weather-indicators/veryBad.jpg";
import normalIcon from "../../assets/weather-indicators/normal.jpg";
import badIcon from "../../assets/weather-indicators/bad.jpg";

function Card01() {
  const dispatch = useDispatch();
  const { selectedLocationByUser, currentRegion } = useSelector(
    (state) => state.locationSlice
  );
  const {
    data: fineDustData,
    loading: fineDustLoading,
    error: fineDustError,
  } = useSelector((state) => state.fineDust);

  useEffect(() => {
    const targetLocation = selectedLocationByUser || currentRegion;
    if (!targetLocation) {
      dispatch(getCurrentLocation());
      return;
    }
    const stationName = LOCATION_STATION_MAP[targetLocation];
    if (stationName) {
      dispatch(fetchFineDustData(stationName));
    } else {
      console.log("에러");
    }
  }, [dispatch, selectedLocationByUser, currentRegion]);

  // 임시 데이터 나중에 날씨 api 받아서 변경 필요
  const weatherInfo = "맑음";
  const weatherValue = 26;

  const getDustInfo = (pm10Value) => {
    if (pm10Value <= 30) {
      return {
        statusText: "좋음",
        actionGuide: "공기 상쾌해요! 야외 활동을 즐기세요.",
        icon: goodIcon,
      };
    } else if (pm10Value <= 80) {
      return {
        statusText: "보통",
        actionGuide: "무난한 날이에요! 그래도 마스크는 챙기세요.",
        icon: normalIcon,
      };
    } else if (pm10Value <= 150) {
      return {
        statusText: "나쁨",
        actionGuide: "공기가 탁해요! 마스크를 꼭 착용하세요.",
        icon: badIcon,
      };
    } else {
      return {
        statusText: "매우 나쁨",
        actionGuide: "위험! 외출을 자제하고 실내에 머무르세요.",
        icon: veryBadIcon,
      };
    }
  };

  const pm10Value = fineDustData?.pm10Value ?? 0;
  const actionGuideDustInfo = getDustInfo(pm10Value);

  return (
    <>
      <div className="action-guide-container">
        <h2 className="action-guide-intro">오늘은!</h2>
        <p className="action-guide-content">{actionGuideDustInfo.actionGuide}</p>
        <div className="action-guide-icon-container">
          <span
            className="action-guide-icon"
            style={{ backgroundImage: `url(${actionGuideDustInfo.icon})` }}
          ></span>
        </div>
        <p className="action-guide-text">
          미세먼지 {actionGuideDustInfo.statusText}({pm10Value}㎍/㎥)
        </p>
        <p className="action-guide-weather">
          날씨 {weatherInfo}({weatherValue}°C)
        </p>
      </div>
    </>
  );
}

export default Card01;