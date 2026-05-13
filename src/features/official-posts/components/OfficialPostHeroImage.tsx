import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type TransitionEvent,
} from 'react';

type OfficialPostHeroImageProps = {
  imageUrls: string[];
  title: string;
  onImageClick?: (imageIndex: number) => void;
};

const HERO_CLICK_DRAG_THRESHOLD = 8;
const HERO_SWIPE_THRESHOLD = 48;
const HERO_SNAP_DURATION_MS = 220;
const HERO_DRAG_CLICK_SUPPRESSION_RESET_MS = 250;

export function OfficialPostHeroImage({ imageUrls, title, onImageClick }: OfficialPostHeroImageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const didDragRef = useRef(false);
  const didDragResetTimeoutRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const snapFrameRef = useRef<number | null>(null);
  const snapTimeoutRef = useRef<number | null>(null);
  const totalImageCount = imageUrls.length;
  const previousIndex = totalImageCount > 0 ? (activeIndex - 1 + totalImageCount) % totalImageCount : 0;
  const nextIndex = totalImageCount > 0 ? (activeIndex + 1) % totalImageCount : 0;

  const clearDidDragResetTimer = useCallback(() => {
    if (didDragResetTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(didDragResetTimeoutRef.current);
    didDragResetTimeoutRef.current = null;
  }, []);

  const scheduleDidDragReset = useCallback(() => {
    clearDidDragResetTimer();
    didDragResetTimeoutRef.current = window.setTimeout(() => {
      didDragRef.current = false;
      didDragResetTimeoutRef.current = null;
    }, HERO_DRAG_CLICK_SUPPRESSION_RESET_MS);
  }, [clearDidDragResetTimer]);

  useEffect(() => {
    setActiveIndex(0);
    setDragOffsetX(0);
    setIsDragging(false);
    setIsSnapping(false);
    dragStartX.current = null;
    didDragRef.current = false;
    clearDidDragResetTimer();

    if (snapFrameRef.current !== null) {
      window.cancelAnimationFrame(snapFrameRef.current);
      snapFrameRef.current = null;
    }

    if (snapTimeoutRef.current !== null) {
      window.clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = null;
    }
  }, [clearDidDragResetTimer, imageUrls]);

  useEffect(() => {
    return () => {
      clearDidDragResetTimer();
    };
  }, [clearDidDragResetTimer]);

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
    snapTimeoutRef.current = window.setTimeout(unlockSnap, HERO_SNAP_DURATION_MS + 80);
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
    const didDrag = Math.abs(dragDistance) > HERO_CLICK_DRAG_THRESHOLD;
    didDragRef.current = didDrag;
    if (didDrag) {
      scheduleDidDragReset();
    } else {
      clearDidDragResetTimer();
    }
    dragStartX.current = null;
    setIsDragging(false);

    if (Math.abs(dragDistance) <= HERO_CLICK_DRAG_THRESHOLD) {
      setIsSnapping(false);
      setDragOffsetX(0);
      return;
    }

    if (Math.abs(dragDistance) < HERO_SWIPE_THRESHOLD) {
      snapBackToCurrentImage(dragDistance);
      return;
    }

    if (dragDistance < 0) {
      snapToImage(nextIndex, viewportWidth + dragDistance);
      return;
    }

    snapToImage(previousIndex, -viewportWidth + dragDistance);
  }, [
    clearDidDragResetTimer,
    nextIndex,
    previousIndex,
    scheduleDidDragReset,
    snapBackToCurrentImage,
    snapToImage,
  ]);

  const handleDragCancel = useCallback(() => {
    dragStartX.current = null;
    didDragRef.current = false;
    clearDidDragResetTimer();
    setDragOffsetX(0);
    setIsDragging(false);
    setIsSnapping(false);
  }, [clearDidDragResetTimer]);

  const handleImageClick = useCallback(() => {
    if (didDragRef.current || totalImageCount === 0) {
      didDragRef.current = false;
      clearDidDragResetTimer();
      return;
    }

    onImageClick?.(activeIndex);
  }, [activeIndex, clearDidDragResetTimer, onImageClick, totalImageCount]);

  const handleTrackTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'transform') {
      return;
    }

    unlockSnap();
  }, [unlockSnap]);

  const trackStyle = {
    transform: `translate3d(calc(-100% + ${dragOffsetX}px), 0, 0)`,
    transition: isDragging || !isSnapping ? 'none' : `transform ${HERO_SNAP_DURATION_MS}ms ease-out`,
  } satisfies CSSProperties;

  return (
    <section className="relative aspect-square w-full overflow-hidden" aria-label="공지 이미지">
      <div
        ref={viewportRef}
        className="h-full w-full overflow-hidden touch-pan-y select-none"
        onPointerCancel={handleDragCancel}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onClick={handleImageClick}
      >
        {totalImageCount > 0 ? (
          <div
            className="grid h-full grid-cols-[100%_100%_100%]"
            onTransitionEnd={handleTrackTransitionEnd}
            style={trackStyle}
          >
            <HeroImageSlide
              imageUrl={imageUrls[previousIndex] ?? ''}
              title={title}
            />
            <HeroImageSlide
              imageUrl={imageUrls[activeIndex] ?? ''}
              title={title}
            />
            <HeroImageSlide imageUrl={imageUrls[nextIndex] ?? ''} title={title} />
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-end justify-end">
        {totalImageCount > 0 ? (
          <div className="flex flex-col items-start p-4">
            <div className="flex w-10 items-center justify-center overflow-hidden rounded-full bg-[rgba(41,43,44,0.6)] py-0.5 text-center text-[12px] font-medium leading-[1.2]">
              <span className="text-white">{activeIndex + 1}</span>
              <span className="text-[#BFC4C8]">/{totalImageCount}</span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function HeroImageSlide({
  imageUrl,
  title,
}: {
  imageUrl: string;
  title: string;
}) {
  return (
    <div className="relative h-full min-w-0 overflow-hidden">
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-[32px]"
        draggable="false"
      />
      <img
        src={imageUrl}
        alt={title}
        className="pointer-events-none relative z-10 h-full w-full object-contain"
        draggable="false"
      />
      <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.06)_58.667%)]" />
    </div>
  );
}
