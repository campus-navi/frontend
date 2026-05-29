import { SvgIcon } from '@/components/ui/SvgIcon';

type OfficialPostRecentSearchesProps = {
  searches: string[];
  onClearAll: () => void;
  onRemove: (searchTerm: string) => void;
  onSelect: (searchTerm: string) => void;
};

export function OfficialPostRecentSearches({
  searches,
  onClearAll,
  onRemove,
  onSelect,
}: OfficialPostRecentSearchesProps) {
  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-b-2xl bg-white"
      aria-labelledby="recent-official-post-searches-title"
    >
      <div className="flex w-full shrink-0 items-center justify-between px-4 py-5">
        <h2
          id="recent-official-post-searches-title"
          className="text-[16px] font-semibold leading-[1.4] text-[#2C2C2E]"
        >
          최근 검색 기록
        </h2>
        {searches.length > 0 ? (
          <button
            type="button"
            className="text-[14px] font-medium leading-[1.4] text-[#C2C2C2]"
            onClick={onClearAll}
          >
            전체 삭제
          </button>
        ) : null}
      </div>

      {searches.length > 0 ? (
        <ul className="flex min-h-0 w-full flex-1 flex-col gap-1 overflow-y-auto px-4 pb-5">
          {searches.map((searchTerm) => (
            <li key={searchTerm} className="flex w-full items-center justify-between py-2">
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-0.5 text-left"
                onClick={() => onSelect(searchTerm)}
              >
                <RecentIcon />
                <span className="min-w-0 truncate text-[16px] font-medium leading-[1.4] text-[#333333]">
                  {searchTerm}
                </span>
              </button>
              <button
                type="button"
                className="flex h-6 w-6 shrink-0 items-center justify-end text-[#565656]"
                aria-label={`${searchTerm} 최근 검색어 삭제`}
                onClick={() => onRemove(searchTerm)}
              >
                <SvgIcon size={20} viewBox="0 0 20 20">
                  <path
                    d="m7.5 7.5 5 5M12.5 7.5l-5 5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  />
                </SvgIcon>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-8 text-center text-[16px] font-medium leading-[1.4] text-[#5C5C5C] opacity-50">
          최근 검색한 키워드가 없어요
        </div>
      )}
    </section>
  );
}

function RecentIcon() {
  return (
    <SvgIcon size={24} viewBox="0 0 24 24" className="shrink-0 text-[#C2C2C2]">
      <path
        d="M12 6.75v5.5l3.5 2M20 12a8 8 0 1 1-2.35-5.65"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </SvgIcon>
  );
}
