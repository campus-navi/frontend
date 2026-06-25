import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type AcademicPlanOptionListProps<TOption extends { id: number; name: string }> = {
  emptyMessage: string;
  errorMessage: string;
  isLoading: boolean;
  label: string;
  options: TOption[];
  selectedId: number | null;
  onRetry: () => void;
  onSelect: (option: TOption) => void;
};

export function AcademicPlanOptionList<TOption extends { id: number; name: string }>({
  emptyMessage,
  errorMessage,
  isLoading,
  label,
  options,
  selectedId,
  onRetry,
  onSelect,
}: AcademicPlanOptionListProps<TOption>) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[15px] font-semibold leading-none text-[#5A5A5A]">{label}</h2>

      {isLoading ? (
        <div className="flex min-h-[88px] items-center gap-2 rounded-[8px] bg-[#F8F8F8] px-4 text-[15px] font-medium text-[#777777]">
          <LoadingSpinner ariaLabel={`${label} 목록을 불러오는 중`} className="h-4 w-4" />
          <span>목록을 불러오는 중입니다.</span>
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-[8px] border border-[#F0D8D8] bg-[#FFF8F8] px-4 py-4">
          <p className="text-[15px] font-semibold text-[#BE4A4A]">{errorMessage}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-[14px] font-semibold text-[#303030] underline underline-offset-4"
          >
            다시 시도
          </button>
        </div>
      ) : null}

      {!isLoading && !errorMessage && options.length === 0 ? (
        <div className="flex min-h-[88px] items-center justify-center rounded-[8px] bg-[#F8F8F8] px-4 text-center text-[15px] font-medium leading-6 text-[#A0A0A0]">
          {emptyMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage && options.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => {
            const isSelected = option.id === selectedId;

            return (
              <button
                type="button"
                key={option.id}
                onClick={() => onSelect(option)}
                className={[
                  'min-h-[52px] rounded-[8px] border px-3 py-3 text-left text-[15px] font-semibold leading-[1.35] transition-colors',
                  isSelected
                    ? 'border-[#202020] bg-[#202020] text-white'
                    : 'border-[#E4E4E4] bg-white text-[#303030]',
                ].join(' ')}
              >
                {option.name}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
