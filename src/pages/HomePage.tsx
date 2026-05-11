import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type TransitionEvent,
} from 'react';

import { AppHeader } from '@/components/ui/AppHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { RadioChip } from '@/components/ui/RadioChip';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { Tags } from '@/components/ui/Tags';
import { useFeedCards } from '@/features/home/hooks/useFeedCards';
import type { FeedCardPost } from '@/api';

const TEMP_NICKNAME = '익명';
const HAS_NEW_NOTIFICATION = true;
const deadlineCards = [
  { id: 1, daysLeft: 'D-6', category: '수강', title: '공지글입니다.\n두줄까지 쓸 수 있어요', meta: '04/10 | OO학사팀' },
  { id: 2, daysLeft: 'D-3', category: '장학', title: '성적 장학금 신청 안내', meta: '04/12 | 장학팀' },
];

const communityPosts = [
  {
    id: 1,
    hasImage: false,
    title: '호텔경제학을 여기서 볼 줄이야',
    body: '축제로 학교 분위기는 좋아졌고, 취소돼서 기부하니 이미지도 좋아졌고, 취소돼서 기부기부',
  },
  {
    id: 2,
    hasImage: true,
    title: '호텔경제학을 여기서 볼 줄이야',
    body: '축제로 학교 분위기는 좋아졌고, 취소돼서 기부하니 이미지도 좋아졌고, 취소돼서 기부기부',
  },
  {
    id: 3,
    hasImage: true,
    title: '호텔경제학을 여기서 볼 줄이야',
    body: '축제로 학교 분위기는 좋아졌고, 취소돼서 기부하니 이미지도 좋아졌고, 취소돼서 기부기부',
  },
];

type FeaturedNoticeTab = 'new' | 'recommended';

export default function HomePage() {
  const [featuredNoticeTab, setFeaturedNoticeTab] = useState<FeaturedNoticeTab>('new');
  const { data: feedCards, isError, isLoading } = useFeedCards();
  const featuredPosts = featuredNoticeTab === 'new'
    ? feedCards?.newPosts ?? []
    : feedCards?.recommendedPosts ?? [];

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[86px]">
        <AppHeader
          variant="main"
          rightSlot={<NotificationButton hasNewNotification={HAS_NEW_NOTIFICATION} />}
          className="fixed left-1/2 top-0 z-40 w-full max-w-[393px] -translate-x-1/2 bg-white"
        />
        <div className="h-[calc(60px+max(20px,env(safe-area-inset-top)))] shrink-0" aria-hidden="true" />

        <section className="flex flex-col gap-5 bg-white px-4 py-4">
          <SectionTitle suffix="주요 공지" />

          <div className="flex items-center gap-2" role="tablist" aria-label="공지 유형">
            <RadioChip
              selected={featuredNoticeTab === 'new'}
              size="md"
              role="tab"
              aria-selected={featuredNoticeTab === 'new'}
              onClick={() => setFeaturedNoticeTab('new')}
            >
              신규
            </RadioChip>
            <RadioChip
              selected={featuredNoticeTab === 'recommended'}
              size="md"
              role="tab"
              aria-selected={featuredNoticeTab === 'recommended'}
              onClick={() => setFeaturedNoticeTab('recommended')}
            >
              추천
            </RadioChip>
          </div>

          <FeaturedNoticeContent
            isError={isError}
            isLoading={isLoading}
            posts={featuredPosts}
          />
        </section>

        <section className="flex flex-col gap-4 bg-white py-5">
          <SectionHeader keyword="마감임박" suffix="공지" />
          <div className="flex gap-4 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {deadlineCards.map((card) => (
              <DeadlineCard key={card.id} {...card} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5 bg-white px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <SectionTitle suffix="머시기 글" />
            <SeeAllButton />
          </div>

          <div className="flex items-center gap-2" role="tablist" aria-label="커뮤니티 글 유형">
            <RadioChip selected role="tab" aria-selected="true">
              전체
            </RadioChip>
            <RadioChip role="tab" aria-selected="false">
              인기
            </RadioChip>
          </div>

          <div className="flex flex-col gap-4">
            {communityPosts.map((post) => (
              <CommunityPost key={post.id} {...post} />
            ))}
          </div>
        </section>
      </div>

      <MobileGnb activeItem="home" />
    </main>
  );
}

function FeaturedNoticeContent({
  isError,
  isLoading,
  posts,
}: {
  isError: boolean;
  isLoading: boolean;
  posts: FeedCardPost[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const carouselViewportRef = useRef<HTMLDivElement | null>(null);
  const hasDraggedRef = useRef(false);
  const snapFrameRef = useRef<number | null>(null);

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
  }, [posts]);

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

  if (posts.length === 0) {
    return <FeaturedNoticePlaceholder>표시할 주요 공지가 없어요.</FeaturedNoticePlaceholder>;
  }

  const activePost = posts[activeIndex % posts.length];
  const previousIndex = (activeIndex - 1 + posts.length) % posts.length;
  const nextIndex = (activeIndex + 1) % posts.length;
  const previousPost = posts[previousIndex];
  const nextPost = posts[nextIndex];

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (posts.length <= 1 || isSnapping) {
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
    hasDraggedRef.current = Math.abs(dragDistance) > 8;
    setDragOffsetX(dragDistance);
  };

  const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) {
      return;
    }

    const dragDistance = event.clientX - dragStartX.current;
    const viewportWidth = carouselViewportRef.current?.clientWidth ?? 0;
    dragStartX.current = null;
    setIsDragging(false);

    if (Math.abs(dragDistance) < 48) {
      hasDraggedRef.current = Math.abs(dragDistance) > 8;
      setIsSnapping(true);
      setDragOffsetX(0);
      return;
    }

    if (dragDistance < 0) {
      setActiveIndex(nextIndex);
      setIsSnapping(false);
      setDragOffsetX(viewportWidth + dragDistance);
      snapFrameRef.current = window.requestAnimationFrame(() => {
        setIsSnapping(true);
        setDragOffsetX(0);
        snapFrameRef.current = null;
      });
      return;
    }

    setActiveIndex(previousIndex);
    setIsSnapping(false);
    setDragOffsetX(-viewportWidth + dragDistance);
    snapFrameRef.current = window.requestAnimationFrame(() => {
      setIsSnapping(true);
      setDragOffsetX(0);
      snapFrameRef.current = null;
    });
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

    setDragOffsetX(0);
    setIsSnapping(false);
  };

  const handleOpenCardNews = (postId: number) => {
    void postId;
    // TODO: 카드뉴스 확장 보기 또는 카드뉴스 상세 화면 라우트가 생기면 연결한다.
  };

  const handleOpenNoticeDetail = (postId: number) => {
    void postId;
    // TODO: 공지 글 상세 페이지 라우트가 생기면 연결한다.
  };

  const handleCardClick = () => {
    if (hasDraggedRef.current || isSnapping) {
      hasDraggedRef.current = false;
      return;
    }

    handleOpenCardNews(activePost.postId);
  };

  const handleNoticeDetailClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleOpenNoticeDetail(activePost.postId);
  };

  const trackStyle = {
    transform: `translate3d(calc(-100% + ${dragOffsetX}px), 0, 0)`,
    transition: isDragging || !isSnapping ? 'none' : 'transform 220ms ease-out',
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

function FeaturedNoticePlaceholder({ children }: { children: string }) {
  return (
    <div className="flex h-[481px] items-center justify-center rounded-2xl bg-[#FAFAFC] px-6 text-center text-[14px] font-medium leading-[1.4] text-[#767676]">
      {children}
    </div>
  );
}

function SectionTitle({ suffix }: { suffix: string }) {
  return (
    <h1 className="flex items-center gap-1 text-[20px] font-bold leading-[1.2] tracking-[-0.02em] text-[#333333]">
      <span>{TEMP_NICKNAME}님을 위한</span>
      <span className="text-[#939393]">{suffix}</span>
    </h1>
  );
}

function SectionHeader({ keyword, suffix }: { keyword: string; suffix: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4">
      <h2 className="flex items-center gap-1 text-[20px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A1A]">
        <span>{keyword}</span>
        <span className="text-[#939393]">{suffix}</span>
      </h2>
      <SeeAllButton />
    </div>
  );
}

function SeeAllButton() {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-1 text-[14px] font-normal leading-[1.2] tracking-[-0.02em] text-[#9D9D9D]"
    >
      모두보기
      <SvgIcon size={8} viewBox="0 0 8 8">
        <path d="m3 1.5 2.5 2.5L3 6.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
      </SvgIcon>
    </button>
  );
}

function FeaturedNoticeCard({ post }: { post: FeedCardPost }) {
  return (
    <article
      className="relative flex h-[481px] overflow-hidden bg-[#D6D8CF] bg-cover bg-center p-4"
      data-post-id={post.postId}
      style={{ backgroundImage: `url(${post.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(51,51,51,0.82)_100%)]" />
      <div className="relative z-10 mt-auto flex w-full flex-col gap-3 pb-16">
        <Tags size="lg" type="tertiary" className="h-8">
          {post.tagName}
        </Tags>
        <div className="flex flex-col gap-1">
          <h2 className="line-clamp-2 text-[20px] font-semibold leading-[1.4] text-white">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-[14px] font-normal leading-[1.4] text-[#DCDFE2]">
            {post.summary}
          </p>
        </div>
      </div>
    </article>
  );
}

function ProgressDots({ total, activeIndex }: { total: number; activeIndex: number }) {
  return (
    <div className="flex h-4 items-center justify-center gap-1" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={
            index === activeIndex
              ? 'h-1 w-4 rounded-full bg-[#292B2C]'
              : 'h-1 w-1 rounded-full border border-[rgba(41,43,44,0.4)] bg-[rgba(41,43,44,0.1)]'
          }
        />
      ))}
    </div>
  );
}

function DeadlineCard({
  daysLeft,
  category,
  title,
  meta,
}: {
  daysLeft: string;
  category: string;
  title: string;
  meta: string;
}) {
  return (
    <article className="flex h-[140px] w-[316px] shrink-0 flex-col gap-3 rounded-2xl bg-[#FAFAFC] p-4">
      <div className="flex items-center gap-1.5">
        <Tags size="lg" type="primary">
          {daysLeft}
        </Tags>
        <span className="inline-flex h-8 items-center justify-center rounded-lg border border-[#DCDFE2] px-2.5 text-[14px] font-medium leading-[1.4] text-[#292B2C]">
          {category}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="whitespace-pre-line text-[16px] font-semibold leading-[1.4] tracking-[0.01em] text-[#333333]">
          {title}
        </h3>
        <p className="text-[14px] font-normal leading-[1.4] text-[#9E9E9E]">{meta}</p>
      </div>
    </article>
  );
}

function CommunityPost({
  hasImage,
  title,
  body,
}: {
  hasImage: boolean;
  title: string;
  body: string;
}) {
  return (
    <article className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FAFAFC] text-[#BFC4C8]">
            <SvgIcon size={16} viewBox="0 0 16 16">
              <path
                d="M8 8.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM3.2 13.3a4.8 4.8 0 0 1 9.6 0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1"
              />
            </SvgIcon>
          </span>
          <span className="text-[14px] font-medium leading-[1.4] text-[#565656]">익명</span>
          <span className="text-[14px] font-semibold leading-[1.4] tracking-[0.015em] text-[#0BC798]">N%가 본 글이에요</span>
        </div>
        <button type="button" className="flex h-4 w-4 shrink-0 items-center justify-center text-[#292B2C]" aria-label="더보기">
          <MoreIcon />
        </button>
      </div>

      <div className="flex gap-3 pl-5">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-semibold leading-[1.4] tracking-[0.01em] text-[#292B2C]">{title}</h3>
          <p className="mt-1 line-clamp-2 text-[14px] font-normal leading-[1.4] text-[#565656]">{body}</p>
          <p className="mt-1 text-[12px] font-normal leading-[1.4] text-[#BFC4C8]">1일전</p>
        </div>
        {hasImage ? <div className="h-[72px] w-[72px] shrink-0 rounded-lg bg-[#FFD36E]" aria-hidden="true" /> : null}
      </div>
    </article>
  );
}

function NotificationButton({ hasNewNotification }: { hasNewNotification: boolean }) {
  return (
    <button
      type="button"
      className="relative flex h-7 w-7 items-center justify-center text-[#BFC4C8]"
      aria-label="알림"
    >
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
      {hasNewNotification ? (
        <span className="absolute right-[5px] top-0.5 h-[7px] w-[7px] rounded-full bg-[#FF5E47]" aria-hidden="true" />
      ) : null}
    </button>
  );
}

function MoreIcon() {
  return (
    <SvgIcon size={16} viewBox="0 0 16 16">
      <path
        d="M8 3.3v.01M8 8v.01M8 12.7v.01"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </SvgIcon>
  );
}
