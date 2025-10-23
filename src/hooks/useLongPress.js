import { useCallback, useRef } from "react";

// 스크롤 방지 및 딜레이 시간 조정을 적용한 커스텀 훅
const useLongPress = (onLongPress, { delay = 1500, threshold = 10 } = {}) => {
  const timeout = useRef();
  const isLongPressTriggered = useRef(false);
  const startPosition = useRef({ x: 0, y: 0 }); // 터치 시작 지점 저장

  const start = useCallback(
    (event) => {
      // 터치 시작 지점 기록
      const point = event.touches ? event.touches[0] : event;
      startPosition.current = { x: point.clientX, y: point.clientY };

      isLongPressTriggered.current = false;
      timeout.current = setTimeout(() => {
        onLongPress(event);
        isLongPressTriggered.current = true;
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
  }, []);

  const move = useCallback(
    (event) => {
      const point = event.touches ? event.touches[0] : event;
      const dx = Math.abs(point.clientX - startPosition.current.x);
      const dy = Math.abs(point.clientY - startPosition.current.y);

      // 움직임이 threshold(임계값)를 넘으면 스크롤로 간주하고 타이머 취소
      if (dx > threshold || dy > threshold) {
        clear();
      }
    },
    [clear, threshold]
  );

  const getIsLongPressTriggered = useCallback(
    () => isLongPressTriggered.current,
    []
  );

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: () => clear(),
    onMouseMove: (e) => move(e),
    onMouseLeave: () => clear(),
    onTouchEnd: () => clear(),
    onTouchMove: (e) => move(e),
    getIsLongPressTriggered,
  };
};

export default useLongPress;
