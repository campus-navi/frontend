import { useRef, type MouseEvent, type PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';
import { SvgIcon } from '@/components/ui/SvgIcon';
import type { MyPageRecentScrap, MyPageScrapFolder } from '@/api';
import { useMyPageScraps } from '@/features/mypage/hooks/useMyPageScraps';

export default function MyPageScrapsPage() {
  const navigate = useNavigate();
  const { data: scraps, isError, isLoading } = useMyPageScraps();
  const recentScraps = scraps?.recentScraps ?? [];
  const folders = scraps?.folders ?? [];
  const recentScrapsRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({
    isDragging: false,
    hasDragged: false,
    startX: 0,
    scrollLeft: 0,
  });

  const handleRecentScrapsPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const container = recentScrapsRef.current;
    if (!container || event.pointerType === 'touch') {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      hasDragged: false,
      startX: event.clientX,
      scrollLeft: container.scrollLeft,
    };
    container.setPointerCapture(event.pointerId);
  };

  const handleRecentScrapsPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const container = recentScrapsRef.current;
    const dragState = dragStateRef.current;
    if (!container || !dragState.isDragging) {
      return;
    }

    const moveDistance = event.clientX - dragState.startX;
    if (Math.abs(moveDistance) < 6) {
      return;
    }

    dragState.hasDragged = true;
    event.preventDefault();
    container.scrollLeft = dragState.scrollLeft - moveDistance;
  };

  const handleRecentScrapsPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const container = recentScrapsRef.current;
    if (container?.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current.isDragging = false;
  };

  const handleRecentScrapsClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.hasDragged) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current.hasDragged = false;
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader
          title="스크랩 설정"
          onBack={() => navigate('/mypage', { replace: true })}
          className="bg-white"
        />

        <section className="flex flex-1 flex-col gap-1.5 pb-[max(32px,env(safe-area-inset-bottom))]">
          <h1 className="sr-only">스크랩 설정</h1>

          {isLoading ? (
            <div className="mx-4 mt-4 rounded-xl bg-[#F6F7F9] px-4 py-3 text-[14px] font-medium leading-[1.4] text-[#565656]">
              스크랩 정보를 불러오는 중이에요.
            </div>
          ) : null}

          {isError ? (
            <div className="mx-4 mt-4 rounded-xl bg-[#FFF4F2] px-4 py-3 text-[14px] font-medium leading-[1.4] text-[#FF5E47]">
              스크랩 정보를 불러오지 못했어요.
            </div>
          ) : null}

          <section className="bg-white pb-5 pt-4" aria-labelledby="recent-scraps-title">
            <div className="px-4">
              <h2
                id="recent-scraps-title"
                className="text-base font-semibold leading-[1.4] tracking-normal text-[#292B2C]"
              >
                최근 스크랩
              </h2>
            </div>

            <div
              ref={recentScrapsRef}
              className="mt-3 flex cursor-grab gap-3 overflow-x-auto px-4 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="최근 스크랩 목록"
              onPointerDown={handleRecentScrapsPointerDown}
              onPointerMove={handleRecentScrapsPointerMove}
              onPointerUp={handleRecentScrapsPointerUp}
              onPointerCancel={handleRecentScrapsPointerUp}
              onClickCapture={handleRecentScrapsClickCapture}
            >
              {recentScraps.map((scrap) => (
                <RecentScrapCard key={scrap.postId} scrap={scrap} />
              ))}

              {!isLoading && !isError && recentScraps.length === 0 ? (
                <EmptyStateMessage message="최근 스크랩한 공지가 없습니다." />
              ) : null}
            </div>
          </section>

          <section className="flex flex-col bg-white pb-6 pt-2" aria-labelledby="scrap-folders-title">
            <h2 id="scrap-folders-title" className="sr-only">
              스크랩 폴더
            </h2>

            <div className="flex h-[52px] items-center px-4 py-2">
              <div className="flex h-9 items-center gap-0 rounded-full border border-[#DCDFE2] py-2.5 pl-4 pr-3 text-base font-medium leading-none text-[#565656]">
                <span>최근 저장</span>
                <span className="ml-1 flex h-4 w-4 items-center justify-center" aria-hidden="true">
                  <span className="h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-[#565656]" />
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-col">
              {folders.map((folder) => (
                <ScrapFolderRow key={folder.folderId} folder={folder} />
              ))}

              {!isLoading && !isError && folders.length === 0 ? (
                <div className="px-4">
                  <EmptyStateMessage message="스크랩 폴더가 없습니다." />
                </div>
              ) : null}
            </div>

            <div className="h-[127px] shrink-0" aria-hidden="true" />

            <div className="pointer-events-none fixed bottom-[59px] left-1/2 z-10 flex w-full max-w-[393px] -translate-x-1/2 justify-center px-4">
              <div
                className="inline-flex h-[52px] items-center gap-1.5 rounded-full bg-[#292B2C] px-7 text-base font-semibold leading-none text-white"
                aria-hidden="true"
              >
                <PlusIcon />
                <span>새폴더 추가</span>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function RecentScrapCard({ scrap }: { scrap: MyPageRecentScrap }) {
  return (
    <article className="w-[316px] shrink-0 rounded-2xl bg-[#FAFBFD] p-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-1.5">
          <span className="rounded-lg bg-[#292B2C] px-2.5 py-1.5 text-sm font-medium leading-[1.4] text-white">
            {scrap.endDate ?? '마감일 없음'}
          </span>
          <span className="rounded-lg border border-[#DCDFE2] px-2.5 py-1.5 text-sm font-medium leading-[1.4] text-[#292B2C]">
            {scrap.tagName}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-2 whitespace-pre-line text-base font-semibold leading-[1.4] tracking-normal text-[#292B2C]">
            {scrap.title}
          </h3>
          <p className="text-xs font-medium leading-[1.4] tracking-normal text-[#BFC4C8]">
            {scrap.publishedAt}
          </p>
        </div>
      </div>
    </article>
  );
}

function ScrapFolderRow({ folder }: { folder: MyPageScrapFolder }) {
  return (
    <article className="flex h-[72px] items-center justify-between px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <h3 className="truncate text-base font-medium leading-[1.4] tracking-normal text-[#292B2C]">
            {folder.name}
          </h3>
          <span className="text-base font-semibold leading-[1.4] tracking-normal text-[#0BC798]">
            {folder.scrapCount}
          </span>
        </div>
        <p className="mt-1.5 truncate text-sm font-normal leading-[1.4] tracking-normal text-[#BFC4C8]">
          {folder.description}
        </p>
      </div>

      <span className="ml-4 flex h-4 w-4 shrink-0 items-center justify-center text-[#292B2C]" aria-hidden="true">
        <MoreIcon />
      </span>
    </article>
  );
}

function EmptyStateMessage({ message }: { message: string }) {
  return (
    <p className="flex min-h-[72px] w-full items-center rounded-2xl bg-[#FAFBFD] px-4 text-sm font-medium leading-[1.4] tracking-normal text-[#8A9199]">
      {message}
    </p>
  );
}

function MoreIcon() {
  return (
    <SvgIcon size={16} viewBox="0 0 16 16">
      <circle cx="8" cy="3.5" r="1.25" fill="currentColor" />
      <circle cx="8" cy="8" r="1.25" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.25" fill="currentColor" />
    </SvgIcon>
  );
}

function PlusIcon() {
  return (
    <SvgIcon size={20} viewBox="0 0 20 20">
      <path d="M10 4.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.5 10H15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}
