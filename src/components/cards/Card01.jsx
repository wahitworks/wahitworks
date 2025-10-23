import "./Card01.css";
import { useSelector } from "react-redux";
import useCard01Refresh from "../../hooks/useCard01Refresh.js";
import LoadingSkeleton from "../commons/LoadingSkeleton.jsx";

// 로고 컴포넌트 import
import LogoGoodWhite from "../commons/LogoGoodWhite.jsx";
import LogoModerateWhite from "../commons/LogoModerateWhite.jsx";
import LogoBadWhite from "../commons/LogoBadWhite.jsx";
import LogoVeryBadWhite from "../commons/LogoVeryBadWhite.jsx";
import LogoErrorWhite from "../commons/LogoErrorWhite.jsx";

// 날씨 아이콘 import
import { HiOutlineSun } from "react-icons/hi2"; // 맑음
import { WiDayCloudy } from "react-icons/wi"; // 구름조금
import { WiCloudy } from "react-icons/wi"; // 구름많음
import { WiCloud } from "react-icons/wi"; // 흐림
import { MdOutlineWaterDrop } from "react-icons/md"; //물방울

function Card01() {
  const { currentPM10, loading: airLoading, error: airError } = useSelector(state => state.currentAirCondition);
  const { data: weatherData, loading: weatherLoading, error: weatherError } = useSelector(state => state.weather);

  useCard01Refresh();

  const getDustInfo = (pm10Value) => {
    if (pm10Value === null || pm10Value === undefined || pm10Value === 0) {
      return {
        statusText: "측정 불가",
        actionGuide: "데이터를 가져올 수 없습니다.",
        IconComponent: LogoErrorWhite,
        backgroundColor: "#808080",
        className: "logo-error-white-medium",
        valueText: "",
      };
    }
    if (pm10Value <= 30) {
      return {
        statusText: "좋음",
        actionGuide: "공기가 상쾌해요! 야외 활동을 즐기세요.",
        IconComponent: LogoGoodWhite,
        backgroundColor: "#409dd8",
        className: "logo-good-white-medium",
        valueText: `(${pm10Value}㎍/㎥)`,
      };
    } else if (pm10Value <= 80) {
      return {
        statusText: "보통",
        actionGuide: "무난한 날이에요! 그래도 마스크는 챙기세요.",
        IconComponent: LogoModerateWhite,
        backgroundColor: "#8add80ff",
        className: "logo-moderate-white-medium",
        valueText: `(${pm10Value}㎍/㎥)`,
      };
    } else if (pm10Value <= 150) {
      return {
        statusText: "나쁨",
        actionGuide: "공기가 탁해요! 마스크를 꼭 착용하세요.",
        IconComponent: LogoBadWhite,
        backgroundColor: "#ecd049",
        className: "logo-bad-white-medium",
        valueText: `(${pm10Value}㎍/㎥)`,
      };
    } else {
      return {
        statusText: "매우 나쁨",
        actionGuide: "위험! 외출을 자제하고 실내에 머무르세요.",
        IconComponent: LogoVeryBadWhite,
        backgroundColor: "#db1d1c",
        className: "logo-very-bad-white-medium",
        valueText: `(${pm10Value}㎍/㎥)`,
      };
    }
  };

  const getWeatherInfo = (weatherDesc) => {
    switch (weatherDesc) {
      case "맑음":
        return <HiOutlineSun className="weather-cloud" size={28}/>;
      case "구름 조금":
        return <WiDayCloudy className="weather-cloud" size={28} />;
      case "구름 많음":
        return <WiCloudy className="weather-cloud" size={28}/>;
      case "흐림":
        return <WiCloud className="weather-cloud" size={28}/>;
      default:
        return null;
    }
  };

  const actionGuideDustInfo = getDustInfo(currentPM10);
  const { IconComponent, className: iconClassName } = actionGuideDustInfo;

  if ((airLoading || weatherLoading || currentPM10 === 0) && !airError && !weatherError) {
    return (
      <LoadingSkeleton
        width="90%"
        height="300px"
        borderRadius="15px"
        backgroundColor="#e6e9ecff"
        highlightColor="#F8F9FA"
        lines={[
          { width: '50%', height: '50px', align: 'center' },
          { width: '100%', height: '60px', align: 'center' },
          { width: '50%', height: '150px', align: 'center' },
          { width: '50%', height: '50px', align: 'center' },
        ]}
      />
    );
  }

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
          {actionGuideDustInfo.statusText}{actionGuideDustInfo.valueText}
        </p>
        <div className="weather-info-container">
          {weatherError ? (
            <p>{weatherError}</p>
          ) : weatherData ? (
            <>
              <div className="weather-icon">{getWeatherInfo(weatherData.weatherDesc)}</div>
              <span className="temperature">{Math.round(weatherData.temperature)}°C</span>
              <div className="weather-icon"><MdOutlineWaterDrop size={20}/></div>
              <span className="precipitation">{weatherData.rainProb}%</span>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Card01;
