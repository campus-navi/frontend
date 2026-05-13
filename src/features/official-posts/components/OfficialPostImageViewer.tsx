import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type TransitionEvent,
} from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon } from '@/components/ui/HeaderIcons';
import { useBodyScrollLock } from '@/components/ui/useBodyScrollLock';

type OfficialPostImageViewerProps = {
  imageUrls: string[];
  initialIndex: number;
  title: string;
  onClose: () => void;
};

const VIEWER_CLICK_DRAG_THRESHOLD = 8;
const VIEWER_SWIPE_THRESHOLD = 48;
const VIEWER_SNAP_DURATION_MS = 220;

export function OfficialPostImageViewer({
  imageUrls,
  initialIndex,
  title,
  onClose,
}: OfficialPostImageViewerProps) {
  const totalImageCount = imageUrls.length;
  const [activeIndex, setActiveIndex] = useState(() => clampImageIndex(initialIndex, totalImageCount));
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const snapFrameRef = useRef<number | null>(null);
  const snapTimeoutRef = useRef<number | null>(null);
  const previousIndex = totalImageCount > 0 ? (activeIndex - 1 + totalImageCount) % totalImageCount : 0;
  const nextIndex = totalImageCount > 0 ? (activeIndex + 1) % totalImageCount : 0;

  useEffect(() => {
    setActiveIndex(clampImageIndex(initialIndex, totalImageCount));
    setDragOffsetX(0);
    setIsDragging(false);
    setIsSnapping(false);
    dragStartX.current = null;
  }, [initialIndex, totalImageCount]);

  useBodyScrollLock(totalImageCount > 0, { touchAction: 'none' });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (snapFrameRef.current !== null) {
        window.cancelAnimationFrame(snapFrameRef.current);
      }

      if (snapTimeoutRef.current !== null) {
        window.clearTimeout(snapTimeoutRef.current);
      }
    };
  }, []);

  const clearSnapUnlockTimer = useCallback(() => {
    if (snapTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = null;
  }, []);

  const unlockSnap = useCallback(() => {
    setDragOffsetX(0);
    setIsSnapping(false);
    clearSnapUnlockTimer();
  }, [clearSnapUnlockTimer]);

  const scheduleSnapUnlock = useCallback(() => {
    clearSnapUnlockTimer();
    snapTimeoutRef.current = window.setTimeout(unlockSnap, VIEWER_SNAP_DURATION_MS + 80);
  }, [clearSnapUnlockTimer, unlockSnap]);

  const snapBackToCurrentImage = useCallback((dragDistance: number) => {
    setIsSnapping(false);
    setDragOffsetX(dragDistance);
    snapFrameRef.current = window.requestAnimationFrame(() => {
      setIsSnapping(true);
      setDragOffsetX(0);
      scheduleSnapUnlock();
      snapFrameRef.current = null;
    });
  }, [scheduleSnapUnlock]);

  const snapToImage = useCallback((nextActiveIndex: number, nextDragOffsetX: number) => {
    setActiveIndex(nextActiveIndex);
    setIsSnapping(false);
    setDragOffsetX(nextDragOffsetX);
    snapFrameRef.current = window.requestAnimationFrame(() => {
      setIsSnapping(true);
      setDragOffsetX(0);
      scheduleSnapUnlock();
      snapFrameRef.current = null;
    });
  }, [scheduleSnapUnlock]);

  const handleDragStart = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (totalImageCount <= 1 || isSnapping) {
      return;
    }

    dragStartX.current = event.clientX;
    setIsDragging(true);
    setIsSnapping(false);

    if (snapFrameRef.current !== null) {
      window.cancelAnimationFrame(snapFrameRef.current);
      snapFrameRef.current = null;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
  }, [isSnapping, totalImageCount]);

  const handleDragMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) {
      return;
    }

    setDragOffsetX(event.clientX - dragStartX.current);
  }, []);

  const handleDragEnd = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) {
      return;
    }

    const dragDistance = event.clientX - dragStartX.current;
    const viewportWidth = viewportRef.current?.clientWidth ?? 0;
    dragStartX.current = null;
    setIsDragging(false);

    if (Math.abs(dragDistance) <= VIEWER_CLICK_DRAG_THRESHOLD) {
      setIsSnapping(false);
      setDragOffsetX(0);
      return;
    }

    if (Math.abs(dragDistance) < VIEWER_SWIPE_THRESHOLD) {
      snapBackToCurrentImage(dragDistance);
      return;
    }

    if (dragDistance < 0) {
      snapToImage(nextIndex, viewportWidth + dragDistance);
      return;
    }

    snapToImage(previousIndex, -viewportWidth + dragDistance);
  }, [nextIndex, previousIndex, snapBackToCurrentImage, snapToImage]);

  const handleDragCancel = useCallback(() => {
    dragStartX.current = null;
    setDragOffsetX(0);
    setIsDragging(false);
    setIsSnapping(false);
  }, []);

  const handleTrackTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'transform') {
      return;
    }

    unlockSnap();
  }, [unlockSnap]);

  if (totalImageCount === 0) {
    return null;
  }

  const trackStyle = {
    transform: `translate3d(calc(-100% + ${dragOffsetX}px), 0, 0)`,
    transition: isDragging || !isSnapping ? 'none' : `transform ${VIEWER_SNAP_DURATION_MS}ms ease-out`,
  } satisfies CSSProperties;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-[rgba(41,43,44,0.8)]"
      role="dialog"
      aria-modal="true"
      aria-label="공지 이미지 전체 화면 보기"
    >
      <header className="fixed left-1/2 top-0 z-10 w-full max-w-[393px] -translate-x-1/2 bg-[rgba(41,43,44,0.7)] pt-[env(safe-area-inset-top)]">
        <div className="relative flex h-16 items-center justify-between px-4">
          <button
            type="button"
            className="z-10 flex h-10 w-10 items-center justify-center text-white"
            onClick={onClose}
            aria-label="이미지 뷰어 닫기"
          >
            <CloseIcon />
          </button>
          <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[16px] font-semibold leading-[1.4] text-white">
            {activeIndex + 1}/{totalImageCount}
          </p>
          <div className="h-10 w-10" aria-hidden="true" />
        </div>
      </header>

      <div
        ref={viewportRef}
        className="h-full w-full overflow-hidden pt-[calc(64px+env(safe-area-inset-top))] touch-none select-none"
        onPointerCancel={handleDragCancel}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
      >
        <div
          className="grid h-full grid-cols-[100%_100%_100%]"
          onTransitionEnd={handleTrackTransitionEnd}
          style={trackStyle}
        >
          <ViewerImageSlide imageUrl={imageUrls[previousIndex] ?? ''} title={title} index={previousIndex} />
          <ViewerImageSlide imageUrl={imageUrls[activeIndex] ?? ''} title={title} index={activeIndex} />
          <ViewerImageSlide imageUrl={imageUrls[nextIndex] ?? ''} title={title} index={nextIndex} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ViewerImageSlide({
  imageUrl,
  title,
  index,
}: {
  imageUrl: string;
  title: string;
  index: number;
}) {
  return (
    <div className="flex h-full min-w-0 items-center justify-center overflow-hidden px-0 py-0">
      <img
        src={imageUrl}
        alt={`${title} 이미지 ${index + 1}`}
        className="pointer-events-none max-h-full max-w-full object-contain"
        draggable="false"
      />
    </div>
  );
}

function clampImageIndex(index: number, totalImageCount: number) {
  if (totalImageCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), totalImageCount - 1);
}
