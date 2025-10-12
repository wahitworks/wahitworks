import './EditBookmark.css';

import { useDispatch, useSelector } from 'react-redux';
import { IoMdSearch } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';

import { setBookmarkFilteredList, setBookmarkSearchInput, setBookmarkSearchKeyword } from '../../store/slices/bookmarkSlice.js';
import { useEffect } from 'react';
import { LOCATION_LIST } from '../../constants/locationList.js';
import { stringUtils } from '../../utils/stringUtil';
import { div } from 'framer-motion/client';

function EditBookmark () {
  const dispatch = useDispatch();
  const bookmarkedRegions = useSelector(state => state.bookmarkSlice.bookmarkedRegions);
  const bookmarkSearchInput = useSelector(state => state.bookmarkSlice.bookmarkSearchInput);
  const bookmarkFilteredList = useSelector(state => state.bookmarkSlice.bookmarkFilteredList);

  console.log('input: ', bookmarkSearchInput);

  useEffect(() => {
    // 검색어 없을 경우, 빈 배열 반환
    if(bookmarkSearchInput.trim() === '') {
      dispatch(setBookmarkFilteredList([]));
      return;
    }
    // 위의 조건이 실행되지 않을 경우, 아래 이어서 실행
    const filteredResult = LOCATION_LIST.filter(location => {
      // 데이터 배열, 실시간 입력값 → 띄어쓰기 제거
      const locationNoSpace = stringUtils.removeSpaces(location);
      const inputNoSpace = stringUtils.removeSpaces(bookmarkSearchInput);
      // 입력값이 포함된 데이터 배열 반환
      return locationNoSpace.includes(inputNoSpace); 
    });
    
    dispatch(setBookmarkFilteredList(filteredResult));
  }, [bookmarkSearchInput, dispatch])
  

  return(
    <>
    <AnimatePresence>
    <div className="bookmark-container">
      {/* 검색 영역 */}
      <div className="bookmark-search-container">
        <p className='bookmark-title'>내 장소 추가하기</p>
        <div className="bookmark-search-input-btn">
          <input className="bookmark-search-input" 
            onChange={e => dispatch(setBookmarkSearchInput(e.target.value))} type="text" />
          <button className='bookmark-search-btn' type='button'><IoMdSearch color="#333"/></button>
        </div>
        {/* 검색 결과 영역 */}
        <motion.div
          className="bookmark-filtered-conatiner"
          initial={{ height: 0, minHeight: 0, opacity: 0 }}
          animate={{
            height: bookmarkedRegions.length > 0 ? 'auto' : 0,
            minHeight: bookmarkedRegions.length > 0 ? 50 : 0,
            opacity: bookmarkedRegions.length > 0 ? 1 : 0
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {
            bookmarkFilteredList.length > 0 && bookmarkFilteredList.map(filteredItem => (
              <div className="bookmark-filtered-item">
                {filteredItem}
              </div>
            ))
          }
        </motion.div>
      </div>
      {/* 북마크 리스트 영역 todo: drag and drop */}
      <div className='bookmark-list-container'>
        <p className='bookmark-title'>내 장소</p>
        <div className='bookmark-items-container'>
        { bookmarkedRegions.length > 0 && bookmarkedRegions.map(region => (
            <div className="bookmark-item" key={region}>
              {/* todo: 북마크 아이콘 */}
              <p>{region}</p> 
            </div>
          ))
        }
        {
          bookmarkedRegions.length === 0 &&
          <div className="bookmark-nothing">북마크가 없습니다.</div>
        }
        </div>
      </div>
    </div>
    </AnimatePresence>
    </>
  )
};

export default EditBookmark;