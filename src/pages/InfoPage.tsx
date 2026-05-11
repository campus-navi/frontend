import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import type { OfficialPostSummary } from '@/api';
import { AppHeader } from '@/components/ui/AppHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { useOfficialPostList } from '@/features/info/hooks/useOfficialPostList';

export default function InfoPage() {
  const navigate = useNavigate();
  const { data: officialPostList, isError, isLoading } = useOfficialPostList();
  const posts = officialPostList?.content ?? [];

  const handlePostClick = (postId: number) => {
    navigate(`/info/posts/${postId}`);
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[86px]">
        <AppHeader title="교내정보" />

        <section className="flex flex-1 flex-col px-5 py-6">
          <h1 className="text-[24px] font-bold leading-[1.4] text-[#292B2C]">교내정보</h1>

          {isLoading ? <InfoPageMessage><LoadingSpinner ariaLabel="교내정보 목록을 불러오는 중" className="h-8 w-8 text-[#292B2C]" /></InfoPageMessage> : null}
          {isError ? <InfoPageMessage>교내정보 목록을 불러오지 못했어요.</InfoPageMessage> : null}
          {!isLoading && !isError && posts.length === 0 ? <InfoPageMessage>표시할 교내정보 글이 없어요.</InfoPageMessage> : null}
          {!isLoading && !isError && posts.length > 0 ? (
            <ul className="mt-6 flex flex-col divide-y divide-[#ECEEF0]">
              {posts.map((post) => (
                <li key={post.postId}>
                  <OfficialPostListItem post={post} onClick={() => handlePostClick(post.postId)} />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>

      <MobileGnb activeItem="info" />
    </main>
  );
}

function InfoPageMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-2 py-10 text-center text-[16px] font-medium leading-[1.5] text-[#565656]">
      {children}
    </div>
  );
}

function OfficialPostListItem({ onClick, post }: { onClick: () => void; post: OfficialPostSummary }) {
  return (
    <button
      type="button"
      className="flex w-full flex-col gap-2 py-4 text-left"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0 rounded-lg bg-[#F1F3F5] px-2 py-1 text-[12px] font-semibold leading-[1.4] text-[#565656]">
          {post.tagName}
        </span>
        <span className="min-w-0 text-[13px] font-normal leading-[1.4] text-[#9D9D9D]">
          {post.publishedAt}
        </span>
      </div>
      <h2 className="line-clamp-2 text-[16px] font-semibold leading-[1.45] text-[#292B2C]">
        {post.title}
      </h2>
      <p className="text-[13px] font-normal leading-[1.4] text-[#767676]">
        마감일 {post.endDate ?? '-'}
      </p>
    </button>
  );
}
