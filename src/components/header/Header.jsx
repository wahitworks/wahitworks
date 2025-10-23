import "./Header.css";
import logoTitle from "../../assets/logos/logo-title-200.svg";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// 컴포넌트
import LocationSearch from "./LocationSearch.jsx";
import HeaderMenu from "./HeaderMenu.jsx";
import LogoOrigin from "../logo/LogoOrigin.jsx";
import Warning from "./Warning.jsx";

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
import { setMatchedLocation } from "../../store/slices/locationSlice.js";
import { stringUtils } from "../../utils/stringUtil.js";

// 헤더에 들어가는 아이콘
import { HiChevronLeft } from "react-icons/hi2";
import { VscMenu } from "react-icons/vsc";
import { LiaSearchLocationSolid } from "react-icons/lia";

function Header() {
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
  const measuringStation = useSelector(
    (state) => state.locationSlice.measuringStation
  );
  const currentRegion = useSelector(
    (state) => state.locationSlice.currentRegion
  );
  const matchedLocation = useSelector(
    (state) => state.locationSlice.matchedLocation
  );

  // ======================================================
  // ||     검색어 관련 함수
  // ======================================================

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
    "/introduce": "사이트 소개",
  };
  // 측정소 정보 표시를 위한, path값이 없는 = 페이지 타이틀이 없는 경우
  const measuringOn = !pageTitle[location.pathname];

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
  // ||     useEffect : 주소/pathname, 검색어에 따른 위치 데이터 가져오기
  // ======================================================
  useEffect(() => {
    // =============================================
    // ||        CASE.1 특정 path값 존재 시,
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
    // ||         CASE.2 메인페이지 '/' 일 경우,
    // =============================================
    // ||         1. 검색어 있을 시!!!
    // =============================================

    // 매칭된 검색어 담을 변수
    let foundLocation = null;
    if (searchKeyword?.trim) {
      // 1. 검색어로 데이터에서 찾기 (띄어쓰기 제외한 값을 서로 비교)
      const keywordNoSpace = stringUtils.removeSpaces(searchKeyword);
      // 비교해서 찾은 값 담기
      foundLocation = LOCATION_LIST.find((location) => {
        const locationNoSpace = stringUtils.removeSpaces(location);
        return locationNoSpace.includes(keywordNoSpace);
      });
      //        -> 2. 데이터에서 검색어 값이 있다면 매칭된 위치 설정
      if (foundLocation) {
        dispatch(setMatchedLocation(foundLocation));
        dispatch(getSearchLocation(foundLocation));
        return;
      } else {
        //        -> 2-1. 매칭된 지역이 없을 경우, 현재 위치 가져오기
        console.log("검색어와 매칭된 지역이 없습니다. 현재위치를 가져옵니다.");
        dispatch(getCurrentLocation());
      }
    } else {
      // =============================================
      // ||         2. 검색어 없을 시!!!
      // =============================================
      //        -> 1. 현재 위치 가져오기
      console.log("검색어가 없습니다. 현재위치를 가져옵니다.");
      dispatch(getCurrentLocation());
    }
  }, [location.pathname, searchKeyword]);

  // ======================================================
  // ||     useEffect : matchedLocation 변화에 따른 headerTitle 업데이트
  // ======================================================
  useEffect(() => {
    // 메인 페이지일 때 headerTitle 업데이트
    if (location.pathname === "/") {
      if (matchedLocation) {
        dispatch(setHeaderTitle(matchedLocation));
      }
    } else if (pageTitle[location.pathname]) {
      // 다른 페이지일 때는 페이지 타이틀로 업데이트
      dispatch(setHeaderTitle(pageTitle[location.pathname]));
    }
  }, [matchedLocation, location.pathname, dispatch]);

  return (
    <>
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

        {/* 가운데 타이틀 영역 */}
        {location.pathname === "/" ? (
          // ===== 현재 주소가 메인 '/' 인 경우 -> 현재(검색)위치 =====
          <div className="header-center" onClick={() => headerTitleClick()}>
            <div className="header-icon-wrapper">
              <LiaSearchLocationSolid size={"24px"} color="#777" />
            </div>
            <span className="header-title">{headerTitle}</span>
            {measuringOn && measuringStation && (
              <span className="header-title-info">
                {measuringStation} 측정소
              </span>
            )}
          </div>
        ) : (
          // ===== 현재 주소가 메인'/' 가 아닌 경우 -> 페이지 제목 =====
          <div className="header-title-wrapper">

            <p className="header-title">{headerTitle}</p>
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
