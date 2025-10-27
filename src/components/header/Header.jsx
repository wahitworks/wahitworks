import "./Header.css";
import logoTitle from "../../assets/logos/logo-title-200.svg";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// 컴포넌트
import LocationSearch from "./LocationSearch.jsx";
import HeaderMenu from "./HeaderMenu.jsx";
import LogoOrigin from "../logo/LogoOrigin.jsx";
import Warning from "./Warning.jsx";
import Toast from "../commons/Toast.jsx";

import {
  setHeaderTitle,
  setMenuFlg,
  setSearchFlg,
} from "../../store/slices/headerSlice.js";
import { LOCATION_LIST } from "../../constants/locationList.js";
import {
  getCurrentLocation,
  getSearchLocation,
} from "../../store/thunks/locationThunk.js";
import {
  setDisplayLocation,
  setMeasuringStation,
  clearLocationError,
} from "../../store/slices/locationSlice.js";
import { stringUtils } from "../../utils/stringUtil.js";
import { localStorageUtil } from "../../utils/localStorageUtil.js";

// 헤더에 들어가는 아이콘
import { HiChevronLeft } from "react-icons/hi2";
import { VscMenu } from "react-icons/vsc";
import { LiaSearchLocationSolid } from "react-icons/lia";
import { FaChevronDown } from "react-icons/fa6";

function Header() {
  // ===== Hook =====
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // ===== 전역 state =====
  const headerTitle = useSelector((state) => state.headerSlice.headerTitle);
  const searchFlg = useSelector((state) => state.headerSlice.searchFlg);
  const menuFlg = useSelector((state) => state.headerSlice.menuFlg);
  const searchKeyword = useSelector(
    (state) => state.locationSearchSlice.searchKeyword
  );
  const displayLocation = useSelector(
    (state) => state.locationSlice.displayLocation
  );
  const measuringStation = useSelector(
    (state) => state.locationSlice.measuringStation
  );
  const locationError = useSelector(
    (state) => state.locationSlice.error
  );

  // ===== 로컬 state (Toast) =====
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 페이지 path 별로 수정할 타이틀 지정
  const pageTitle = {
    "/editbookmark": "내 장소 관리",
    "/editcard": "카드 관리",
    "/apptutorial": "사용 가이드",
    "/introduce": "사이트 소개",
  };
  // 측정소 정보 표시를 위한, path값이 없는 = 페이지 타이틀이 없는 경우
  const measuringOn = !pageTitle[location.pathname];

  /**
   * path '/'로 이동시키는 함수
   */
  const goHome = () => {
    navigate("/");
    dispatch(setMenuFlg(false));
    dispatch(setSearchFlg(false));
  };

  /**
   * headerTitle 클릭 시, searchFlg true ↔ false
   */
  const headerTitleClick = () => {
    dispatch(setSearchFlg(!searchFlg));
  };

  /**
   * headerMenu 클릭 시, menuFlg true
   */
  const headerMenuClick = () => {
    dispatch(setMenuFlg(true));
  };

  // ======================================================
  // ||     useEffect : 최초 마운트 시 로컬스토리지에서 위치 복원
  // ======================================================
  useEffect(() => {
    // 로컬스토리지에서 저장된 위치 정보 가져오기
    const savedData = localStorageUtil.getLocationData();

    if (savedData) {
      const { displayLocation, measuringStation, timestamp } = savedData;

      // CASE 1: 위치 정보가 '검색'으로 저장한 경우 → 그대로 사용
      if (displayLocation.source === 'search') {
        // console.log('검색 위치를 로컬스토리지에서 복원:', displayLocation.name);
        dispatch(setDisplayLocation(displayLocation));
        dispatch(setMeasuringStation(measuringStation));
        return;
      }

      // CASE 2: 위치 정보가 'GPS'로 저장한 경우 → 24시간 확인
      if (displayLocation.source === "gps") {
        const isExpired = localStorageUtil.isLocationDataExpired(timestamp);

        if (isExpired) {
          // 24시간 지남 → GPS 재호출
          // console.log('GPS 위치가 만료되어 새로 가져옵니다.');
          dispatch(getCurrentLocation());
        } else {
          // 24시간 안 지남 → 그대로 사용
          // console.log('로컬스토리지에서 GPS 위치 복원:', displayLocation.name);
          dispatch(setDisplayLocation(displayLocation));
          dispatch(setMeasuringStation(measuringStation));
        }
        return;
      }
    }

    // CASE 3: 저장된 데이터 없음 → GPS로 현재 위치 가져오기
    // console.log('저장된 위치 정보가 없습니다. GPS로 현재 위치를 가져옵니다.');
    dispatch(getCurrentLocation());
  }, []); // 빈 배열: 최초 마운트 시 한 번만 실행

  // ======================================================
  // ||     useEffect : 검색어 변경 시 위치 검색
  // ======================================================
  useEffect(() => {
    // 메인 페이지가 아니면 ->  실행 안 함
    if (location.pathname !== "/") {
      return;
    }

    // searchKeyword가 없으면 = 검색하지 않았으면 -> 실행 안 함
    if (!searchKeyword?.trim || searchKeyword.trim() === "") {
      return;
    }

    // 검색어로 데이터에서 찾기 (띄어쓰기 제외)
    const keywordNoSpace = stringUtils.removeSpaces(searchKeyword);
    const foundLocation = LOCATION_LIST.find((location) => {
      const locationNoSpace = stringUtils.removeSpaces(location);
      return locationNoSpace.includes(keywordNoSpace);
    });

    // 검색어가 매칭 된 경우
    if (foundLocation) {
      // 이미 같은 위치로 설정되어 있으면 API 재호출 방지
      if (displayLocation.name === foundLocation) {
        // console.log('이미 같은 위치로 설정되어 있음. API 호출 스킵:', foundLocation);
        return;
      }

      // 측정소 가져오기 (getSearchLocation이 displayLocation 설정 + 로컬스토리지 저장까지 자동으로 해줌)
      dispatch(getSearchLocation(foundLocation));
      // console.log('검색 위치 API 호출:', foundLocation);
    } else {
      // 매칭된 지역이 없을 경우
      // console.log("검색어와 매칭된 지역이 없습니다.");
    }
  }, [searchKeyword, location.pathname, displayLocation.name, dispatch]);

  // ======================================================
  // ||     useEffect : pathname 변경 시 headerTitle 업데이트
  // ======================================================
  useEffect(() => {
    // 특정 페이지 타이틀이 있는 경우
    if (pageTitle[location.pathname]) {
      dispatch(setHeaderTitle(pageTitle[location.pathname]));
      return;
    }

    // 메인 페이지이고 displayLocation이 있는 경우
    if (location.pathname === "/" && displayLocation.name) {
      dispatch(setHeaderTitle(displayLocation.name));
    }
  }, [location.pathname, displayLocation.name, dispatch]);

  // ======================================================
  // ||     useEffect : locationError 감지 시 Toast 표시
  // ======================================================
  useEffect(() => {
    if (locationError) {
      // 토스트 메시지 설정 및 표시
      setToastMessage(locationError.message);
      setShowToast(true);

      // 2.5초 후 토스트 자동 닫기
      const timer = setTimeout(() => {
        setShowToast(false);
        // 토스트 닫힌 후 에러 초기화
        dispatch(clearLocationError());
      }, 2500);

      // cleanup: 컴포넌트 언마운트 시 타이머 정리
      return () => clearTimeout(timer);
    }
  }, [locationError, dispatch]);

  return (
    <>
      {/* GPS 에러 Toast */}
      <Toast
        show={showToast}
        message={toastMessage}
        backgroundColor="#fff"
        color="#000"
        borderColor="var(--personal-blue)"
        top="13%"
      />

      <div className="header-container">
        {/* 왼쪽 로고 영역 */}
        {location.pathname === "/" ? (
          // ===== 현재 주소가 메인 '/' 인 경우 -> 로고 =====
          <div className="header-logo-container" onClick={() => goHome()}>
            <LogoOrigin animated className="header-logo" />
            <div
              className="header-logo-title"
              style={{ backgroundImage: `url(${logoTitle})` }}
            ></div>
          </div>
        ) : (
          // ===== 현재 주소가 메인 '/' 가 아닌 경우 -> `<` 아이콘 =====
          <span className="header-return" onClick={() => goHome()}>
            <HiChevronLeft size={35} />
          </span>
        )}

        {/* 왼쪽 빈 공간 (오른쪽과 대칭) */}
        <div className="header-left-wrapper"></div>

        {/* 가운데 타이틀 영역 */}
        {location.pathname === "/" ? (
          // ===== 현재 주소가 메인 '/' 인 경우 -> 현재(검색)위치 =====
          <div className="header-center" onClick={() => headerTitleClick()}>
            <div className="header-location-center-wapper">
              <div className="header-location-title-wrapper">
                <span className="header-title">{headerTitle}</span>
                <FaChevronDown
                  className="header-title=icon"
                  size={"16px"}
                  color="var(--deep-blue)"
                />
              </div>
              {measuringOn && measuringStation && (
                <span className="header-title-info">
                  {measuringStation} 측정소
                </span>
              )}
            </div>
          </div>
        ) : (
          // ===== 현재 주소가 메인'/' 가 아닌 경우 -> 페이지 제목 =====
          <div className="header-title-wrapper">
            <span className="header-title">{headerTitle}</span>
          </div>
        )}

        {/* 오른쪽 메뉴 아이콘 영역 */}
        <div className="header-right-wrapper">
          {/* 경보아이콘 */}
          {location.pathname === "/" && <Warning />}
        </div>
        <div className="header-menu" onClick={() => headerMenuClick()}>
          <VscMenu size={35} className="header-menu-icon" />
        </div>
      </div>
      {/* Flg 컴포넌트 출력 */}
      {searchFlg && <LocationSearch />}
      {menuFlg && <HeaderMenu />}
    </>
  );
}

export default Header;
