import type { ReactNode } from 'react';

import { AppHeader } from '@/components/ui/AppHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DeadlinePostListItem } from '@/features/deadlines/components/DeadlinePostListItem';
import type { DeadlinesViewModel } from '@/features/deadlines/types';

export function DeadlinesView({
  onBack,
  onPostClick,
  posts,
  shouldShowEmptyMessage,
  shouldShowErrorMessage,
  shouldShowLoadingMessage,
}: DeadlinesViewModel) {
  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader
          title="마감임박 공지"
          onBack={onBack}
          className="sticky top-0 z-20 bg-white"
        />

        <section className="flex flex-1 flex-col px-4 py-5">
          {shouldShowLoadingMessage ? (
            <DeadlinesPageMessage>
              <LoadingSpinner
                ariaLabel="마감임박 공지 전체 목록을 불러오는 중"
                className="h-8 w-8 text-[#292B2C]"
              />
            </DeadlinesPageMessage>
          ) : null}
          {shouldShowErrorMessage ? (
            <DeadlinesPageMessage>마감임박 공지를 불러오지 못했어요.</DeadlinesPageMessage>
          ) : null}
          {shouldShowEmptyMessage ? (
            <DeadlinesPageMessage>마감임박 공지가 없어요.</DeadlinesPageMessage>
          ) : null}
          {!shouldShowLoadingMessage &&
          !shouldShowErrorMessage &&
          !shouldShowEmptyMessage ? (
            <ul className="flex flex-col gap-8">
              {posts.map((post) => (
                <li key={post.postId}>
                  <DeadlinePostListItem
                    post={post}
                    onClick={() => onPostClick(post.postId)}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function DeadlinesPageMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-2 py-10 text-center text-[16px] font-medium leading-[1.5] text-[#565656]">
      {children}
    </div>
  );
}
