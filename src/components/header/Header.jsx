import "./Header.css";
import logoTitle from "../../assets/logo-title-200.svg";

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
import { getCurrentLocation } from "../../store/thunks/locationThunk.js";
import { setMatchedLocation } from "../../store/slices/locationSlice.js";
import { stringUtils } from "../../utils/stringUtil.js";

// 헤더에 들어가는 아이콘
import { HiChevronLeft } from "react-icons/hi2";
import { VscMenu } from "react-icons/vsc";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const headerTitle = useSelector((state) => state.headerSlice.headerTitle);
  const searchFlg = useSelector((state) => state.headerSlice.searchFlg);

  const searchKeyword = useSelector(
    (state) => state.locationSearchSlice.searchKeyword
  );
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

  useEffect(() => {
    // 특정 path값 존재 시, 타이틀 출력
    if (pageTitle[location.pathname]) {
      dispatch(setHeaderTitle(pageTitle[location.pathname]));
      return;
    }
    // 메인 페이지 아닐 시, 함수 종료
    if (location.pathname !== "/") {
      return;
    }

    // 메인페이지 + 검색어 있을 시!!!
    // 매칭된 검색어 담을 변수
    let foundLocation = null;
    if (searchKeyword?.trim) {
      // 검색어로 데이터에서 찾기
      // 검색어 띄어쓰기 제거
      const keywordNoSpace = stringUtils.removeSpaces(searchKeyword);
      foundLocation = LOCATION_LIST.find((location) => {
        // 장소 리스트 띄어쓰기 제거
        const locationNoSpace = stringUtils.removeSpaces(location);
        // (띄어쓰기 제거한) 입력값이 포함된 데이터 반환
        return locationNoSpace.includes(keywordNoSpace);
      });
      // 데이터에서 검색어 값이 있다면 타이틀로 출력
      if (foundLocation) {
        dispatch(setHeaderTitle(foundLocation));
        dispatch(setMatchedLocation(foundLocation));
        return;
      } else {
        console.log(
          "검색어가 없거나 매칭 지역이 없습니다. 현재위치를 가져옵니다."
        );
        // 매칭된 지역이 없을 경우, 현재 위치 가져오기 + 현재 위치를 기반으로 타이틀 출력하기
        dispatch(getCurrentLocation());
        // dispatch(setHeaderTitle(currentRegion));
      }
    } else {
      // 메인페이지 + 검색어 없을 시,
      console.log("검색어가 없습니다. 현재위치를 가져옵니다.");
      // 현재 위치 가져오기 + 현재 위치를 기반으로 타이틀 출력하기
      dispatch(getCurrentLocation());
      // dispatch(setHeaderTitle(currentRegion));
    }
    // 현재 위치 정보 있고, (매칭에 실패했거나, 검색어 없음)
    if (currentRegion && !foundLocation) {
      dispatch(setHeaderTitle(currentRegion));
    }
  }, [location.pathname, searchKeyword, currentRegion]);

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
          {measuringOn && <span className="header-title-info">ooo 측정소</span>}
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
