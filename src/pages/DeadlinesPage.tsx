import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DeadlinePostListItem } from '@/features/deadlines/components/DeadlinePostListItem';
import { useDeadlines } from '@/features/deadlines/hooks/useDeadlines';

export default function DeadlinesPage() {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useDeadlines();
  const posts = data?.posts ?? [];

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white">
        <AppHeader
          title="마감임박 공지"
          onBack={() => navigate(-1)}
          className="sticky top-0 z-20 bg-white"
        />

        <section className="flex flex-1 flex-col px-4 py-5">
          {isLoading ? (
            <DeadlinesPageMessage>
              <LoadingSpinner
                ariaLabel="마감임박 공지 전체 목록을 불러오는 중"
                className="h-8 w-8 text-[#292B2C]"
              />
            </DeadlinesPageMessage>
          ) : null}
          {isError ? (
            <DeadlinesPageMessage>마감임박 공지를 불러오지 못했어요.</DeadlinesPageMessage>
          ) : null}
          {!isLoading && !isError && posts.length === 0 ? (
            <DeadlinesPageMessage>마감임박 공지가 없어요.</DeadlinesPageMessage>
          ) : null}
          {!isLoading && !isError && posts.length > 0 ? (
            <ul className="flex flex-col gap-8">
              {posts.map((post) => (
                <li key={post.postId}>
                  <DeadlinePostListItem
                    post={post}
                    onClick={() => navigate(`/info/posts/${post.postId}`)}
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
