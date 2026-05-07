import { RadioBtn } from '@/components/ui/RadioBtn';
import type { SignupGrade } from '@/features/signup/types';

type GradeOption = {
  label: string;
  value: SignupGrade;
};

type GradeStepProps = {
  selectedGrade: SignupGrade | null;
  onSelect: (grade: SignupGrade) => void;
};

const gradeOptions: GradeOption[] = [
  { label: '1학년', value: 1 },
  { label: '2학년', value: 2 },
  { label: '3학년', value: 3 },
  { label: '4학년이상', value: 4 },
];

export function GradeStep({ selectedGrade, onSelect }: GradeStepProps) {
  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        현재 학년을
        <br />
        선택해주세요.
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-3">
        {gradeOptions.map((option) => (
          <RadioBtn
            key={option.value}
            selected={selectedGrade === option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </RadioBtn>
        ))}
      </div>
    </div>
  );
}
