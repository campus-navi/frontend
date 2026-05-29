import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { OfficialPostListParams } from '@/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  OfficialPostListControls,
  type OfficialPostCategoryFilter,
  type OfficialPostSortFilter,
} from '@/features/official-posts/components/OfficialPostListControls';
import { OfficialPostListItem } from '@/features/official-posts/components/OfficialPostListItem';
import { OfficialPostRecentSearches } from '@/features/official-posts/components/OfficialPostRecentSearches';
import { OfficialPostSearchHeader } from '@/features/official-posts/components/OfficialPostSearchHeader';
import { useOfficialPostList } from '@/features/official-posts/hooks/useOfficialPostList';
import {
  officialPostCategoryTagCodeMap,
  officialPostSortMap,
} from '@/features/official-posts/officialPostFilters';
import {
  addRecentOfficialPostSearch,
  clearRecentOfficialPostSearches,
  getRecentOfficialPostSearches,
  removeRecentOfficialPostSearch,
} from '@/features/official-posts/recentOfficialPostSearches';

export default function InfoSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSearchTerm = searchParams.get('q')?.trim() ?? '';
  const [inputValue, setInputValue] = useState(currentSearchTerm);
  const [submittedQuery, setSubmittedQuery] = useState(currentSearchTerm);
  const [recentSearches, setRecentSearches] = useState(() => getRecentOfficialPostSearches());
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<OfficialPostCategoryFilter>('전체');
  const [selectedSort, setSelectedSort] = useState<OfficialPostSortFilter>('최신순');
  const hasInputValue = inputValue.trim().length > 0;
  const hasSubmittedQuery = submittedQuery.length > 0;
  const shouldShowResults =
    hasInputValue && hasSubmittedQuery && inputValue.trim() === submittedQuery;

  useEffect(() => {
    setInputValue(currentSearchTerm);
    setSubmittedQuery(currentSearchTerm);
  }, [currentSearchTerm]);

  const officialPostListParams = useMemo<OfficialPostListParams>(
    () => ({
      q: hasSubmittedQuery ? submittedQuery : undefined,
      sort: officialPostSortMap[selectedSort],
      tagCode: officialPostCategoryTagCodeMap[selectedCategory],
    }),
    [hasSubmittedQuery, selectedCategory, selectedSort, submittedQuery],
  );
  const {
    data: officialPostList,
    isError,
    isLoading,
  } = useOfficialPostList(officialPostListParams, {
    enabled: shouldShowResults,
    placeholderData: 'keepSameQuery',
  });
  const posts = officialPostList?.content ?? [];

  const runSearch = (searchTerm: string) => {
    const normalizedSearchTerm = searchTerm.trim();

    if (!normalizedSearchTerm) {
      return;
    }

    setInputValue(normalizedSearchTerm);
    setSubmittedQuery(normalizedSearchTerm);
    setRecentSearches(addRecentOfficialPostSearch(normalizedSearchTerm));
    setSearchParams({ q: normalizedSearchTerm });
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (value.trim().length === 0) {
      setSubmittedQuery('');
    }
  };

  const handlePostClick = (postId: number) => {
    navigate(`/info/posts/${postId}`);
  };

  const pageClassName = shouldShowResults ? 'min-h-[100svh]' : 'h-[100dvh] overflow-hidden';
  const contentClassName = shouldShowResults
    ? 'min-h-[100svh]'
    : 'h-full overflow-hidden';

  return (
    <main className={`bg-white ${pageClassName}`}>
      <div className={`mx-auto flex w-full max-w-[393px] flex-col bg-white ${contentClassName}`}>
        <div className="sticky top-0 z-20 bg-white">
          <OfficialPostSearchHeader
            inputValue={inputValue}
            onBack={() => navigate('/info')}
            onInputChange={handleInputChange}
            onSubmit={() => runSearch(inputValue)}
          />
        </div>

        {shouldShowResults ? (
          <>
            <OfficialPostListControls
              isFilterSheetOpen={isFilterSheetOpen}
              selectedCategory={selectedCategory}
              selectedSort={selectedSort}
              showSearchInput={false}
              onCategoryChange={setSelectedCategory}
              onCloseSheet={() => setIsFilterSheetOpen(false)}
              onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
              onResetCategory={() => setSelectedCategory('전체')}
              onResetSort={() => setSelectedSort('최신순')}
              onSortChange={setSelectedSort}
            />

            <section className="flex flex-col px-4 py-4">
              {isLoading ? (
                <InfoSearchPageMessage>
                  <LoadingSpinner
                    ariaLabel="교내정보 검색 결과를 불러오는 중"
                    className="h-8 w-8 text-[#292B2C]"
                  />
                </InfoSearchPageMessage>
              ) : null}
              {isError ? (
                <InfoSearchPageMessage>검색 결과를 불러오지 못했어요.</InfoSearchPageMessage>
              ) : null}
              {!isLoading && !isError && posts.length === 0 ? (
                <InfoSearchPageMessage>검색 결과가 없어요.</InfoSearchPageMessage>
              ) : null}
              {!isLoading && !isError && posts.length > 0 ? (
                <ul className="flex flex-col gap-8">
                  {posts.map((post) => (
                    <li key={post.postId}>
                      <OfficialPostListItem
                        post={post}
                        onClick={() => handlePostClick(post.postId)}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          </>
        ) : (
          <div className="min-h-0 flex-1">
            <OfficialPostRecentSearches
              searches={recentSearches}
              onClearAll={() => setRecentSearches(clearRecentOfficialPostSearches())}
              onRemove={(searchTerm) => setRecentSearches(removeRecentOfficialPostSearch(searchTerm))}
              onSelect={runSearch}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function InfoSearchPageMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-2 py-10 text-center text-[16px] font-medium leading-[1.5] text-[#565656]">
      {children}
    </div>
  );
}
