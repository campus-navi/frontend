import type { WheelEvent } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type AdmissionYearStepProps = {
  selectedYear: number;
  years: number[];
  onSelect: (year: number) => void;
};

const ITEM_HEIGHT = 50;
const VIEWPORT_HEIGHT = ITEM_HEIGHT * 5;
const CENTER_OFFSET = (VIEWPORT_HEIGHT - ITEM_HEIGHT) / 2;
const WHEEL_GESTURE_IDLE_MS = 180;

export function AdmissionYearStep({ selectedYear, years, onSelect }: AdmissionYearStepProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const snapTimeoutRef = useRef<number | null>(null);
  const wheelGestureTimeoutRef = useRef<number | null>(null);
  const wheelGestureActiveRef = useRef(false);
  const pendingIndexRef = useRef<number | null>(null);
  const selectedIndex = years.indexOf(selectedYear);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    if (selectedIndex >= 0) {
      setActiveIndex(selectedIndex);

      if (pendingIndexRef.current === selectedIndex) {
        pendingIndexRef.current = null;
      }
    }
  }, [selectedIndex]);

  useLayoutEffect(() => {
    const container = scrollRef.current;

    if (!container || selectedIndex < 0) {
      return;
    }

    if (pendingIndexRef.current !== null && pendingIndexRef.current !== selectedIndex) {
      return;
    }

    const targetScrollTop = selectedIndex * ITEM_HEIGHT;

    if (Math.abs(container.scrollTop - targetScrollTop) <= 2) {
      return;
    }

    container.scrollTop = targetScrollTop;
  }, [selectedIndex, selectedYear]);

  useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) {
        window.clearTimeout(snapTimeoutRef.current);
      }

      if (wheelGestureTimeoutRef.current) {
        window.clearTimeout(wheelGestureTimeoutRef.current);
      }
    };
  }, []);

  const getSafeIndex = (index: number) => Math.max(0, Math.min(years.length - 1, index));

  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const safeIndex = getSafeIndex(index);
    const targetScrollTop = safeIndex * ITEM_HEIGHT;
    pendingIndexRef.current = safeIndex;
    setActiveIndex(safeIndex);

    container.scrollTo({
      top: targetScrollTop,
      behavior,
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    if (pendingIndexRef.current !== null) {
      const targetScrollTop = pendingIndexRef.current * ITEM_HEIGHT;

      if (Math.abs(container.scrollTop - targetScrollTop) <= 2) {
        pendingIndexRef.current = null;
      }

      return;
    }

    if (snapTimeoutRef.current) {
      window.clearTimeout(snapTimeoutRef.current);
    }

    snapTimeoutRef.current = window.setTimeout(() => {
      const nextIndex =
        pendingIndexRef.current ?? getSafeIndex(Math.round(container.scrollTop / ITEM_HEIGHT));
      const nextYear = years[nextIndex];
      const targetScrollTop = nextIndex * ITEM_HEIGHT;

      setActiveIndex(nextIndex);
      pendingIndexRef.current = nextIndex;

      if (Math.abs(container.scrollTop - targetScrollTop) > 2) {
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      } else {
        pendingIndexRef.current = null;
      }

      if (nextYear !== selectedYear) {
        onSelect(nextYear);
      }
    }, 90);
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const container = scrollRef.current;

    if (!container) {
      return;
    }

    if (wheelGestureTimeoutRef.current) {
      window.clearTimeout(wheelGestureTimeoutRef.current);
    }

    wheelGestureTimeoutRef.current = window.setTimeout(() => {
      wheelGestureActiveRef.current = false;
      wheelGestureTimeoutRef.current = null;
    }, WHEEL_GESTURE_IDLE_MS);

    if (wheelGestureActiveRef.current || pendingIndexRef.current !== null) {
      return;
    }

    wheelGestureActiveRef.current = true;

    const direction = event.deltaY > 0 ? 1 : -1;
    const baseIndex = pendingIndexRef.current ?? activeIndex;
    const normalizedScrollTop = getSafeIndex(baseIndex) * ITEM_HEIGHT;
    const nextIndex = getSafeIndex(baseIndex + direction);
    const nextYear = years[nextIndex];

    if (Math.abs(container.scrollTop - normalizedScrollTop) > 2) {
      container.scrollTop = normalizedScrollTop;
    }

    scrollToIndex(nextIndex, 'smooth');
    setActiveIndex(nextIndex);

    if (nextYear !== selectedYear) {
      onSelect(nextYear);
    }
  };

  const handleYearClick = (year: number) => {
    const nextIndex = years.indexOf(year);

    scrollToIndex(nextIndex, 'smooth');

    if (year !== selectedYear) {
      onSelect(year);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        입학년도를
        <br />
        입력해주세요
      </h1>

      <div className="flex flex-1 items-center justify-center pt-6">
        <div className="w-full max-w-[320px]">
          <div className="relative mx-auto" style={{ height: `${VIEWPORT_HEIGHT}px` }}>
            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[46px] -translate-y-1/2 rounded-full bg-[#F4F4F4]" />
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onWheelCapture={handleWheel}
              className="relative z-10 h-full overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: 'touch', scrollPaddingBlock: `${CENTER_OFFSET}px` }}
            >
              <div style={{ height: `${CENTER_OFFSET}px` }} />
              {years.map((year) => {
                const isSelected = years.indexOf(year) === activeIndex;

                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearClick(year)}
                    className={[
                      'relative z-10 flex w-full snap-center items-center justify-center text-center transition-all duration-150',
                      isSelected ? 'text-[22px] font-medium text-[#121212]' : 'text-[22px] font-medium text-[#E1E1E1]',
                    ].join(' ')}
                    style={{ height: `${ITEM_HEIGHT}px` }}
                  >
                    {year}
                  </button>
                );
              })}
              <div style={{ height: `${CENTER_OFFSET}px` }} />
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-gradient-to-b from-white via-white/85 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-white via-white/85 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
