import "./LocationSearch.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdSearch } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

import { setSearchFlg } from "../../store/slices/headerSlice.js";
import {
  setFilteredLocationList,
  setSearchInput,
  setSearchKeyword,
} from "../../store/slices/locationSearchSlice.js";
import { LOCATION_LIST } from "../../constants/locationList.js";
import { stringUtils } from "../../utils/stringUtil.js";
import {
  addBookmark,
  removeBookmark,
} from "../../store/slices/bookmarkSlice.js";

function LocationSearch() {
  const dispatch = useDispatch();

  // ===== 전역 State =====
  const searchFlg = useSelector((state) => state.headerSlice.searchFlg);
  const searchInput = useSelector(
    (state) => state.locationSearchSlice.searchInput
  );
  const filteredLocationList = useSelector(
    (state) => state.locationSearchSlice.filteredLocationList
  );
  const bookmarkedRegions = useSelector(
    (state) => state.bookmarkSlice.bookmarkedRegions
  );


  // ======================================================
  // ||     검색어 관련 함수
  // ======================================================

  /**
   * 검색어 저장 + OML 창 사라짐 + 실시간 인풋 초기화
   */
  const handleSelectLocation = (searchWord) => {
    dispatch(setSearchKeyword(searchWord));
    dispatch(setSearchFlg(false));
  };

  // ======================================================
  // ||     북마크 관련 함수
  // ======================================================

  /**
   * bookmarkedRegions에 추가되어있는지 아닌지 true/false 반환
   * @param {string} item : 검색한 지역
   * @returns {boolean}
   */
  const isBookmarked = (item) => {
    return bookmarkedRegions.some((bookmarkeditem) => bookmarkeditem === item);
  };

  /**
   * 해당 지역이 북마크되어있다면 (bookmarkedRegions에 있다면) → 북마크에서 삭제 /
   * 해당 지역이 북마크되어있지 않다면 (bookmarkedRegions에 없다면) → 북마크에 추가
   * @param {string} item : 검색한 지역
   */
  const toggleBookmark = (item) => {
    if (isBookmarked(item)) {
      dispatch(removeBookmark(item));
      // console.log("제거:", item);
    } else {
      dispatch(addBookmark(item));
      // console.log("추가:", bookmarkedRegions);
    }
  };



  // ===== useEffect - 키워드(검색어)에 따른 변화
  useEffect(() => {
    // ===== 1. 검색어 없을 경우 -> 빈 배열 반환 =====
    if (searchInput.trim() === "") {
      dispatch(setFilteredLocationList([]));
      return;
    }

    // ===== 2. 검색어 있을 경우 -> 띄어쓰기 제거 해서 데이터와 비교 후, 포함된 값을 배열로 반환
    const filteredResult = LOCATION_LIST.filter((location) => {
      // 데이터 배열, 실시간 입력값 → 띄어쓰기 제거
      const locationNoSpace = stringUtils.removeSpaces(location);
      const inputNoSpace = stringUtils.removeSpaces(searchInput);
      // 띄어쓰기 제거한 값 입력값이 포함된 데이터 배열 반환
      return locationNoSpace.includes(inputNoSpace);
    });

    dispatch(setFilteredLocationList(filteredResult));
  }, [searchInput, dispatch]);

  // ====== useEffect - 검색창 여닫을 때마다(searchFlg) 변화 지정
  useEffect(() => {
    if (!searchFlg) {
      // 검색창 닫힐 때마다
      dispatch(setSearchInput("")); // 인풋 비우기
      dispatch(setFilteredLocationList([])); // 리스트 비우기
    }
  }, [searchFlg, dispatch]); // searchFlg 변화 감지!

  // ===== 마운트, 언마운트 설정 =====
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    }
  })


  return (
    <>
      <AnimatePresence>
        {searchFlg && (
          <>
            {/* 반투명 효과 */}
            <motion.div
              className="header-OML-background header-OML-container-fixed"
              onClick={() => dispatch(setSearchFlg(false))}
              // == 애니메이션 효과 ============
              initial={{
                opacity: 0,
                backdropFilter: "blur(0px) brightness(100%)",
              }}
              animate={{
                opacity: 1,
                backdropFilter: "blur(3px) brightness(80%)", // 블러 + 어둡게!
              }}
              exit={{
                opacity: 0,
                backdropFilter: "blur(0px) brightness(100%)",
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            />

            {/* 컨텐츠 영역 */}
            <motion.div
              className="header-OML-container header-OML-container-fixed"
              // 배경 클릭으로 searchFlg(false) 전파 막기
              onClick={(e) => e.stopPropagation()}
              // == 애니메이션 효과 ============
              initial={{
                opacity: 0,
                filter: "blur(10px)",
                y: -500,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
              }}
              exit={{
                opacity: 0,
                filter: "blur(10px)",
                y: -500,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {/* 검색 영역 */}
              <div className="header-search-container">
                <p className="header-search-title">장소 찾기</p>
                <div className="header-search-input-btn header-flex-style">
                  <input
                    className="header-search-input"
                    onChange={(e) => dispatch(setSearchInput(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSelectLocation(searchInput);
                      }
                    }}
                    type="text"
                  />
                  <button
                    className="header-search-btn"
                    onClick={() => handleSelectLocation(searchInput)}
                  >
                    <IoMdSearch color="#333" />
                  </button>
                </div>
              </div>

              {/* 결과 영역 */}
              <div className="header-search-result-container">
                {/* <p className='header-search-title'>검색 결과</p> */}
                <motion.div
                  className="header-search-list header-flex-style"
                  initial={{ height: 0, minHeight: 0, opacity: 0 }}
                  animate={{
                    height: filteredLocationList.length > 0 ? "auto" : 0,
                    minHeight: filteredLocationList.length > 0 ? 50 : 0,
                    opacity: filteredLocationList.length > 0 ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  {filteredLocationList.length > 0 &&
                    filteredLocationList.map((item) => (
                      <div
                        className="header-search-result"
                        key={item}
                        onClick={() => handleSelectLocation(item)}
                      >
                        <span
                          className="bookmark-icon"
                          onClick={(e) => {
                            e.stopPropagation(); // 1. div로 이벤트 전파 막기!
                            toggleBookmark(item); // 2. item 값 그대로 전달!
                          }}
                        >
                          {isBookmarked(item) ? (
                            <FaStar color="var(--deep-blue)" />
                          ) : (
                            <CiStar color="var(--deep-blue)" />
                          )}
                        </span>
                        <span> {item}</span>
                      </div>
                    ))}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default LocationSearch;
