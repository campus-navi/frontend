import { useEffect, useRef, useState } from 'react';

import type { UniversitySummary } from '@/api/modules/university';
import { ClearIcon, SearchIcon } from '@/features/signup/components/SignupIcons';
import type { SelectedUniversity } from '@/features/signup/types';
import { shouldHideUniversityEmptyState } from '@/features/signup/utils';

type UniversityStepProps = {
  isLoading: boolean;
  isResultsVisible: boolean;
  onRetry: () => void;
  query: string;
  selectedUniversity: SelectedUniversity | null;
  suggestions: UniversitySummary[];
  errorMessage?: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSelect: (value: UniversitySummary) => void;
};

export function UniversityStep({
  isLoading,
  isResultsVisible,
  onRetry,
  query,
  selectedUniversity,
  suggestions,
  errorMessage,
  onChange,
  onClear,
  onSelect,
}: UniversityStepProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const shouldHideEmptyState = shouldHideUniversityEmptyState(query);
  const shouldRenderEmptyState = !isLoading && !errorMessage && suggestions.length === 0 && !shouldHideEmptyState;

  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const updateFade = () => {
      const { scrollTop, scrollHeight, clientHeight } = list;
      setShowTopFade(scrollTop > 4);
      setShowBottomFade(scrollTop + clientHeight < scrollHeight - 4);
    };

    updateFade();
    list.addEventListener('scroll', updateFade, { passive: true });
    window.addEventListener('resize', updateFade);

    return () => {
      list.removeEventListener('scroll', updateFade);
      window.removeEventListener('resize', updateFade);
    };
  }, [suggestions, errorMessage, isLoading, isResultsVisible]);

  useEffect(() => {
    if (!isResultsVisible || !shouldRenderEmptyState) {
      setShowEmptyState(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowEmptyState(true);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [isResultsVisible, shouldRenderEmptyState, query]);

  return (
    <div className="flex h-full min-h-0 flex-col items-start overflow-hidden">
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        현재 다니고 계시는
        <br />
        대학교 이름을 입력해주세요.
      </h1>
      <p className="mt-10 text-[15px] font-medium leading-none text-[#7E7E7E]">대학인증</p>

      <div className="mt-5 w-full border-b border-[#E1E1E1] focus-within:border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(event) => onChange(event.target.value)}
            placeholder="대학교 이름을 작성해주세요"
            className="h-12 flex-1 border-0 bg-transparent px-0 text-[17px] text-[#202020] placeholder:text-[#B9B9B9] focus:outline-none"
          />
          <div className="flex items-center gap-2 text-[#2C2C2C]">
            {query ? (
              <button type="button" onClick={onClear} aria-label="입력값 지우기" className="text-[#C1C1C1]">
                <ClearIcon />
              </button>
            ) : null}
            <SearchIcon />
          </div>
        </div>
      </div>

      {isResultsVisible ? (
        <div className="relative mt-6 flex min-h-0 w-full flex-1 flex-col overflow-hidden">
          <p className="mb-3 text-[14px] font-semibold text-[#515151]">검색 결과</p>

          {isLoading ? <p className="text-[15px] text-[#8B8B8B]">대학 목록을 불러오는 중입니다.</p> : null}

          {!isLoading && errorMessage ? (
            <div className="border-b border-[#E7E7E7] pb-4">
              <p className="text-[15px] font-semibold text-[#BE4A4A]">대학 목록을 불러오지 못했어요.</p>
              <p className="mt-2 text-[14px] leading-6 text-[#7D7D7D]">{errorMessage}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 text-[15px] font-semibold text-[#303030] underline underline-offset-4"
              >
                다시 시도
              </button>
            </div>
          ) : null}

          {showEmptyState ? (
            <div className="border-b border-[#E7E7E7] pb-4">
              <p className="text-[15px] font-semibold text-[#444444]">조회된 대학이 없어요.</p>
              <p className="mt-2 text-[14px] leading-6 text-[#7D7D7D]">
                학교 이름을 다시 확인해 주세요. 띄어쓰기 없이 입력해도 검색할 수 있어요.
              </p>
            </div>
          ) : null}

          {!isLoading && !errorMessage && suggestions.length > 0 ? (
            <ul
              ref={listRef}
              className="flex min-h-0 flex-1 w-full flex-col items-start gap-[6px] overflow-y-auto overscroll-contain pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {suggestions.map((item) => {
                const isSelected = selectedUniversity?.campusId === item.campusId;

                return (
                  <li key={item.campusId} className="w-full">
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      className="flex min-h-[42px] w-full items-center gap-3 px-3 text-left"
                    >
                      <span className={['h-4 w-4 flex-none rounded-[2px]', isSelected ? 'bg-[#6C6C6C]' : 'bg-[#EFEFEF]'].join(' ')} />
                      <span className="text-[15px] font-semibold leading-[1.35] text-[#404040]">{item.universityName}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {showTopFade && suggestions.length > 0 ? (
            <div className="pointer-events-none absolute inset-x-0 top-6 h-8 bg-gradient-to-b from-white via-white/82 to-transparent" />
          ) : null}
          {showBottomFade && suggestions.length > 0 ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/86 to-transparent" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
