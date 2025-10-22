import "./LocationSearch.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// 아이콘
import { IoMdSearch } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import { FiEdit3 } from "react-icons/fi";

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
import { getSearchLocationForBookmark } from "../../store/thunks/bookmarkThunk.js";

function LocationSearch() {
  // ====== Hook =====
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const headerTitle = useSelector(state => state.headerSlice.headerTitle);


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
    return bookmarkedRegions.some((bookmarkeditems) => bookmarkeditems.region === item);
  };

  /**
   * 해당 지역이 북마크되어있다면 (bookmarkedRegions에 있다면) → 북마크에서 삭제 /
   * 해당 지역이 북마크되어있지 않다면 (bookmarkedRegions에 없다면) → 북마크에 추가
   * @param {string} item : 검색한 지역
   */
  const toggleBookmark = async (item) => {
    // ===== CASE.1 이미 북마크 리스트에 존재한다면 ===
    if (isBookmarked(item)) {
      // 북마크에서 제거
      dispatch(removeBookmark(item));
      // console.log("제거:", item);

    // ===== CASE.2 북마크 리스트에 존재하지 않는다면 ===
    } else {
      try {
        // unwrap(): 성공 -> payload반환, 실패 -> error throw
        const result = await dispatch(getSearchLocationForBookmark(item)).unwrap();
        dispatch(addBookmark({
          region: item, 
          stationName: result.nearestStation.stationName,
          nickname: '',
        }));
        console.log("북마크 추가에 성공했습니다. ", bookmarkedRegions);

      } catch (error) {
        console.error("북마크에 추가한 지역의 측정소를 찾지 못했습니다. ", error);
      }
    }
  };

  // ======================================================
  // ||     그 외
  // ======================================================
  
  /**
   * 북마크 편집 페이지로 이동하는 함수
   */
  const goBookmark = () => {
    dispatch(setSearchFlg(false));
    navigate('/editbookmark');
  }


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
      
  // ===== 마운트, 언마운트 - 스크롤 방지 설정 =====
  // ===== 언마운트 - 검색창 닫을 때마다(searchFlg = false) input, list
  // ===== 마운트 - 검색창 열릴 때 현재 위치를 searchInput에 설정 =====
  useEffect(() => {
    dispatch(setSearchInput(headerTitle)); // 현재 위치를 input에 표시
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
      dispatch(setSearchInput("")); // 인풋 비우기
      dispatch(setFilteredLocationList([])); // 리스트 비우기
    }
  }, [])
  

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
              {/* 빈공간영역 */}
              <div className="header-search-empty"></div>
              
              {/* 검색 영역 */}
              <div className="header-search-container">
                <p className="header-search-title">장소 찾기</p>
                <div className="header-search-input-btn header-flex-style">
                  <input
                    className="header-search-input"
                    value={searchInput}
                    onChange={(e) => dispatch(setSearchInput(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSelectLocation(searchInput);
                      }
                    }}
                    type="text"
                  />
                  <div 
                    className="header-search-cancel-btn"
                    onClick={() => dispatch(setSearchInput(''))}
                  >
                    <HiMiniXMark color="#333" />
                  </div>
                  <div
                    className="header-search-btn"
                    onClick={() => handleSelectLocation(searchInput)}
                  >
                    <IoMdSearch color="#333" />
                  </div>
                </div>
              </div>

              {/* 결과 영역 */}
              <div className="header-search-result-container">
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
                        <span
                          className="header-search-result-item"
                          onClick={(e) => {e.stopPropagation(); handleSelectLocation(item)}}
                        >{item}</span>
                      </div>
                    ))}
                </motion.div>
              </div>
            
              {/* 내 장소 */}
              <div className="header-mylocation-container">
                <div className="header-mylocation-title-container">
                  <span className='header-search-title'>내 장소</span>
                  <span className="header-mylocation-title-icon" onClick={() => goBookmark()}><FiEdit3 color="var(--deep-blue)" /></span>
                </div>
                <motion.div
                  className="header-search-list header-flex-style"
                  initial={{ height: 0, minHeight: 0, opacity: 0 }}
                  animate={{
                    height: bookmarkedRegions.length > 0 ? "auto" : 0,
                    minHeight: bookmarkedRegions.length > 0 ? 50 : 0,
                    opacity: bookmarkedRegions.length > 0 ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  {
                    bookmarkedRegions.length > 0 && bookmarkedRegions.map( item =>
                      <div
                        className="header-search-result"
                        key={item.region}
                      >
                        <span
                          className="bookmark-icon"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            toggleBookmark(item.region); 
                          }}
                        >
                          {isBookmarked(item.region) ? (
                            <FaStar color="var(--deep-blue)" />
                          ) : (
                            <CiStar color="var(--deep-blue)" />
                          )}
                        </span>
                        {
                          // 닉네임 여부에 따라 출력 방식
                          item.nickname ? (
                            <span
                              className="header-search-result-item"
                              onClick={(e) => {e.stopPropagation(); handleSelectLocation(item.region)}}
                            >
                              {item.nickname} <span className="header-search-text-gray">{item.region}</span>
                            </span>

                          ) : (
                            <span
                              className="header-search-result-item"
                              onClick={(e) => {e.stopPropagation(); handleSelectLocation(item.region)}}
                            >
                              {item.region}
                            </span>
                          )
                        }
                      </div>
                    )
                  }
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
