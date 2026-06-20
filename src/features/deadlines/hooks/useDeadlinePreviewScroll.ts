import {
  useEffect,
  useRef,
  type MouseEventHandler,
  type PointerEventHandler,
} from 'react';

const DRAG_THRESHOLD = 6;

export function useDeadlinePreviewScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cleanupDragListenersRef = useRef<(() => void) | null>(null);
  const dragStateRef = useRef({
    hasDragged: false,
    isDragging: false,
    scrollLeft: 0,
    startX: 0,
  });

  const cleanupDragListeners = () => {
    cleanupDragListenersRef.current?.();
    cleanupDragListenersRef.current = null;
  };

  const endDrag = () => {
    dragStateRef.current.isDragging = false;
    cleanupDragListeners();
  };

  useEffect(() => cleanupDragListeners, []);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    dragStateRef.current = {
      hasDragged: false,
      isDragging: true,
      scrollLeft: container.scrollLeft,
      startX: event.clientX,
    };

    cleanupDragListeners();

    const handleWindowPointerEnd = () => {
      endDrag();
    };

    window.addEventListener('pointerup', handleWindowPointerEnd);
    window.addEventListener('pointercancel', handleWindowPointerEnd);
    cleanupDragListenersRef.current = () => {
      window.removeEventListener('pointerup', handleWindowPointerEnd);
      window.removeEventListener('pointercancel', handleWindowPointerEnd);
    };
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    const container = scrollRef.current;
    const dragState = dragStateRef.current;

    if (!container || !dragState.isDragging) {
      return;
    }

    const moveDistance = event.clientX - dragState.startX;

    if (Math.abs(moveDistance) < DRAG_THRESHOLD) {
      return;
    }

    dragState.hasDragged = true;

    if (event.pointerType === 'touch') {
      return;
    }

    event.preventDefault();
    container.scrollLeft = dragState.scrollLeft - moveDistance;
  };

  const handleClickCapture: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!dragStateRef.current.hasDragged) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current.hasDragged = false;
  };

  return {
    handlers: {
      onClickCapture: handleClickCapture,
      onPointerCancel: endDrag,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endDrag,
    },
    scrollRef,
  };
}
