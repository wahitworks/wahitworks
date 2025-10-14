import { 
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors, } from '@dnd-kit/core';
import { 
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates, 
    verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './EditCard.css';
import { useDispatch, useSelector } from 'react-redux';
import { setOrder, resetOrder, toggleCardVisibility } from '../../store/slices/cardOrderSlice';
import { saveCardOrder } from '../../utils/localStorageUtil';

// 각 카드 아이템을 위한 컴포넌트
function SortableItem (props) {
    const {
        attributes,
        listeners, // 드래그 동작 담당
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} 
         className="editcard-card">
            <div {...attributes} {...listeners} 
            className="editcard-hamburger">&#x2630; {/* 햄버거 아이콘 */}</div>
            <p className="editcard-card-name">{props.id}</p>
            <input checked={props.checked} type="checkbox" 
              className="editcard-switch" onChange={props.onToggle} // 스위치
              onPointerDown = {(e) => e.stopPropagation()}></input>
        </div>
    );
}

// 카드 편집기능
function EditCard () {
  // 카드 불러오기
  const order = useSelector((state) => state.cardOrder.order);
  const dispatch = useDispatch();

    function handleToggle(idToToggle) {
      dispatch(toggleCardVisibility(idToToggle));
    }
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
          // 드래그를 시작하기 위해 필요한 마우스 움직임 거리(단위:px)
          activationConstraint: {
            delay: 100,
            tolerance: 5,
          },
        }),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor, {
          // 터치로 사용
          activationConstraint: {
            delay: 100,
            tolerance: 5,
          }
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
            };
        } 
    

    // 저장하기 버튼 클릭시
    const handleSave = () => {
      // 현재 상태를 localStorage에 저장
      saveCardOrder(order);
      alert( `저장되었습니다!`) // 저장 알림
    };

    // 초기화 버튼 클릭시
    const handleReset = () => {
      if (window.confirm(`카드 순서와 설정을 초기화하시겠습니까?`)) {
        dispatch(resetOrder());
      }
    }

    return (
      <>
      {/* 초기화 버튼 */}
      <div className="editcard-reset-btn-container">
        {<button className="editcard-reset-btn" type="button" onClick={handleReset}>
          초기화하기
        </button>}
      </div>
      <div className='editcard-card-container'>
          <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext items={order.map(item => item.id)} 
              strategy={verticalListSortingStrategy}>
                  {order.map(item => (<SortableItem key={item.id} id={item.id} 
                    checked={item.checked} onToggle={() => handleToggle(item.id)} />))}
              </SortableContext>
          </DndContext>
      </div>  
      {/* 저장하기 버튼 */}
      <div className="editcard-card-save-btn-container">
        <button className='editcard-card-save-btn' type="button" onClick={handleSave}>
          저장하기
        </button>
      </div>
      </> 
    );
};

export default EditCard;