import "./Header.css";
import logoTitle from "../../assets/logos/logo-title-200.svg";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import LocationSearch from "./LocationSearch.jsx";
import HeaderMenu from "./HeaderMenu.jsx";
import Logo from "../commons/Logo.jsx";

import {
  setHeaderTitle,
  setMenuFlg,
  setSearchFlg,
} from "../../store/slices/headerSlice.js";
import { LOCATION_LIST } from "../../constants/locationList.js";
import { getCurrentLocation, getSearchLocation } from "../../store/thunks/locationThunk.js";
import { setMatchedLocation, setMeasuringStation, setMeasuringStationDistance } from "../../store/slices/locationSlice.js";
import { stringUtils } from "../../utils/stringUtil.js";

// 헤더에 들어가는 아이콘
import { HiChevronLeft } from "react-icons/hi2";
import { VscMenu } from "react-icons/vsc";
import { findNearestStation } from "../../utils/geoUtil.js";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const headerTitle = useSelector((state) => state.headerSlice.headerTitle);
  const searchFlg = useSelector((state) => state.headerSlice.searchFlg);
  const searchKeyword = useSelector((state) => state.locationSearchSlice.searchKeyword);
  const currentLocation = useSelector(state => state.locationSlice.currentLocation);
  const measuringStation = useSelector(state => state.locationSlice.measuringStation);

  // const matchedLocation = useSelector(state => state.locationSlice.matchedLocation);

  const currentRegion = useSelector(
    (state) => state.locationSlice.currentRegion
  );

  /**
   * path '/'로 이동시키는 함수
   */
  const goHome = () => {
    navigate("/");
    dispatch(setMenuFlg(false));
    dispatch(setSearchFlg(false));
  };

  // 페이지 path 별로 수정할 타이틀 지정
  const pageTitle = {
    "/editbookmark": "내 장소 관리",
    "/editcard": "카드 관리",
    "/apptutorial": "사용 가이드",
    "/introduce": "이게 되네",
  };
  // 측정소 정보 표시를 위한, path값이 없는 = 페이지 타이틀이 없는 경우
  const measuringOn = !pageTitle[location.pathname];
  
    /**
     * headerTitle 클릭 시, searchFlg true ↔ false
     */
    const headerTitleClick = () => {
      if (location.pathname === "/") {
        dispatch(setSearchFlg(!searchFlg));
      }
    };
    /**
     * headerMenu 클릭 시, menuFlg true
     */
    const headerMenuClick = () => {
      dispatch(setMenuFlg(true));
    };

  useEffect(() => {
    // =============================================
    // ||        특정 path값 존재 시, 
    // =============================================
    //       -> 해당 페이지 타이틀 출력
    if (pageTitle[location.pathname]) {
      dispatch(setHeaderTitle(pageTitle[location.pathname]));
      return;
    }
    // 메인 페이지 아닐 시, 함수 종료
    if (location.pathname !== "/") {
      return;
    }

    // =============================================
    // ||         메인페이지 '/' 일 경우,
    // =============================================
    // ||         검색어 있을 시!!!
    // =============================================

    // 매칭된 검색어 담을 변수
    let foundLocation = null;
    if (searchKeyword?.trim) {

      // 검색어로 데이터에서 찾기 (띄어쓰기 제외한 값을 서로 비교)
      const keywordNoSpace = stringUtils.removeSpaces(searchKeyword);
      foundLocation = LOCATION_LIST.find((location) => {
        const locationNoSpace = stringUtils.removeSpaces(location);
        return locationNoSpace.includes(keywordNoSpace);
      });
      //  -> 데이터에서 검색어 값이 있다면 타이틀로 출력
      if (foundLocation) {
        dispatch(setHeaderTitle(foundLocation));
        dispatch(setMatchedLocation(foundLocation));
        dispatch(getSearchLocation(searchKeyword))

        return;
      } else {
        console.log(
          "검색어가 없거나 매칭 지역이 없습니다. 현재위치를 가져옵니다."
        );
        //  -> 매칭된 지역이 없을 경우,
        //     현재 위치 가져오기 + 현재 위치를 기반으로 타이틀 출력하기
        dispatch(getCurrentLocation());
      }
    } else {
    // =============================================
    // ||         검색어 없을 시!!!
    // =============================================
      console.log("검색어가 없습니다. 현재위치를 가져옵니다.");
      //   -> 현재 위치 가져오기 + 현재 위치를 기반으로 타이틀 출력하기
      dispatch(getCurrentLocation());
    }
    //          + 재검색 대비!!!
    // 현재 위치 정보 있고, (매칭에 실패했거나, 검색어 없음)
    if (currentRegion && !foundLocation) {
      dispatch(setHeaderTitle(currentRegion));
    }
  }, [location.pathname, searchKeyword, currentRegion]);

  console.log('측정소:', measuringStation);

  return (
    <>
      <div className="header-container">
        {location.pathname === "/" ? (
          <div className="header-logo-container" onClick={() => goHome()}>
            <Logo animated className="header-logo" />
            <div
              className="header-logo-title"
              style={{ backgroundImage: `url(${logoTitle})` }}
            ></div>
          </div>
        ) : (
          <span className="header-return" onClick={() => goHome()}>
            <HiChevronLeft size={35} />
          </span>
        )}
        <div className="header-center" onClick={() => headerTitleClick()}>
          <p className="header-title">{headerTitle}</p>
        {measuringOn && measuringStation && <span className="header-title-info">{measuringStation} 측정소</span>}
        </div>
        <div className="header-menu" onClick={() => headerMenuClick()}>
          <VscMenu size={35} />
        </div>
      </div>
      <LocationSearch />
      <HeaderMenu />
    </>
  );
}

export default Header;
