import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type TransitionEvent,
} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { SvgIcon } from '@/components/ui/SvgIcon';

const FALLBACK_CARD_IMAGE_URL = '/images/notice-interest-prompt.svg';
const CARD_SWIPE_THRESHOLD = 48;
const CARD_SNAP_DURATION_MS = 220;

interface CardNewsItem {
  imageUrl: string;
  postId: number;
  summary: string;
  tagName: string;
  title: string;
}

interface CardNewsRouteState {
  cards?: unknown;
  imageUrl?: unknown;
  postId?: unknown;
  summary?: unknown;
  tagName?: unknown;
  title?: unknown;
}

function parsePostId(value: string | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue || !/^[1-9]\d*$/.test(normalizedValue)) {
    return null;
  }

  const postId = Number(normalizedValue);

  return Number.isInteger(postId) && postId > 0 ? postId : null;
}

function normalizeCardNewsItem(value: unknown): CardNewsItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const item = value as CardNewsRouteState;

  if (
    typeof item.postId !== 'number' ||
    !Number.isInteger(item.postId) ||
    item.postId <= 0 ||
    typeof item.title !== 'string' ||
    typeof item.tagName !== 'string' ||
    typeof item.summary !== 'string'
  ) {
    return null;
  }

  return {
    imageUrl: typeof item.imageUrl === 'string' && item.imageUrl.trim() ? item.imageUrl : FALLBACK_CARD_IMAGE_URL,
    postId: item.postId,
    summary: item.summary,
    tagName: item.tagName,
    title: item.title,
  };
}

function getCardNewsItems(value: unknown, postId: number | null) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const state = value as CardNewsRouteState;
  const cards = Array.isArray(state.cards)
    ? state.cards.map(normalizeCardNewsItem).filter((card): card is CardNewsItem => card !== null)
    : [];
  const fallbackCard = normalizeCardNewsItem(state);
  const cardNewsItems = cards.length > 0 ? cards : fallbackCard ? [fallbackCard] : [];

  if (postId === null || !cardNewsItems.some((card) => card.postId === postId)) {
    return null;
  }

  return cardNewsItems;
}

export default function CardNewsDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId: postIdParam } = useParams();
  const postId = parsePostId(postIdParam);
  const cardNewsItems = getCardNewsItems(location.state, postId);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (postId === null) {
    return (
      <CardNewsMessagePage
        message="올바른 카드뉴스를 찾을 수 없어요."
        onBackClick={handleBackClick}
      />
    );
  }

  if (cardNewsItems === null) {
    return (
      <CardNewsMessagePage
        message="카드뉴스 정보를 불러올 수 없어요. 홈에서 다시 선택해주세요."
        onBackClick={handleBackClick}
        onNoticeDetailClick={() => navigate(`/info/posts/${postId}`)}
      />
    );
  }

  return (
    <CardNewsCarousel
      initialPostId={postId}
      items={cardNewsItems}
      onBackClick={handleBackClick}
      onNoticeDetailClick={(activePostId) => navigate(`/info/posts/${activePostId}`)}
    />
  );
}

function CardNewsCarousel({
  initialPostId,
  items,
  onBackClick,
  onNoticeDetailClick,
}: {
  initialPostId: number;
  items: CardNewsItem[];
  onBackClick: () => void;
  onNoticeDetailClick: (postId: number) => void;
}) {
  const initialIndex = Math.max(items.findIndex((item) => item.postId === initialPostId), 0);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const snapFrameRef = useRef<number | null>(null);
  const snapTimeoutRef = useRef<number | null>(null);
  const activeItem = items[activeIndex % items.length];
  const previousIndex = (activeIndex - 1 + items.length) % items.length;
  const nextIndex = (activeIndex + 1) % items.length;

  useEffect(() => {
    setActiveIndex(initialIndex);
    setDragOffsetX(0);
    setIsDragging(false);
    setIsSnapping(false);
    dragStartX.current = null;
  }, [initialIndex, items]);

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

  const snapBackToCurrentItem = (dragDistance: number) => {
    setIsSnapping(false);
    setDragOffsetX(dragDistance);
    snapFrameRef.current = window.requestAnimationFrame(() => {
      setIsSnapping(true);
      setDragOffsetX(0);
      scheduleSnapUnlock();
      snapFrameRef.current = null;
    });
  };

  const snapToItem = (nextActiveIndex: number, nextDragOffsetX: number) => {
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

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (items.length <= 1 || isSnapping) {
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
  };

  const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) {
      return;
    }

    setDragOffsetX(event.clientX - dragStartX.current);
  };

  const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) {
      return;
    }

    const dragDistance = event.clientX - dragStartX.current;
    const viewportWidth = viewportRef.current?.clientWidth ?? 0;
    dragStartX.current = null;
    setIsDragging(false);

    if (Math.abs(dragDistance) < CARD_SWIPE_THRESHOLD) {
      snapBackToCurrentItem(dragDistance);
      return;
    }

    if (dragDistance < 0) {
      snapToItem(nextIndex, viewportWidth + dragDistance);
      return;
    }

    snapToItem(previousIndex, -viewportWidth + dragDistance);
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

  const trackStyle = {
    transform: `translate3d(calc(-100% + ${dragOffsetX}px), 0, 0)`,
    transition: isDragging || !isSnapping ? 'none' : `transform ${CARD_SNAP_DURATION_MS}ms ease-out`,
  } satisfies CSSProperties;

  return (
    <main className="min-h-[100svh] bg-[#565656]">
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col overflow-hidden bg-[#565656] text-white">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[linear-gradient(360deg,#1C1C1C_0%,rgba(28,28,28,0)_100%)]" />

        <CardNewsTopBar onBackClick={onBackClick} />

        <section
          className="relative z-10 flex min-w-0 flex-1 flex-col pb-[104px] touch-pan-y"
          onPointerCancel={handleDragCancel}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
        >
          <div className="min-w-0 overflow-hidden" ref={viewportRef}>
            <div
              className="grid grid-cols-[100%_100%_100%]"
              onTransitionEnd={handleTrackTransitionEnd}
              style={trackStyle}
            >
              <CardNewsImageView item={items[previousIndex]} />
              <CardNewsImageView item={activeItem} />
              <CardNewsImageView item={items[nextIndex]} />
            </div>
          </div>

          <ProgressBar activeIndex={activeIndex} total={items.length} />
          <CardNewsContent item={activeItem} />
        </section>

        <div className="fixed bottom-[55px] left-1/2 z-40 w-full max-w-[393px] -translate-x-1/2 px-4 text-center">
          <button
            type="button"
            className="mx-auto flex h-12 items-center justify-center rounded-full bg-[#292B2C] px-6 text-[16px] font-semibold leading-none tracking-[0.015em] text-white"
            onClick={() => onNoticeDetailClick(activeItem.postId)}
          >
            공지 자세히 보기
          </button>
        </div>
      </div>
    </main>
  );
}

function CardNewsImageView({ item }: { item: CardNewsItem }) {
  return (
    <div className="min-w-0">
      <div
        className="relative flex h-[393px] overflow-hidden rounded-b-[24px] bg-cover bg-center px-4"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />
        <img
          src={item.imageUrl}
          alt=""
          className="relative z-10 mx-auto h-full max-w-full object-contain"
          draggable="false"
        />
        <div className="absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0)_100%)]" />
        <div className="absolute bottom-5 left-4 z-30 flex h-7 items-center gap-1 rounded-full bg-[#31FFCC] py-1.5 pl-2 pr-3 text-[12px] font-semibold leading-[1.2] text-[#1E2530]">
          <SvgIcon size={16} viewBox="0 0 16 16">
            <path
              d="M8 2.2a3.2 3.2 0 0 0-3.2 3.2v1.3L4 8.4a.7.7 0 0 0 .6 1h6.8a.7.7 0 0 0 .6-1l-.8-1.7V5.4A3.2 3.2 0 0 0 8 2.2ZM6.8 11a1.3 1.3 0 0 0 2.4 0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.3"
            />
          </SvgIcon>
          동기들이 많이 봤어요
        </div>
      </div>
    </div>
  );
}

function CardNewsContent({ item }: { item: CardNewsItem }) {
  return (
    <div className="relative z-10 flex flex-col gap-2 px-4 py-4">
      <span className="w-fit rounded-lg bg-[#F3F5FA] px-2.5 py-1.5 text-[14px] font-medium leading-[1.4] text-[#292B2C]">
        {item.tagName}
      </span>
      <div className="flex items-start gap-2">
        <h1 className="min-w-0 flex-1 text-[20px] font-semibold leading-[1.4] text-white">
          {item.title}
        </h1>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[#BFC4C8]" aria-hidden="true">
          <SvgIcon size={28} viewBox="0 0 28 28">
            <path
              d="M21 12.4a7 7 0 0 0-14 0v3.4l-1.6 2.8a1.1 1.1 0 0 0 1 1.7h15.2a1.1 1.1 0 0 0 1-1.7L21 15.8v-3.4ZM11.2 22.3a3 3 0 0 0 5.6 0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
          </SvgIcon>
        </span>
      </div>
      <p className="text-[14px] font-normal leading-[1.4] text-[#DCDFE2]">
        {item.summary}
      </p>
    </div>
  );
}

function CardNewsTopBar({ onBackClick }: { onBackClick: () => void }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex h-[64px] items-center justify-between px-4 text-white">
      <button type="button" className="flex h-10 w-10 items-center justify-start" aria-label="뒤로가기" onClick={onBackClick}>
        <SvgIcon size={24} viewBox="0 0 24 24">
          <path d="m15 5-7 7 7 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </SvgIcon>
      </button>
      <button type="button" className="flex h-10 w-10 cursor-default items-center justify-end" aria-label="더보기" aria-disabled="true">
        <SvgIcon size={24} viewBox="0 0 24 24">
          <path
            d="M5 12h.01M12 12h.01M19 12h.01"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
        </SvgIcon>
      </button>
    </header>
  );
}

function CardNewsMessagePage({
  message,
  onBackClick,
  onNoticeDetailClick,
}: {
  message: string;
  onBackClick: () => void;
  onNoticeDetailClick?: () => void;
}) {
  return (
    <main className="min-h-[100svh] bg-[#1C1C1C]">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-[#1C1C1C] text-white">
        <CardNewsTopBar onBackClick={onBackClick} />
        <section className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
          <p className="text-[16px] font-medium leading-[1.5] text-[#DCDFE2]">
            {message}
          </p>
          {onNoticeDetailClick ? (
            <button
              type="button"
              className="mt-8 flex h-12 items-center justify-center rounded-full bg-[#292B2C] px-6 text-[16px] font-semibold leading-none tracking-[0.015em] text-white"
              onClick={onNoticeDetailClick}
            >
              공지 자세히 보기
            </button>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function ProgressBar({ activeIndex, total }: { activeIndex: number; total: number }) {
  const normalizedActiveIndex = activeIndex % total;

  return (
    <div className="relative z-10 flex h-[22px] items-center gap-1 py-2">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={index === normalizedActiveIndex ? 'h-0.5 flex-1 bg-white' : 'h-0.5 flex-1 bg-white/20'}
        />
      ))}
    </div>
  );
}
