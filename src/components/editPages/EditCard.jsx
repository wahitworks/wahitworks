import React, { useState } from 'react';
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
import './EditCard.css';

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

    // 디버깅용
    const handleChange = () => {
      console.log(`(1단계) 스위치 클릭됨: ${props.id}`);
      props.onToggle();
    };

    return (
        <div ref={setNodeRef} style={style} 
        // {...attributes} {...listeners}
         className="card">
            <div {...attributes} {...listeners} 
            className="hambger">&#x2630; {/* 햄버거 아이콘 */}</div>
            <p className="card-name">{props.id}</p>
            <input checked={props.checked} type="checkbox" 
            className="switch" onChange={handleChange} // 디버깅용
              // className="switch" onChange={props.onToggle}
              onPointerDown = {(e) => e.stopPropagation()}></input>
        </div>
    );
}

function EditCard () {
  const [items, setItems] = useState([
    {id: `지금 대기 상태`, checked: true},
    {id: `내 장소`, checked: true}, 
    {id: `미세 먼지 예보`, checked: true}, 
    {id: `오늘은!`, checked: true}]);

    function handleToggle(idToToggle) {
    setItems((currentItems) => 
      currentItems.map((item) =>
        item.id === idToToggle ? {...item, checked: item.checked} : item
      )
    )
      
    }
    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            delat: 100,
            tolerance: 5,
          },
        }),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((currentItems) => {
              const oldIndex = currentItems.findIndex(item => item.id === active.id);
              const newIndex = currentItems.findIndex(item => item.id === over.id);
                            
              return arrayMove(currentItems, oldIndex, newIndex);
            });
        } 
    }

    return (
      <div className='card-container'>
          <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                  {items.map(item => (<SortableItem key={item.id} id={item.id} 
                    checked={item.checked} onToggle={() => handleToggle(item.id)} />))}
              </SortableContext>
          </DndContext>
      </div>   
    );
};

export default EditCard;