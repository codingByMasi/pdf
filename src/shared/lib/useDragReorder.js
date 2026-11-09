// Drag-to-reorder for touch and mouse. Give each item data-reorder={index}; put handleProps(index) on its grip button.
import { useRef, useState } from 'react';

export function useDragReorder(onMoveTo) {
  const [drag, setDrag] = useState({ from: null, over: null });
  const overRef = useRef(null);
  const fromRef = useRef(null);

  const finish = (commit) => {
    if (commit && fromRef.current !== null && overRef.current !== null && overRef.current !== fromRef.current) onMoveTo(fromRef.current, overRef.current);
    overRef.current = null;
    fromRef.current = null;
    setDrag({ from: null, over: null });
  };

  const handleProps = (index) => ({
    onPointerDown: (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      overRef.current = index;
      fromRef.current = index;
      setDrag({ from: index, over: index });
    },
    onPointerMove: (event) => {
      if (fromRef.current === null) return;
      const spot = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-reorder]');
      if (spot) {
        overRef.current = Number(spot.dataset.reorder);
        setDrag({ from: fromRef.current, over: overRef.current });
      }
    },
    onPointerUp: () => finish(true),
    onPointerCancel: () => finish(false),
  });

  const itemClass = (index) => (drag.from === index ? ' reorder-dragging' : drag.from !== null && drag.over === index ? ' reorder-target' : '');
  return { handleProps, itemClass, dragging: drag.from !== null };
}
