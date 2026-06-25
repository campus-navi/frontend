import type { AcademicPlanType } from '@/api';
import type { AcademicPlanTypeOption } from '@/features/academic-plans/types';

type AcademicPlanTypeSelectorProps = {
  options: AcademicPlanTypeOption[];
  selectedType: AcademicPlanType | null;
  onSelect: (type: AcademicPlanType) => void;
};

export function AcademicPlanTypeSelector({
  options,
  selectedType,
  onSelect,
}: AcademicPlanTypeSelectorProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[15px] font-semibold leading-none text-[#5A5A5A]">지원 유형</h2>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isSelected = option.type === selectedType;

          return (
            <button
              type="button"
              key={option.type}
              onClick={() => onSelect(option.type)}
              className={[
                'min-h-[52px] rounded-[8px] border px-3 py-3 text-left text-[15px] font-semibold leading-[1.35] transition-colors',
                isSelected
                  ? 'border-[#00C99A] bg-[#E9FFF9] text-[#166A5B]'
                  : 'border-[#E4E4E4] bg-white text-[#303030]',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
