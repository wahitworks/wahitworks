import { useCallback, useRef } from 'react';

const useLongPress = (onLongPress, options) => {
  const delay = (options && options.delay) ? options.delay : 500;

  const timeout = useRef();
  const isLongPressTriggered = useRef(false);

  const start = useCallback(
    (event) => {
      isLongPressTriggered.current = false;
      timeout.current = setTimeout(() => {
        onLongPress(event);
        isLongPressTriggered.current = true;
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    (event) => {
      timeout.current && clearTimeout(timeout.current);
    },
    []
  );

  const getIsLongPressTriggered = useCallback(() => isLongPressTriggered.current, []);

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e),
    onTouchEnd: (e) => clear(e),
    getIsLongPressTriggered,
  };
};

export default useLongPress;