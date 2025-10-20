// 드래그앤드롭 dnd-kit 관련
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./EditBookmark.css";

import { useDispatch, useSelector } from "react-redux";
import { IoMdSearch } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

import {
  addBookmark,
  removeBookmark,
  setBookmarkFilteredList,
  setBookmarkSearchInput,
  updateBookmarkedRegions,
  saveBookmarkOrder,
} from "../../store/slices/bookmarkSlice.js";
import { useEffect, useState, useRef } from "react";
import { LOCATION_LIST } from "../../constants/locationList.js";
import { stringUtils } from "../../utils/stringUtil";
// import { localStorageUtil } from '../../utils/localStorageUtil.js';
// toast관련
import Toast from "../commons/Toast";
import { getSearchLocationForBookmark } from "../../store/thunks/bookmarkThunk.js";
// import { div } from 'framer-motion/client';

// 각 북마크 아이템을 위한 컴포넌트
// useSortable을 추상화해서 재사용 가능하게 만들기 위해 따로 빼놓았습니다!
function SortableItem(props) {
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
    <>
      <div
        className="bookmark-item"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <div className="bookmark-hamburger">&#x2630; {/* 햄버거 아이콘 */}</div>
        <span className="bookmark-name">{props.id}</span>

        <span
          className="bookmark-icon"
          onClick={() => props.onToggle(props.id)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {props.isBookmarked ? (
            <FaStar color="var(--deep-blue)" />
          ) : (
            <CiStar color="var(--deep-blue)" />
          )}
        </span>
      </div>
    </>
  );
}

function EditBookmark() {
  const dispatch = useDispatch();

  // ===== 전역 state =====
  const bookmarkedRegions = useSelector(
    (state) => state.bookmarkSlice.bookmarkedRegions
  );
  const bookmarkSearchInput = useSelector(
    (state) => state.bookmarkSlice.bookmarkSearchInput
  );
  const bookmarkFilteredList = useSelector(
    (state) => state.bookmarkSlice.bookmarkFilteredList
  );

  // 알림창용 state, ref
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef(null);

  // 편집중인 북마크 목록 관리용
  const [editingList, setEditingList] = useState(bookmarkedRegions);

  // 토글로 북마크 추가할 때마다 editingList로 저장
  useEffect(() => {
    setEditingList(bookmarkedRegions);
  }, [bookmarkedRegions]);

  // 변경될 때 순서 유지, 리스트 업뎃(집 가서 수정할 부분)
  // useEffect(() => {
  //   // 항목 순서 유지
  //   const editingSet = new Set(editingList.map(item => item.region));
  //   // 목록o 리스트 없는 것 찾기
  //   const newItems = bookmarkedRegions.fillter(item => !editingSet.has(item.region));
  //   // 목록기준 삭제항목 제거
  //   const updatedList = editingList.fillter(item => 
  //     bookmarkedRegions.some(reduxItem => reduxItem.region === item.region)
  //   );
  //     if (newItems.length > 0) {
  //     setEditingList([...updatedList, ...newItems]);
  //   } else {
  //     setEditingList(updatedList);    
  // }
  // }, [bookmarkedRegions]);

  // 원본 목록과 저장 여부를 추적하기 위한 ref 생성
  // const originalBookmarks = useRef(null);
  // const bookmarkSaved = useRef(false);

  // 컴포넌트 처음 렌더링될 때, 페이지를 벗어날 때 동작
  // useEffect(() => {
  //   // 컴포넌트 렌더링 시, 현재 "순서"를 원본으로 ref에 저장
  //   originalBookmarks.current = bookmarkedRegions;
  //   // 저장 상태를 false로 초기화
  //   bookmarkSaved.current = false;

  //   // cleanup함수 : 컴포넌트가 화면에서 사라질 때 실행
  //   return () => {
  //     // 저장버튼을 누르지 않고 페이지를 나갔다면, "순서"만 원본으로 되돌림
  //     if (!bookmarkSaved.current) {
  //       dispatch(updateBookmarkedRegions(originalBookmarks.current));
  //     }
  //   }
  // }, [dispatch]);

  // // 컴포넌트 처음 렌더링될 때, 페이지를 벗어날 때 동작
  // useEffect(() => {
  //   // 컴포넌트 렌더링 시, 현재 상태를 원본으로 ref에 저장
  //   originalBookmarks.current = bookmarkedRegions;

  //   // cleanup함수 : 컴포넌트가 화면에서 사라지리 때 실행
  //   return () => {
  //     // 저장버튼을 누르지 않을 시
  //     if (!bookmarkSaved.current) {
  //       // 원본으로 되돌림
  //       dispatch(updateBookmarkedRegions(originalBookmarks.current));
  //     }
  //   }
  // }, []); // 빈배열: 마운트, 언마운트 시 한 번만 실행

  // dnd 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // 드래그를 시작하기 위해 필요한 마우스 움직임 거리(단위:px)
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      // 터치로 사용
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    })
  );

  // 드래그 종료시
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = bookmarkedRegions.findIndex(
        (item) => item.region === active.id
      );
      const newIndex = bookmarkedRegions.findIndex(
        (item) => item.region === over.id
      );
      // arrayMove 사용 새로운 순서 배열 생성
      const newOrder = arrayMove(editingList, oldIndex, newIndex);
      // updateBookmarkedRegions 액션 호출
      // dispatch(updateBookmarkedRegions(newOrder));
      // 로컬스토리지 업뎃
      setEditingList(newOrder);
    }
  }

  // ======================================================
  // ||     useEffect : 북마크 검색어에 따라
  // ======================================================
  useEffect(() => {
    // ===== CASE.1 검색어 없을 경우 =====
    //        -> 빈 배열 반환
    if (bookmarkSearchInput.trim() === "") {
      dispatch(setBookmarkFilteredList([]));
      return;
    }
    // ===== CASE.2 검색어 있을 경우 =====
    //        -> 1. 띄어쓰기를 제거해서 매칭된 배열 반환
    const filteredResult = LOCATION_LIST.filter((location) => {
      const locationNoSpace = stringUtils.removeSpaces(location);
      const inputNoSpace = stringUtils.removeSpaces(bookmarkSearchInput);
      return locationNoSpace.includes(inputNoSpace);
    });
    dispatch(setBookmarkFilteredList(filteredResult));
  }, [bookmarkSearchInput, dispatch]);

  // ======================================================
  // ||     useEffect : 언마운트 마다, 검색어 초기화
  // ======================================================
  useEffect(() => {
    return () => {
      dispatch(setBookmarkSearchInput(""));
    };
  }, []);

  // ======================================================
  // ||     handling 관련 함수
  // ======================================================

  /**
   * bookmarkedRegions에 추가되어있는지 아닌지 true/false 반환
   * @param {string} item : 검색한 지역
   * @returns {boolean}
   */
  const isBookmarked = (item) => {
    return bookmarkedRegions.some(
      (bookmarkeditem) => bookmarkeditem.region === item
    );
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
        const result = await dispatch(
          getSearchLocationForBookmark(item)
        ).unwrap();
        dispatch(
          addBookmark({
            region: item,
            stationName: result.nearestStation.stationName,
          })
        );
        console.log("북마크 추가에 성공했습니다. ", bookmarkedRegions);
      } catch (error) {
        console.error(
          "북마크에 추가한 지역의 측정소를 찾지 못했습니다. ",
          error
        );
      }
    }
  };

  /**
   * 저장하기 버튼 클릭 시, 현재 상태를 localStorage에 저장
   */
  const handleSave = () => {
    // redux에 순서 저장 액션을 보냄
    dispatch(saveBookmarkOrder(editingList || []));
    // 저장했음을 표시 (페이지를 벗어날 때 순서를 되돌리지 않도록!)
    // bookmarkSaved.current = true;
    // 현재 상태를 localStorage에 저장

    // 기존 타이머가 있으면 취소
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    // 알림표시
    setShowToast(true);
    // 2초 뒤에 토스트 숨김 타이머
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        <div className="bookmark-container">
          {/* 검색 영역 */}
          <div className="bookmark-search-container">
            <p className="bookmark-title">내 장소 추가하기</p>
            <div className="bookmark-search-input-btn">
              <input
                className="bookmark-search-input"
                onChange={(e) =>
                  dispatch(setBookmarkSearchInput(e.target.value))
                }
                type="text"
              />
              <button className="bookmark-search-btn" type="button">
                <IoMdSearch color="#333" />
              </button>
            </div>
            {/* 검색 결과 영역 */}
            <motion.div
              className="bookmark-filtered-conatiner"
              initial={{ height: 0, minHeight: 0, opacity: 0 }}
              animate={{
                height: bookmarkFilteredList.length > 0 ? "auto" : 0,
                minHeight: bookmarkFilteredList.length > 0 ? 50 : 0,
                opacity: bookmarkFilteredList.length > 0 ? 1 : 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {bookmarkFilteredList.length > 0 &&
                bookmarkFilteredList.map((filteredItem) => (
                  <div className="bookmark-filtered-item" key={filteredItem}>
                    <span
                      className="bookmark-icon"
                      onClick={() => {
                        toggleBookmark(filteredItem); // 2. item 값 그대로 전달!
                      }}
                    >
                      {isBookmarked(filteredItem) ? (
                        <FaStar color="var(--deep-blue)" />
                      ) : (
                        <CiStar color="var(--deep-blue)" />
                      )}
                    </span>
                    <span> {filteredItem}</span>
                  </div>
                ))}
            </motion.div>
          </div>
          <div className="bookmark-list-container">
            <p className="bookmark-title">내 장소</p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                // 각 아이템의 id배열 전달
                items={bookmarkedRegions.map((item) => item.region)}
                strategy={verticalListSortingStrategy}
              >
                <div className="bookmark-items-container">
                  {bookmarkedRegions.length > 0 &&
                    bookmarkedRegions.map((item) => (
                      <SortableItem
                        key={item.region}
                        id={item.region}
                        stationName={item.stationName}
                        isBookmarked={isBookmarked(item.region)}
                        onToggle={toggleBookmark}
                      />
                    ))}
                  {bookmarkedRegions.length === 0 && (
                    <div className="bookmark-nothing">
                      <p>저장된 내 장소가 없습니다.</p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>

            {/* 내 장소 저장하기 버튼 */}
            <div className="bookmark-save-btn-container">
              <button
                className="bookmark-save-btn"
                type="button"
                onClick={handleSave}
              >
                저장하기
              </button>
              {/* 토스트 */}
              <Toast message="저장되었습니다!" show={showToast} />
            </div>
          </div>
        </div>
      </AnimatePresence>
    </>
  );
}

export default EditBookmark;
