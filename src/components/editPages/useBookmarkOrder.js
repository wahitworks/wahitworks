// 우선 관리하기 쉬우라고 여기 만들었는데 옮기실분은 옮기셔도 됩니다.

import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBookmark,
  removeBookmark,
  updateBookmarkedRegions,
  saveBookmarkOrder,
} from '../../store/slices/bookmarkSlice';
import { arrayMove } from '@dnd-kit/sortable';


export const useBookmarkOrder = () => {
  const dispatch = useDispatch();
  
  // 북마크 목록 불러오기
  const bookmarkedRegions = useSelector(state => state.bookmarkSlice.bookmarkedRegions);

  // 페이지 출력시 순서 저장
  const originalOrderRef = useRef(null);
  // 저장 버튼 실행 추적
  const saveRef = useRef(false);

  // 저장완료 알림창 토스관리
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef(null);

  // 컴포넌트가 처음 렌더링될 때 원본 순서를 ref에 저장합니다.
  useEffect(() => {
    originalOrderRef.current = bookmarkedRegions;
    saveRef.current = false;
  }, [])

  // 페이지를 벗어날 때, 저장하지 않았다면 순서만 되돌립니다.
  useEffect(() => {
    return () => {
      if(!saveRef.current) {
        dispatch(updateBookmarkedRegions(originalOrderRef.current));
      }
    };
  }, []);

  // 드래그 앤 드롭 후, 목록의 순서 변경
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = bookmarkedRegions.findIndex((item) => item === active.id);
      const newIndex = bookmarkedRegions.findIndex((item) => item === over.id);
      const newOrder = arrayMove(bookmarkedRegions, oldIndex, newIndex);
      dispatch(updateBookmarkedRegions(newOrder));
    }
  };

  // 특정 지역이 임시 목록에 포함된지 확인
  const bookmarked = (item) => {
    return bookmarkedRegions.some(bookmarkedItem => bookmarkedItem === item);
  };

  // 아이콘 클릭시, 임시목록에서 항목 추가/제거
  // redux상태 영향 없음
  const handleToggleBookmark = (item) => {
    if (bookmarked(item)) {
      dispatch(removeBookmark(item));
    } else {
      dispatch(addBookmark(item));
    }
  };

  // 저장하기 버튼 실행
  // 순서가 변경된 정보 최종 저장
  const handleSaveOrder = () => {
    dispatch(saveBookmarkOrder());

    // 저장 확인
    saveRef.current = true;

    // 저장 확인 문구
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setShowToast(true);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 1000);
  };

  // 함수 반환
  return {
    bookmarkedRegions,
    handleDragEnd,
    bookmarked,
    handleToggleBookmark,
    handleSaveOrder,
    showToast,
  };
};