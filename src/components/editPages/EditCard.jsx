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
import "./EditCard.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrder,
  resetOrder,
  toggleCardVisibility,
} from "../../store/slices/cardOrderSlice";
import { saveCardOrder } from "../../utils/localStorageUtil";
// 알림창
import Toast from "../commons/Toast";
import { useEffect, useRef, useState } from "react";

// 각 카드 아이템을 위한 컴포넌트
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="editcard-card"
    >
      <div className="editcard-card-info">
        <p className="editcard-hamburger">&#x2630; {/* 햄버거 아이콘 */}</p>
        <p className="editcard-card-name">{props.name}</p>
      </div>
      <input
        checked={props.checked}
        type="checkbox"
        className="editcard-switch"
        onChange={props.onToggle} // 스위치
        onPointerDown={(e) => e.stopPropagation()}
      ></input>
    </div>
  );
}

// 카드 편집기능
function EditCard() {
  // 카드 불러오기
  const order = useSelector((state) => state.cardOrder.order);
  const dispatch = useDispatch();
  // 알림창(토스트) 표시여부관리
  const [showToast, setShowToast] = useState(false);
  // 타이머 id저장 ref
  const toastTimerRef = useRef(null);

  // 초기화 버튼 상태관리
  const [modalOpen, setModalOpen] = useState(false);

  // 2초후 사라지게하기
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 1000);
      // 컴포넌트가 사라질 때 타이머도 정리
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  function handleToggle(idToToggle) {
    dispatch(toggleCardVisibility(idToToggle));
  }

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
      const oldIndex = order.findIndex((item) => item.id === active.id);
      const newIndex = order.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(order, oldIndex, newIndex);
      dispatch(setOrder(newOrder)); // setitems 대신 dispatch사용
    }
  }

  // 저장하기 버튼 클릭시
  const handleSave = () => {
    // 현재 상태를 localStorage에 저장
    saveCardOrder(order);

    // 이전에 타이머가 있다면 취소
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    // 토스트 출력
    setShowToast(true);

    // 2초 뒤 토스트 숨기는 타이머
    // ref에 저장
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 1000);
  };

  // 초기화 버튼 클릭시
  const handleReset = () => {
    setModalOpen(true); // 확인창 모달로 열기
  };
  // 모달에서 '예' 클릭
  const yesReset = () => {
    dispatch(resetOrder());
    setModalOpen(false);
  };
  // 모달에서 '아니오' 클릭
  const cancelReset = () => {
    setModalOpen(false);
  };

  return (
    <>
      {/* 초기화 버튼 */}
      <div className="editcard-reset-btn-container">
        {
          <button
            className="editcard-reset-btn"
            type="button"
            onClick={handleReset}
          >
            초기화하기
          </button>
        }
      </div>
      <div className="editcard-card-container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={order.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {order.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                name={item.name}
                checked={item.checked}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      {/* 저장하기 버튼 */}
      <div className="editcard-card-save-btn-container">
        <button
          className="editcard-card-save-btn"
          type="button"
          onClick={handleSave}
        >
          저장하기
        </button>
      </div>

      <Toast message="저장되었습니다!" show={showToast}></Toast>

      {modalOpen && (
        <div className="editcard-modal-background">
          <div className="editcard-modal-content">
            <p className="editcard-modal-comment">초기화 하시겠습니까?</p>
            <div className="editcard-modal-btn">
              <button
                onClick={yesReset}
                className="editcard-modal-yes"
                type="button"
              >
                예
              </button>
              <button
                onClick={cancelReset}
                className="editcard-modal-cancel"
                type="button"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditCard;
