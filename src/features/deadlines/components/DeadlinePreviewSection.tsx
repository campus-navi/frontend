import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SvgIcon } from '@/components/ui/SvgIcon';
import { DeadlinePostCard } from '@/features/deadlines/components/DeadlinePostCard';
import { useDeadlinePreview } from '@/features/deadlines/hooks/useDeadlinePreview';
import { useDeadlinePreviewScroll } from '@/features/deadlines/hooks/useDeadlinePreviewScroll';

const MAX_PREVIEW_POSTS = 8;

export function DeadlinePreviewSection() {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useDeadlinePreview();
  const { handlers: scrollHandlers, scrollRef } = useDeadlinePreviewScroll();
  const posts = data?.posts.slice(0, MAX_PREVIEW_POSTS) ?? [];

  return (
    <section className="flex flex-col gap-4 bg-white py-5">
      <div className="flex items-center justify-between gap-3 px-4">
        <h2 className="text-[20px] font-bold leading-[1.2] tracking-[-0.02em] text-[#1A1A1A]">
          마감임박 공지
        </h2>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-[14px] font-normal leading-[1.2] tracking-[-0.02em] text-[#9D9D9D]"
          onClick={() => navigate('/deadlines')}
        >
          모두보기
          <SvgIcon size={8} viewBox="0 0 8 8">
            <path
              d="m3 1.5 2.5 2.5L3 6.5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.2"
            />
          </SvgIcon>
        </button>
      </div>

      {isLoading ? (
        <DeadlinePreviewMessage>
          <LoadingSpinner ariaLabel="마감임박 공지를 불러오는 중" className="h-7 w-7" />
        </DeadlinePreviewMessage>
      ) : null}
      {isError ? (
        <DeadlinePreviewMessage>마감임박 공지를 불러오지 못했어요.</DeadlinePreviewMessage>
      ) : null}
      {!isLoading && !isError && posts.length === 0 ? (
        <DeadlinePreviewMessage>마감임박 공지가 없어요.</DeadlinePreviewMessage>
      ) : null}
      {!isLoading && !isError && posts.length > 0 ? (
        <div
          ref={scrollRef}
          className="flex cursor-grab gap-3 overflow-x-auto px-4 pb-1 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="마감임박 공지 미리보기 목록"
          onPointerDown={scrollHandlers.onPointerDown}
          onPointerMove={scrollHandlers.onPointerMove}
          onPointerUp={scrollHandlers.onPointerUp}
          onPointerCancel={scrollHandlers.onPointerCancel}
          onClickCapture={scrollHandlers.onClickCapture}
        >
          {posts.map((post) => (
            <DeadlinePostCard
              key={post.postId}
              post={post}
              onClick={() => navigate(`/info/posts/${post.postId}`)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function DeadlinePreviewMessage({ children }: { children: ReactNode }) {
  return (
    <div className="mx-4 flex h-[156px] items-center justify-center rounded-2xl bg-[#FAFAFC] px-6 text-center text-[14px] font-medium leading-[1.4] text-[#767676]">
      {children}
    </div>
  );
}
