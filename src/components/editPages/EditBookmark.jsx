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

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { IoMdSearch } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { GiSaveArrow } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { HiMiniXMark } from "react-icons/hi2";

import {
  addBookmark,
  removeBookmark,
  updateBookmarkedRegions,
  saveBookmarkOrder,
  updateBookmarkNickname,
} from "../../store/slices/bookmarkSlice.js";
import { LOCATION_LIST } from "../../constants/locationList.js";
import { stringUtils } from "../../utils/stringUtil.js";
// toast관련
import Toast from "../commons/Toast";
import { getSearchLocationForBookmark } from "../../store/thunks/bookmarkThunk.js";
// 북마크 닉네임 수정
import EditBookmarkNickname from "./EditBookmarkNickname.jsx";


// ====================================================
// ||     각 북마크 아이템을 위한 컴포넌트
// ====================================================

// useSortable을 추상화해서 재사용 가능하게 만들기 위해 따로 빼놓았습니다!
function SortableItem(props) {
  const dispatch = useDispatch()

  // 북마크 편집을 위한 로컬 state (useSortable보다 먼저 선언!)
  const [editNicknameFlg, setEditNicknameFlg] = useState(false)
  const [editNickname, setEditNickname] = useState(props.nickname)

  const {
    attributes,
    listeners, // 드래그 동작 담당
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props.id,
    disabled: editNicknameFlg, //  편집 모드일때 드래그 비활성화
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  /**
   * region을 받아서 해당하는 요소의 nickname을 수정하는 함수
   * @param {string} region : bookmarkedRegions 에 저장된 region
   */
  const handleSaveNickname = () => {
    // 1. Redux에 닉네임 업데이트
    dispatch(updateBookmarkNickname({
      region: props.id,
      nickname: editNickname
    }));
    // 2. 편집 모드 종료
    setEditNicknameFlg(false);
  }

  return (
    <>
      <div
        className="bookmark-item"
        ref={setNodeRef}
        style={style}
        {...attributes}
      >

        {/* ===== 드래그 가능 영역 ↓ ===== */}
        <div className="bookmark-drag-handle" {...listeners}>
          
          {/* 햄버거  */}
          {/* &#x2630; */}
          <div className="bookmark-hamburger">&#x2630;</div>

          {/* 이름 출력 영역 */}
          {editNicknameFlg ? (
            // ===== 편집 모드: input =====
            <div className="bookmark-name">
              <input
                type="text"
                className="bookmark-nickname-input bookmark-name"
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
                maxLength={6}
                placeholder={props.nickname ? props.nickname : props.id}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveNickname();
                  }
                }}
              />
              <p className="bookmark-name-gray">
                  {props.id}
              </p>
            </div>
          ) : (
            // ===== 일반 모드: 닉네임 유무에 따라 출력 =====
            props.nickname ? (
              // CASE.1 닉네임이 있는 경우 -> 닉네임 + 지역 출력
              <span className="bookmark-name">
                <p>{props.nickname}</p>
                <p className="bookmark-name-gray">{props.id}</p>
              </span>
            ) : (
              // CASW.2 닉네임이 없는 경우 -> 지역 출력
              <p className="bookmark-name">
                {props.id}
              </p>
            )
          )}
          </div>
        {/* ===== 드래그 가능 영역 ↑ ===== */}

        {/* 닉네임 편집 & 북마크 삭제 아이콘 - 드래그 완전히 분리, 클릭만 가능 */}
        <div className="bookmark-item-icon-container">
          {/* 북마크 편집 아이콘 */}
          {
            editNicknameFlg ? (
              // ===== 편집 모드 =====
              <>
                {/* 취소 아이콘 */}
                <span className="bookmark-item-icon" onClick={() => setEditNicknameFlg(false)}>
                  <MdOutlineCancel color="var(--deep-blue)" />
                </span>
                {/* 저장 아이콘 */}
                <span className="bookmark-item-icon" onClick={() => handleSaveNickname(props.id) }>
                  <GiSaveArrow color="var(--deep-blue)" />
                </span>
              </>
            ) : (
              // ===== 일반 모드 =====
                // 편집 모드로 바꿔주는 펜 아이콘
              <span className="bookmark-item-icon" onClick={() => setEditNicknameFlg(true)}>
                <FiEdit3 color="var(--deep-blue)" />
              </span>
            )
          }
          <span
            className="bookmark-item-icon"
            onClick={() => props.onToggle(props.id)}
          >
            {props.isBookmarked && <FaRegTrashAlt color="var(--deep-blue)" />}
          </span>
        </div>
      </div>

    </>
  );
}


// ====================================================
// ||     내 장소 관리 메인 컴포넌트
// ====================================================

function EditBookmark() {
  const dispatch = useDispatch();

  // ===== 전역 state =====
  const bookmarkedRegions = useSelector(
    (state) => state.bookmarkSlice.bookmarkedRegions
  );
  const nicknameEditFlg = useSelector(state => state.bookmarkSlice.nicknameEditFlg);

  // ===== 로컬 state =====
  // 검색 관련 (로컬로 변경!)
  const [searchInput, setSearchInput] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  // 편집중인 북마크 목록 관리용 (로컬 state - 드래그앤드롭 임시 저장)
  const [editingList, setEditingList] = useState(bookmarkedRegions);

  // 알림창용 state, ref
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef(null);


  // Redux의 bookmarkedRegions가 변경되면 editingList도 동기화
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
      const oldIndex = editingList.findIndex(
        (item) => item.region === active.id
      );
      const newIndex = editingList.findIndex(
        (item) => item.region === over.id
      );
      // arrayMove 사용 새로운 순서 배열 생성
      const newOrder = arrayMove(editingList, oldIndex, newIndex);
      // 로컬 state만 업데이트 (Redux X, Card04 안 바뀜!)
      setEditingList(newOrder);
    }
  }

  // ======================================================
  // ||     useEffect : 북마크 검색어에 따라 (로컬 state 사용)
  // ======================================================
  useEffect(() => {
    // ===== CASE.1 검색어 없을 경우 =====
    //        -> 빈 배열 반환
    if (searchInput.trim() === "") {
      setFilteredList([]);
      return;
    }
    // ===== CASE.2 검색어 있을 경우 =====
    //        -> 1. 띄어쓰기를 제거해서 매칭된 배열 반환
    const filteredResult = LOCATION_LIST.filter((location) => {
      const locationNoSpace = stringUtils.removeSpaces(location);
      const inputNoSpace = stringUtils.removeSpaces(searchInput);
      return locationNoSpace.includes(inputNoSpace);
    });
    setFilteredList(filteredResult);
  }, [searchInput]);

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
            nickname: '',
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
    // 1. editingList를 Redux에 업데이트 (이때 Card04에 반영됨!)
    dispatch(updateBookmarkedRegions(editingList));
    // 2. Redux state를 localStorage에 저장
    dispatch(saveBookmarkOrder());

    // 기존 타이머가 있으면 취소
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    // 알림표시
    setShowToast(true);
    // 1초 뒤에 토스트 숨김 타이머
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 1000);
  };

  console.log(nicknameEditFlg);

  return (
    <>
      <AnimatePresence>
        {nicknameEditFlg && <EditBookmarkNickname />}
        {/* 검색 영역 */}
        <div className="bookmark-container">
          <div className="bookmark-search-container">
            <p className="bookmark-title">내 장소 추가하기</p>
            <div className="bookmark-search-input-btn">
              <input
                className="bookmark-search-input"
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                value={searchInput}
              />
              <div className="bookmark-search-cancel-btn"
                onClick={() => setSearchInput('')}
              >
                <HiMiniXMark color="#333" />
              </div>
              <div className="bookmark-search-btn" type="button">
                <IoMdSearch color="#333" />
              </div>
            </div>
            {/* 검색 결과 영역 */}
            <motion.div
              className="bookmark-filtered-conatiner"
              initial={{ height: 0, minHeight: 0, opacity: 0 }}
              animate={{
                height: filteredList.length > 0 ? "auto" : 0,
                minHeight: filteredList.length > 0 ? 50 : 0,
                opacity: filteredList.length > 0 ? 1 : 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {filteredList.length > 0 &&
                filteredList.map((filteredItem) => (
                  <div className="bookmark-filtered-item" 
                    key={filteredItem}
                    onClick={() => {
                      toggleBookmark(filteredItem); // 2. item 값 그대로 전달!
                    }}
                  >
                    <span
                      className="bookmark-icon"
                    >
                      {isBookmarked(filteredItem) ? (
                        <FaStar color="var(--deep-blue)" />
                      ) : (
                        <CiStar color="var(--deep-blue)" />
                      )}
                    </span>
                    <span className="bookmark-filtered-item-region"> {filteredItem}</span>
                  </div>
                ))}
            </motion.div>
          </div>
          <div className="bookmark-list-container">
            <p className="bookmark-title">내 장소</p>

            {/* 내 장소 편집 영역 */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                // 각 아이템의 id배열 전달 (editingList 사용)
                items={editingList.map((item) => item.region)}
                strategy={verticalListSortingStrategy}
              >
                <div className="bookmark-items-container">
                  {editingList.length > 0 &&
                    editingList.map((item) => (
                      <SortableItem
                        key={item.region}
                        id={item.region}
                        nickname={item.nickname}
                        stationName={item.stationName}
                        isBookmarked={isBookmarked(item.region)}
                        onToggle={toggleBookmark}
                      />
                    ))}
                  {editingList.length === 0 && (
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
