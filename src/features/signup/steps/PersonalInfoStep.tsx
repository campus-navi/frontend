import { useMemo } from 'react';

import { ClearIcon } from '@/features/signup/components/SignupIcons';
import { SignupTextField } from '@/features/signup/components/SignupTextField';

type PersonalInfoStepProps = {
  name: string;
  studentNumber: string;
  onNameChange: (value: string) => void;
  onStudentNumberChange: (value: string) => void;
};

export function PersonalInfoStep({
  name,
  studentNumber,
  onNameChange,
  onStudentNumberChange,
}: PersonalInfoStepProps) {
  const nameActions = useMemo(
    () =>
      name ? (
        <button
          type="button"
          aria-label="이름 지우기"
          onClick={() => onNameChange('')}
          className="text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
        >
          <ClearIcon />
        </button>
      ) : null,
    [name, onNameChange],
  );
  const studentNumberActions = useMemo(
    () =>
      studentNumber ? (
        <button
          type="button"
          aria-label="학번 지우기"
          onClick={() => onStudentNumberChange('')}
          className="text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
        >
          <ClearIcon />
        </button>
      ) : null,
    [onStudentNumberChange, studentNumber],
  );

  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        학적 확인을 위해
        <br />
        이름과 학번을 입력해주세요.
      </h1>
      <div className="mt-10 space-y-8">
        <SignupTextField
          label="이름"
          value={name}
          placeholder="이름을 입력해주세요"
          trailingActions={nameActions}
          onChange={onNameChange}
        />
        <SignupTextField
          inputMode="numeric"
          label="학번"
          value={studentNumber}
          placeholder="학번을 입력해주세요"
          trailingActions={studentNumberActions}
          onChange={onStudentNumberChange}
        />
      </div>
    </div>
  );
}
