import "./Card01.css";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getCurrentLocation } from "../../store/thunks/locationThunk";
import { getCurrentAirCondition } from "../../store/thunks/currentAirConditionThunk.js";

// 로고 컴포넌트 import
import LogoGoodWhite from "../commons/LogoGoodWhite.jsx";
import LogoModerateWhite from "../commons/LogoModerateWhite.jsx";
import LogoBadWhite from "../commons/LogoBadWhite.jsx";
import LogoVeryBadWhite from "../commons/LogoVeryBadWhite.jsx";

function Card01() {
  const dispatch = useDispatch();
  const { selectedLocationByUser, currentRegion, measuringStation } = useSelector(
    (state) => state.locationSlice
  );
  const currentPM10 = useSelector(state => state.currentAirCondition.currentPM10);

  useEffect(() => {
    if (measuringStation) {
      dispatch(getCurrentAirCondition(measuringStation));
      return;
    }

    if (!selectedLocationByUser && !currentRegion) {
      dispatch(getCurrentLocation());
    }
  }, [dispatch, measuringStation, selectedLocationByUser, currentRegion]);


  const getDustInfo = (pm10Value) => {
    if (pm10Value <= 30) {
      return {
        statusText: "좋음",
        actionGuide: "공기가 상쾌해요! 야외 활동을 즐기세요.",
        IconComponent: LogoGoodWhite,
        backgroundColor: "#409dd8",
        className: "logo-good-white-medium",
      };
    } else if (pm10Value <= 80) {
      return {
        statusText: "보통",
        actionGuide: "무난한 날이에요! 그래도 마스크는 챙기세요.",
        IconComponent: LogoModerateWhite,
        backgroundColor: "#8add80ff",
        className: "logo-moderate-white-medium",
      };
    } else if (pm10Value <= 150) {
      return {
        statusText: "나쁨",
        actionGuide: "공기가 탁해요! 마스크를 꼭 착용하세요.",
        IconComponent: LogoBadWhite,
        backgroundColor: "#ecd049",
        className: "logo-bad-white-medium",
      };
    } else {
      return {
        statusText: "매우 나쁨",
        actionGuide: "위험! 외출을 자제하고 실내에 머무르세요.",
        IconComponent: LogoVeryBadWhite,
        backgroundColor: "#db1d1c",
        className: "logo-very-bad-white-medium",
      };
    }
  };

  const pm10Value = currentPM10 ?? 0;
  const actionGuideDustInfo = getDustInfo(pm10Value);
  const { IconComponent, className: iconClassName } = actionGuideDustInfo;

  return (
    <>
      <div 
        className="action-guide-container"
        style={{ backgroundColor: actionGuideDustInfo.backgroundColor }}
      >
        <h2 className="action-guide-intro">오늘은!</h2>
        <p className="action-guide-content">{actionGuideDustInfo.actionGuide}</p>
        <div className="action-guide-icon-container">
          {IconComponent && <IconComponent className={iconClassName} animated={true} />}
        </div>
        <p className="action-guide-text">
          {actionGuideDustInfo.statusText}({pm10Value}㎍/㎥)
        </p>
      </div>
    </>
  );
}

export default Card01;
