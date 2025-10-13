// 드래그앤드롭 dnd-kit 관련
import { 
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors, } from '@dnd-kit/core';
import { 
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates, 
    verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './EditBookmark.css';

import { useDispatch, useSelector } from 'react-redux';
import { IoMdSearch } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

import { addBookmark, removeBookmark, setBookmarkFilteredList, setBookmarkSearchInput, updateBookmarkedRegions, } from '../../store/slices/bookmarkSlice.js';
import { useEffect } from 'react';
import { LOCATION_LIST } from '../../constants/locationList.js';
import { stringUtils } from '../../utils/stringUtil';
// import { div } from 'framer-motion/client';

// 각 북마크 아이템을 위한 컴포넌트
// useSortable을 추상화해서 재사용 가능하게 만들기 위해 따로 빼놓았습니다!
function SortableItem (props) {
  const {
      attributes,
      listeners, // 드래그 동작 담당
      setNodeRef,
      transform,
      transition,
  } = useSortable({ id: props.id });

  const style = {
      transform: CSS.Transform.toString(transform),
      transition,
  };

  return (
      <div className="bookmark-item" ref={setNodeRef} style={style} {...attributes}>
        <div className="bookmark-hamburger" {...listeners}>&#x2630; {/* 햄버거 아이콘 */}</div>
        <span>{props.id}</span>
        <span className="bookmark-icon" onClick={() => props.onToggle(props.id)}>
        {props.isBookmarked ? <FaStar color='var(--deep-blue)' /> : <CiStar color='var(--deep-blue)' />}
        </span>
      </div>
  );
}

function EditBookmark () {
  const dispatch = useDispatch();
  const bookmarkedRegions = useSelector(state => state.bookmarkSlice.bookmarkedRegions);
  const bookmarkSearchInput = useSelector(state => state.bookmarkSlice.bookmarkSearchInput);
  const bookmarkFilteredList = useSelector(state => state.bookmarkSlice.bookmarkFilteredList);

  console.log('input: ', bookmarkSearchInput);

  // dnd 센서 설정
  const sensors = useSensors(
        useSensor(PointerSensor, {
          // 드래그를 시작하기 위해 필요한 마우스 움직임 거리(단위:px)
          activationConstraint: {
            delat: 100,
            tolerance: 5,
          },
        }),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 드래그 종료시
    function handleDragEnd(event) {
      const { active, over } = event;

      if (active.id !== over.id) {
        const oldIndex = bookmarkedRegions.findIndex((item) => item === active.id);
        const newIndex = bookmarkedRegions.findIndex((item) => item === over.id);
        // arrayMove 사용 새로운 순서 배열 생성
        const newOrder = arrayMove(bookmarkedRegions, oldIndex, newIndex);
        // updateBookmarkedRegions 액션 호출
        dispatch(updateBookmarkedRegions(newOrder));
      }
    }

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
  
  useEffect(() => {
    // 언마운트 시, 검색어 초기화 설정
    return () => {
      dispatch(setBookmarkSearchInput(''));
    }
  }, [])

  /**
   * bookmarkedRegions에 추가되어있는지 아닌지 true/false 반환
   * @param {string} item : 검색한 지역
   * @returns {boolean} 
   */
  const isBookmarked = (item) => {
    return bookmarkedRegions.some(bookmarkeditem => bookmarkeditem === item)
  };

  /**
   * 해당 지역이 북마크되어있다면 (bookmarkedRegions에 있다면) → 북마크에서 삭제 /
   * 해당 지역이 북마크되어있지 않다면 (bookmarkedRegions에 없다면) → 북마크에 추가
   * @param {string} item : 검색한 지역
   */
  const toggleBookmark = (item) => {
    if(isBookmarked(item)) {
      dispatch(removeBookmark(item))
      console.log('제거:', item);
    } else {
      dispatch(addBookmark(item));
      console.log('추가:', bookmarkedRegions);
    }
  };

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
            height: bookmarkFilteredList.length > 0 ? 'auto' : 0,
            minHeight: bookmarkFilteredList.length > 0 ? 50 : 0,
            opacity: bookmarkFilteredList.length > 0 ? 1 : 0
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {
            bookmarkFilteredList.length > 0 && bookmarkFilteredList.map(filteredItem => (
              <div className="bookmark-filtered-item" key={filteredItem}>
                <span
                  className="bookmark-icon"
                  onClick={() => {
                    toggleBookmark(filteredItem); // 2. item 값 그대로 전달!
                  }}
                >
                  {isBookmarked(filteredItem) ? <FaStar color='var(--deep-blue)' /> : <CiStar color='var(--deep-blue)' />}
                </span>
                <span> {filteredItem}</span>
              </div>
            ))
          }
        </motion.div>
      </div>
      <div className='bookmark-list-container'>
        <p className='bookmark-title'>내 장소</p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext 
          // 각 아이템의 id배열 전달
          items={bookmarkedRegions}
          strategy={verticalListSortingStrategy}>
            <div className='bookmark-items-container'>
            { bookmarkedRegions.length > 0 && bookmarkedRegions.map((region) => (
              <SortableItem key={region} id={region} 
                isBookmarked={isBookmarked(region)} onToggle={toggleBookmark} />
              ))  
            }    
            {
              bookmarkedRegions.length === 0 &&
              <div className="bookmark-nothing">
                <p>
                  저장된 내 장소가 없습니다.
                </p>
              </div>
            }
        </div>
          </SortableContext>
        </DndContext>

        
        {/* 내 장소 저장하기 버튼 */}
          <div className="bookmark-save-btn-container">
            <button className='bookmark-save-btn' type="button">저장하기</button> 
          </div>          
        </div>
    </div>
    </AnimatePresence>
    </>
  )
};

export default EditBookmark;