import { useEffect, useRef, useState } from 'react';

import { ClearIcon, SearchIcon } from '@/features/signup/components/SignupIcons';
import type { SearchSelectStepProps } from '@/features/signup/types';

export function SearchSelectField({
  emptyDescription,
  emptyMessage,
  errorMessage,
  hideEmptyState = false,
  isLoading,
  isResultsVisible = true,
  label,
  loadingMessage = '목록을 불러오는 중입니다.',
  onRetry,
  resultsLabel = '검색 결과',
  title,
  placeholder,
  selectedSuggestionId,
  value,
  suggestions,
  onChange,
  onClear,
  onSelect,
}: SearchSelectStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const hasQuery = value.trim().length > 0;
  const shouldShowResults = isResultsVisible && hasQuery;
  const shouldRenderEmptyState = !hideEmptyState && !isLoading && !errorMessage && suggestions.length === 0 && hasQuery;

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
  }, [errorMessage, isLoading, shouldShowResults, suggestions]);

  useEffect(() => {
    if (!shouldShowResults || !shouldRenderEmptyState) {
      setShowEmptyState(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowEmptyState(true);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [shouldRenderEmptyState, shouldShowResults, value]);

  useEffect(() => {
    const updateInputFocus = () => {
      setIsInputFocused(document.activeElement === inputRef.current);
    };

    updateInputFocus();
    document.addEventListener('focusin', updateInputFocus);
    document.addEventListener('focusout', updateInputFocus);

    return () => {
      document.removeEventListener('focusin', updateInputFocus);
      document.removeEventListener('focusout', updateInputFocus);
    };
  }, []);

  return (
    <div className="flex h-full flex-col items-start">
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">{title}</h1>
      <p className="mt-10 text-[15px] font-medium leading-none text-[#7E7E7E]">{label}</p>

      <div className="mt-5 w-full border-b border-[#E1E1E1] focus-within:border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-12 flex-1 border-0 bg-transparent px-0 text-[17px] text-[#202020] placeholder:text-[#B9B9B9] focus:outline-none"
          />
          <div className="flex items-center gap-2 text-[#2C2C2C]">
            {value && isInputFocused ? (
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={onClear}
                aria-label="입력값 지우기"
                className="text-[#C1C1C1]"
              >
                <ClearIcon />
              </button>
            ) : null}
            <SearchIcon />
          </div>
        </div>
      </div>

      {shouldShowResults ? (
        <div className="relative mt-6 flex min-h-0 w-full flex-1 flex-col overflow-hidden">
          <p className="mb-3 text-[14px] font-semibold text-[#515151]">{resultsLabel}</p>

          {isLoading ? <p className="text-[15px] text-[#8B8B8B]">{loadingMessage}</p> : null}

          {!isLoading && errorMessage ? (
            <div className="border-b border-[#E7E7E7] pb-4">
              <p className="text-[15px] font-semibold text-[#BE4A4A]">목록을 불러오지 못했어요.</p>
              <p className="mt-2 text-[14px] leading-6 text-[#7D7D7D]">{errorMessage}</p>
              {onRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-4 text-[15px] font-semibold text-[#303030] underline underline-offset-4"
                >
                  다시 시도
                </button>
              ) : null}
            </div>
          ) : null}

          {showEmptyState && emptyMessage ? (
            <div className="border-b border-[#E7E7E7] pb-4">
              <p className="text-[15px] font-semibold text-[#444444]">{emptyMessage}</p>
              {emptyDescription ? <p className="mt-2 text-[14px] leading-6 text-[#7D7D7D]">{emptyDescription}</p> : null}
            </div>
          ) : null}

          {!isLoading && !errorMessage && suggestions.length > 0 ? (
            <div className="relative min-h-0 w-full flex-1">
              <ul
                ref={listRef}
                className="flex min-h-0 flex-1 w-full flex-col items-start gap-[6px] overflow-y-auto overscroll-contain pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {suggestions.map((item) => (
                  <li key={item.id} className="w-full">
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      className="flex min-h-[42px] w-full items-center gap-3 px-3 text-left"
                    >
                      <span
                        className={[
                          'h-4 w-4 flex-none rounded-[2px]',
                          selectedSuggestionId === item.id ? 'bg-[#6C6C6C]' : 'bg-[#EFEFEF]',
                        ].join(' ')}
                      />
                      <span className="text-[15px] font-semibold leading-[1.35] text-[#404040]">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {showTopFade && suggestions.length > 0 ? (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white via-white/82 to-transparent" />
              ) : null}
              {showBottomFade && suggestions.length > 0 ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/86 to-transparent" />
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
