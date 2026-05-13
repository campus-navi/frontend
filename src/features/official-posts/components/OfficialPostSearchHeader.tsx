import type { FormEvent } from 'react';
import { useEffect, useRef } from 'react';

import { SvgIcon } from '@/components/ui/SvgIcon';

type OfficialPostSearchHeaderProps = {
  inputValue: string;
  onBack: () => void;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
};

export function OfficialPostSearchHeader({
  inputValue,
  onBack,
  onInputChange,
  onSubmit,
}: OfficialPostSearchHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      className="flex h-20 w-full items-center gap-2 px-4 py-4"
      role="search"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="flex h-8 w-6 shrink-0 items-center justify-start text-[#292B2C]"
        aria-label="교내정보 목록으로 돌아가기"
        onClick={onBack}
      >
        <SvgIcon size={24} viewBox="0 0 24 24">
          <path
            d="m15 5-7 7 7 7"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </SvgIcon>
      </button>

      <label className="flex h-12 min-w-0 flex-1 items-center justify-between rounded-full bg-[#F5F7FA] px-3 text-[#BFC4C8]">
        <span className="sr-only">교내정보 검색어</span>
        <input
          ref={inputRef}
          type="search"
          className="min-w-0 flex-1 bg-transparent text-[16px] font-normal leading-[1.4] text-[#292B2C] outline-none placeholder:text-[#BFC4C8] [appearance:textfield] [&::-webkit-search-cancel-button]:hidden"
          placeholder="키워드로 검색해보세요"
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
        />
        <button
          type="submit"
          className="flex h-8 w-8 shrink-0 items-center justify-end text-[#BFC4C8]"
          aria-label="검색"
        >
          <SvgIcon size={24} viewBox="0 0 24 24">
            <path
              d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Zm5.2-2.1 4 4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </SvgIcon>
        </button>
      </label>
    </form>
  );
}
