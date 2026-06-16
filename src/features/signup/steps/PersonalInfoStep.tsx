import { useCallback, useMemo, useState } from 'react';

import { ClearIcon } from '@/features/signup/components/SignupIcons';
import { SignupTextField } from '@/features/signup/components/SignupTextField';
import { isSignupStudentNumberValid } from '@/features/signup/utils';

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
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isStudentNumberFocused, setIsStudentNumberFocused] = useState(false);
  const [isStudentNumberTouched, setIsStudentNumberTouched] = useState(false);
  const trimmedName = name.trim();
  const trimmedStudentNumber = studentNumber.trim();
  const isNameInvalid = (isNameTouched || Boolean(name)) && !trimmedName;
  const nameHelperText = isNameInvalid
    ? '이름을 입력해주세요.'
    : isNameFocused && !trimmedName
      ? '실명 기준으로 입력해주세요.'
      : undefined;
  const isStudentNumberEmpty = isStudentNumberTouched && !trimmedStudentNumber;
  const isStudentNumberLengthInvalid = Boolean(trimmedStudentNumber) && !isSignupStudentNumberValid(studentNumber);
  const studentNumberHelperText = isStudentNumberEmpty
    ? '학번을 입력해주세요.'
    : isStudentNumberLengthInvalid
      ? '학번은 6~10자리 숫자로 입력해주세요.'
      : isStudentNumberFocused && !trimmedStudentNumber
        ? '학교에서 사용하는 학번을 입력해주세요.'
        : undefined;
  const handleNameChange = (value: string) => {
    setIsNameTouched(true);
    onNameChange(value);
  };
  const handleNameClear = useCallback(() => {
    setIsNameTouched(true);
    onNameChange('');
  }, [onNameChange]);
  const handleStudentNumberChange = (value: string) => {
    setIsStudentNumberTouched(true);
    const nextStudentNumber = value.replace(/\D/g, '').slice(0, 10);
    onStudentNumberChange(nextStudentNumber);
  };
  const handleStudentNumberClear = useCallback(() => {
    setIsStudentNumberTouched(true);
    onStudentNumberChange('');
  }, [onStudentNumberChange]);
  const nameActions = useMemo(
    () =>
      name ? (
        <button
          type="button"
          aria-label="이름 지우기"
          onClick={handleNameClear}
          className="text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
        >
          <ClearIcon />
        </button>
      ) : null,
    [handleNameClear, name],
  );
  const studentNumberActions = useMemo(
    () =>
      studentNumber ? (
        <button
          type="button"
          aria-label="학번 지우기"
          onClick={handleStudentNumberClear}
          className="text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
        >
          <ClearIcon />
        </button>
      ) : null,
    [handleStudentNumberClear, studentNumber],
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
          helperText={nameHelperText}
          helperTone={isNameInvalid ? 'error' : 'default'}
          trailingActions={nameActions}
          onBlur={() => {
            setIsNameFocused(false);
            setIsNameTouched(true);
          }}
          onChange={handleNameChange}
          onFocus={() => setIsNameFocused(true)}
        />
        <SignupTextField
          inputMode="numeric"
          label="학번"
          value={studentNumber}
          placeholder="학번을 입력해주세요"
          helperText={studentNumberHelperText}
          helperTone={isStudentNumberEmpty || isStudentNumberLengthInvalid ? 'error' : 'default'}
          trailingActions={studentNumberActions}
          onBlur={() => {
            setIsStudentNumberFocused(false);
            setIsStudentNumberTouched(true);
          }}
          onChange={handleStudentNumberChange}
          onFocus={() => setIsStudentNumberFocused(true)}
        />
      </div>
    </div>
  );
}
