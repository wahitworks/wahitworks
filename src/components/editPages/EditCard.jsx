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
  DEFAULT_ORDER,
} from "../../store/slices/cardOrderSlice";
import { saveCardOrder } from "../../utils/localStorageUtil";
import { useState } from "react";
import { motion } from "framer-motion";

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
        onTouchStart={(e) => e.stopPropagation()}
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

  // 초기화 버튼 상태관리
  const [modalOpen, setModalOpen] = useState(false);

  function handleToggle(idToToggle) {
    dispatch(toggleCardVisibility(idToToggle));
    // Redux slice에서 자동으로 localStorage에 저장됨
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
      dispatch(setOrder(newOrder));
      // Redux slice에서 자동으로 localStorage에 저장됨
    }
  }

  // 초기화 버튼 클릭시
  const handleReset = () => {
    setModalOpen(true); // 확인창 모달로 열기
  };
  // 모달에서 '예' 클릭
  const yesReset = () => {
    dispatch(resetOrder());
    // resetOrder 실행 후 기본 순서로 저장
    saveCardOrder(DEFAULT_ORDER);
    setModalOpen(false);
  };
  // 모달에서 '아니오' 클릭
  const cancelReset = () => {
    setModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
    </motion.div>
  );
}

export default EditCard;
