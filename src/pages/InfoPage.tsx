import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { OfficialPostListParams } from '@/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MobileGnb } from '@/components/ui/MobileGnb';
import { useOfficialPostList } from '@/features/official-posts/hooks/useOfficialPostList';
import {
  OfficialPostListControls,
  type OfficialPostCategoryFilter,
  type OfficialPostSortFilter,
} from '@/features/official-posts/components/OfficialPostListControls';
import { OfficialPostListItem } from '@/features/official-posts/components/OfficialPostListItem';
import {
  officialPostCategoryTagCodeMap,
  officialPostSortMap,
} from '@/features/official-posts/officialPostFilters';

export default function InfoPage() {
  const navigate = useNavigate();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<OfficialPostCategoryFilter>('전체');
  const [selectedSort, setSelectedSort] = useState<OfficialPostSortFilter>('최신순');
  const officialPostListParams = useMemo<OfficialPostListParams>(
    () => ({
      sort: officialPostSortMap[selectedSort],
      tagCode: officialPostCategoryTagCodeMap[selectedCategory],
    }),
    [selectedCategory, selectedSort],
  );
  const {
    data: officialPostList,
    isError,
    isLoading,
  } = useOfficialPostList(officialPostListParams);
  const posts = officialPostList?.content ?? [];

  const handlePostClick = (postId: number) => {
    navigate(`/info/posts/${postId}`);
  };

  return (
    <main className="min-h-[100svh] bg-white">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[393px] flex-col bg-white pb-[86px]">
        <OfficialPostListControls
          isFilterSheetOpen={isFilterSheetOpen}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          isSearchInputSticky
          onCategoryChange={setSelectedCategory}
          onCloseSheet={() => setIsFilterSheetOpen(false)}
          onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
          onResetCategory={() => setSelectedCategory('전체')}
          onResetSort={() => setSelectedSort('최신순')}
          onSearchClick={() => navigate('/info/search')}
          onSortChange={setSelectedSort}
        />

        <section className="flex flex-1 flex-col px-4 py-4">
          {isLoading ? (
            <InfoPageMessage>
              <LoadingSpinner
                ariaLabel="교내정보 목록을 불러오는 중"
                className="h-8 w-8 text-[#292B2C]"
              />
            </InfoPageMessage>
          ) : null}
          {isError ? <InfoPageMessage>교내정보 목록을 불러오지 못했어요.</InfoPageMessage> : null}
          {!isLoading && !isError && posts.length === 0 ? (
            <InfoPageMessage>표시할 교내정보 글이 없어요.</InfoPageMessage>
          ) : null}
          {!isLoading && !isError && posts.length > 0 ? (
            <ul className="flex flex-col gap-6">
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
