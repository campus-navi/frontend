import { useEffect, useRef, useState } from 'react';

import { ClearIcon, SearchIcon } from '@/features/signup/components/SignupIcons';
import type { SearchSelectStepProps } from '@/features/signup/types';

export function SearchSelectField({
  label,
  title,
  placeholder,
  selectedSuggestionId,
  value,
  suggestions,
  onChange,
  onClear,
  onSelect,
}: SearchSelectStepProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

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
  }, [suggestions]);

  return (
    <div className="flex h-full flex-col items-start">
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">{title}</h1>
      <p className="mt-10 text-[15px] font-medium leading-none text-[#7E7E7E]">{label}</p>

      <div className="mt-5 w-full border-b border-[#E1E1E1] focus-within:border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-12 flex-1 border-0 bg-transparent px-0 text-[17px] text-[#202020] placeholder:text-[#B9B9B9] focus:outline-none"
          />
          <div className="flex items-center gap-2 text-[#2C2C2C]">
            {value ? (
              <button type="button" onClick={onClear} aria-label="입력값 지우기" className="text-[#C1C1C1]">
                <ClearIcon />
              </button>
            ) : null}
            <SearchIcon />
          </div>
        </div>
      </div>

      {suggestions.length > 0 ? (
        <div className="relative mt-6 w-full flex-1">
          <ul
            ref={listRef}
            className="flex h-full max-h-[min(460px,calc(100svh-300px))] min-h-[120px] w-full flex-col items-start gap-[6px] overflow-y-auto overscroll-contain pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {suggestions.map((item) => (
              <li key={item.id} className="w-full flex-none">
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="flex min-h-[42px] w-full items-center gap-3 text-left"
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
          {showTopFade ? (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white via-white/82 to-transparent" />
          ) : null}
          {showBottomFade ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/86 to-transparent" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
