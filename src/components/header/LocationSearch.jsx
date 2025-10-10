import './LocationSearch.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import { setSearchFlg } from '../../store/slices/headerSlice.js';
import { setFilteredLocationList, setSearchInput, setSearchKeyword } from '../../store/slices/locationSearchSlice.js';
import { LOCATION_LIST } from '../../constants/locationList.js';
import { stringUtils } from '../../utils/stringUtil.js';

function LocationSearch () {
  const dispatch = useDispatch();

  const searchFlg = useSelector(state => state.headerSlice.searchFlg);
  const searchInput = useSelector(state => state.locationSearchSlice.searchInput);
  const searchKeyword = useSelector(state => state.locationSearchSlice.searchKeyword);
  const filteredLocationList = useSelector(state => state.locationSearchSlice.filteredLocationList);

  // console.log('실시간 인풋: ', searchInput);
  
  /**
   * 클릭 시, 검색어 저장 + OML 창 사라짐 + 실시간 인풋 초기화
   */
  const handleSelectLocation = (searchWord) => {
    dispatch(setSearchKeyword(searchWord));
    dispatch(setSearchFlg(false));
  }

  console.log('검색어: ', searchKeyword);

  useEffect(() => {
    // 검색어 없을 경우, 빈 배열 반환
    if(searchInput === '') {
      dispatch(setFilteredLocationList([]));
      return;
    }
    // 위의 조건이 실행되지 않을 경우, 아래 이어서 실행
    const filteredResult = LOCATION_LIST.filter(location => {
      // 데이터 배열, 실시간 입력값 → 띄어쓰기 제거
      const locationNoSpace = stringUtils.removeSpaces(location);
      const inputNoSpace = stringUtils.removeSpaces(searchInput);
      // 띄어쓰기 제거한 값 입력값이 포함된 데이터 배열 반환
      return locationNoSpace.includes(inputNoSpace); 
    });
    
    dispatch(setFilteredLocationList(filteredResult));
  }, [searchInput, dispatch])

  // console.log('자동완성 담은 배열:', filteredLocationList)

  useEffect(() => {
    if (!searchFlg) { // 검색창 닫힐 때마다
      dispatch(setSearchInput('')); // 인풋 비우기
      dispatch(setFilteredLocationList([])); // 리스트 비우기
    }
  }, [searchFlg, dispatch]); // searchFlg 변화 감지!

  return (
    <>
      <AnimatePresence>
        {searchFlg &&
          <>
            {/* 반투명 효과 */}
            <motion.div className="header-OML-background header-OML-container-fixed" onClick={() => dispatch(setSearchFlg(false))}
              initial={{
                opacity: 0,
                backdropFilter: "blur(0px) brightness(100%)"
              }}
              animate={{
                opacity: 1,
                backdropFilter: "blur(3px) brightness(80%)"  // 블러 + 어둡게!
              }}
              exit={{
                opacity: 0,
                backdropFilter: "blur(0px) brightness(100%)"
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut"
              }}
            />

            {/* 컨텐츠 담을 진짜 영역 */}
            <motion.div className="header-OML-container header-OML-container-fixed" 
          // 배경 클릭으로 searchFlg(false) 전파 막기
          onClick={(e) => e.stopPropagation()}
          // -- 애니메이션 효과 --------------------
          initial={{ 
            opacity: 0,
            filter: "blur(10px)",
            y: -500
          }}
          animate={{ 
            opacity: 1,
            filter: "blur(0px)",
            y: 0
          }}
          exit={{ 
            opacity: 0,
            filter: "blur(10px)",
            y: -500
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {/* 검색 영역 */}
          <div className="header-search-container">
            <p className='header-search-title'>장소 찾기</p>
            <div className="header-search-input-btn header-flex-style">
              <input className='header-search-input' 
                onChange={e => dispatch(setSearchInput(e.target.value))} 
                onKeyDown={e => { if(e.key === 'Enter'){handleSelectLocation(searchInput)} }} type="text" />
              <button className="header-search-btn" onClick={() => handleSelectLocation(searchInput)}>🔍</button>
            </div>
          </div>

          {/* 결과 영역 */}
          <div className="header-search-result-container">
            <p className='header-search-title'>검색 결과</p>
            <div className="header-search-list header-flex-style">
              { filteredLocationList.length > 0 && filteredLocationList.map( item =>
                <div className="header-search-result" key={item} onClick={() => handleSelectLocation(item)}>
                  ⭐ {item}
                </div>
                )
              }
            </div>
          </div>
        </motion.div>
          </>
        }
      </AnimatePresence>
    </>
  )
};

export default LocationSearch;