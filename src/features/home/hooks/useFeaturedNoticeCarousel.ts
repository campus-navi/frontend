import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type TransitionEvent,
} from 'react';

const CARD_CLICK_DRAG_THRESHOLD = 8;
const CARD_SWIPE_THRESHOLD = 48;
export const CARD_SNAP_DURATION_MS = 220;

export function useFeaturedNoticeCarousel(itemCount: number, resetKey: unknown) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const carouselViewportRef = useRef<HTMLDivElement | null>(null);
  const hasDraggedRef = useRef(false);
  const snapFrameRef = useRef<number | null>(null);
  const snapTimeoutRef = useRef<number | null>(null);

  const previousIndex = (activeIndex - 1 + itemCount) % itemCount;
  const nextIndex = (activeIndex + 1) % itemCount;

  useEffect(() => {
    setActiveIndex(0);
    setDragOffsetX(0);
    setIsDragging(false);
    setIsSnapping(false);
    dragStartX.current = null;
    hasDraggedRef.current = false;

    if (snapFrameRef.current !== null) {
      window.cancelAnimationFrame(snapFrameRef.current);
      snapFrameRef.current = null;
    }

    if (snapTimeoutRef.current !== null) {
      window.clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = null;
    }
  }, [resetKey]);

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (itemCount <= 1 || isSnapping) {
      return;
    }

    dragStartX.current = event.clientX;
    hasDraggedRef.current = false;
    setIsDragging(true);
    setIsSnapping(false);

    if (snapFrameRef.current !== null) {
      window.cancelAnimationFrame(snapFrameRef.current);
      snapFrameRef.current = null;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) {
      return;
    }

    const dragDistance = event.clientX - dragStartX.current;
    hasDraggedRef.current = Math.abs(dragDistance) > CARD_CLICK_DRAG_THRESHOLD;
    setDragOffsetX(dragDistance);
  };

  const clearSnapUnlockTimer = () => {
    if (snapTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = null;
  };

  const unlockSnap = () => {
    setDragOffsetX(0);
    setIsSnapping(false);
    clearSnapUnlockTimer();
  };

  const scheduleSnapUnlock = () => {
    clearSnapUnlockTimer();
    snapTimeoutRef.current = window.setTimeout(unlockSnap, CARD_SNAP_DURATION_MS + 80);
  };

  const snapBackToCurrentPost = (dragDistance: number) => {
    setIsSnapping(false);
    setDragOffsetX(dragDistance);
    snapFrameRef.current = window.requestAnimationFrame(() => {
      setIsSnapping(true);
      setDragOffsetX(0);
      scheduleSnapUnlock();
      snapFrameRef.current = null;
    });
  };

  const snapToPost = (nextActiveIndex: number, nextDragOffsetX: number) => {
    setActiveIndex(nextActiveIndex);
    setIsSnapping(false);
    setDragOffsetX(nextDragOffsetX);
    snapFrameRef.current = window.requestAnimationFrame(() => {
      setIsSnapping(true);
      setDragOffsetX(0);
      scheduleSnapUnlock();
      snapFrameRef.current = null;
    });
  };

  const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) {
      return;
    }

    const dragDistance = event.clientX - dragStartX.current;
    const viewportWidth = carouselViewportRef.current?.clientWidth ?? 0;
    dragStartX.current = null;
    setIsDragging(false);

    if (Math.abs(dragDistance) <= CARD_CLICK_DRAG_THRESHOLD) {
      hasDraggedRef.current = false;
      setIsSnapping(false);
      setDragOffsetX(0);
      return;
    }

    hasDraggedRef.current = true;

    if (Math.abs(dragDistance) < CARD_SWIPE_THRESHOLD) {
      snapBackToCurrentPost(dragDistance);
      return;
    }

    if (dragDistance < 0) {
      snapToPost(nextIndex, viewportWidth + dragDistance);
      return;
    }

    snapToPost(previousIndex, -viewportWidth + dragDistance);
  };

  const handleDragCancel = () => {
    dragStartX.current = null;
    setDragOffsetX(0);
    setIsDragging(false);
    setIsSnapping(true);
  };

  const handleTrackTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'transform') {
      return;
    }

    unlockSnap();
  };

  const shouldHandleCardClick = () => {
    if (hasDraggedRef.current || isSnapping) {
      hasDraggedRef.current = false;
      return false;
    }

    return true;
  };

  return {
    activeIndex,
    carouselViewportRef,
    dragOffsetX,
    handleDragCancel,
    handleDragEnd,
    handleDragMove,
    handleDragStart,
    handleTrackTransitionEnd,
    isDragging,
    isSnapping,
    nextIndex,
    previousIndex,
    shouldHandleCardClick,
  };
}
