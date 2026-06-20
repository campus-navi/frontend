import { type CSSProperties, type MouseEvent } from 'react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useFeaturedNoticeCarousel, CARD_SNAP_DURATION_MS } from '@/features/home/hooks/useFeaturedNoticeCarousel';
import { FeaturedNoticeCard } from '@/features/home/components/FeaturedNoticeCard';
import { FeaturedNoticePlaceholder } from '@/features/home/components/FeaturedNoticePlaceholder';
import { ProgressDots } from '@/features/home/components/ProgressDots';
import type { FeedCardPost } from '@/api';

export function FeaturedNoticeContent({
  isEmpty,
  isError,
  isLoading,
  onCardClick,
  onNoticeDetailClick,
  posts,
}: {
  isEmpty: boolean;
  isError: boolean;
  isLoading: boolean;
  onCardClick: (post: FeedCardPost) => void;
  onNoticeDetailClick: (postId: number) => void;
  posts: FeedCardPost[];
}) {
  const {
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
  } = useFeaturedNoticeCarousel(posts.length, posts);

  if (isLoading) {
    return (
      <div className="flex h-[481px] items-center justify-center rounded-2xl bg-[#FAFAFC] text-[#292B2C]">
        <LoadingSpinner ariaLabel="주요 공지를 불러오는 중" className="h-8 w-8" />
      </div>
    );
  }

  if (isError) {
    return <FeaturedNoticePlaceholder>주요 공지를 불러오지 못했어요.</FeaturedNoticePlaceholder>;
  }

  if (isEmpty) {
    return <FeaturedNoticePlaceholder>표시할 주요 공지가 없어요.</FeaturedNoticePlaceholder>;
  }

  const activePost = posts[activeIndex % posts.length];
  const previousPost = posts[previousIndex];
  const nextPost = posts[nextIndex];

  const handleCardClick = () => {
    if (!shouldHandleCardClick()) {
      return;
    }

    onCardClick(activePost);
  };

  const handleNoticeDetailClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onNoticeDetailClick(activePost.postId);
  };

  const trackStyle = {
    transform: `translate3d(calc(-100% + ${dragOffsetX}px), 0, 0)`,
    transition: isDragging || !isSnapping ? 'none' : `transform ${CARD_SNAP_DURATION_MS}ms ease-out`,
  } satisfies CSSProperties;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative overflow-hidden rounded-2xl touch-pan-y select-none"
        ref={carouselViewportRef}
        onPointerCancel={handleDragCancel}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onClick={handleCardClick}
      >
        <div
          className="grid grid-cols-[100%_100%_100%]"
          onTransitionEnd={handleTrackTransitionEnd}
          style={trackStyle}
        >
          <FeaturedNoticeCard post={previousPost} />
          <FeaturedNoticeCard post={activePost} />
          <FeaturedNoticeCard post={nextPost} />
        </div>
        <button
          type="button"
          className="absolute bottom-4 left-4 right-4 z-20 flex h-12 items-center justify-center rounded-[10px] bg-[#292B2C] px-4 text-[16px] font-medium leading-none tracking-[0.015em] text-white"
          data-post-id={activePost.postId}
          onClick={handleNoticeDetailClick}
          onPointerDown={(event) => event.stopPropagation()}
        >
          공지 자세히 보기
        </button>
      </div>
      <ProgressDots total={posts.length} activeIndex={activeIndex} />
    </div>
  );
}
