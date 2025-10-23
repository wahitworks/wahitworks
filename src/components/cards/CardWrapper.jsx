import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useLongPress from '../../hooks/useLongPress.js';
import { toggleCardVisibility } from '../../store/slices/cardOrderSlice.js';
import './CardWrapper.css';

const CardWrapper = ({ cardId, children }) => {
  const dispatch = useDispatch();
  const [showDelete, setShowDelete] = useState(false);
  const wrapperRef = useRef(null); // wrapper div를 위한 ref

  // 카드 외부 클릭 감지 로직
  useEffect(() => {
    // 삭제 모드가 아닐 때는 리스너를 추가하지 않음
    if (!showDelete) {
      return;
    }

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDelete(false);
      }
    };

    // mousedown 이벤트에 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);

    // 이 effect가 정리될 때 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDelete]); // showDelete 상태가 변경될 때마다 이 effect를 재실행

  const { getIsLongPressTriggered, ...longPressEvents } = useLongPress(() => {
    setShowDelete(true);
  });

  const handleDelete = (e) => {
    e.stopPropagation(); // 'X' 버튼 클릭이 카드 클릭으로 번지는 것을 막습니다.
    dispatch(toggleCardVisibility(cardId));
  };

  const handleCardClick = (e) => {
    // '길게 누르기'가 발생했는지 확인합니다.
    if (getIsLongPressTriggered()) {
      // 길게 누르기가 발생했다면, 이 클릭 이벤트는 무시합니다.
      // (즉, 'X' 버튼을 숨기지 않고 유지합니다.)
      e.stopPropagation(); // 클릭 이벤트가 상위로 전파되는 것을 막습니다.
      e.preventDefault();  // 기본 동작(예: 텍스트 선택)을 막습니다.
    } else {
      // 길게 누르기가 아니었다면 (짧은 클릭이었다면)
      if (showDelete) {
        setShowDelete(false); // 'X' 버튼이 보이는 상태에서 카드를 클릭하면 숨깁니다.
      }
    }
  };

  return (
    <div
      ref={wrapperRef} // div에 ref 연결
      className={`card-wrapper ${showDelete ? 'selected' : ''}`}
      {...longPressEvents}
      onClick={handleCardClick}
    >
      {showDelete && (
        <button onClick={handleDelete} className="delete-card-btn">
          &times;
        </button>
      )}
      {children}
    </div>
  );
};

export default CardWrapper;