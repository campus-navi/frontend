import { SignupTextField } from '@/features/signup/components/SignupTextField';

type PasswordStepProps = {
  password: string;
  passwordConfirm: string;
  onPasswordChange: (value: string) => void;
  onPasswordConfirmChange: (value: string) => void;
};

export function PasswordStep({
  password,
  passwordConfirm,
  onPasswordChange,
  onPasswordConfirmChange,
}: PasswordStepProps) {
  const passwordMatched = password.length > 0 && password === passwordConfirm;
  const helperText = passwordConfirm
    ? passwordMatched
      ? '비밀번호가 일치합니다.'
      : '비밀번호가 일치하지 않습니다.'
    : undefined;
  const helperTone = passwordConfirm ? (passwordMatched ? 'success' : 'error') : 'default';

  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        비밀번호를
        <br />
        설정해주세요
      </h1>
      <div className="mt-10">
        <SignupTextField
          label="비밀번호"
          type="password"
          value={password}
          placeholder="8자 이상 입력해주세요"
          onChange={onPasswordChange}
        />
      </div>
      <div className="mt-8">
        <SignupTextField
          label="비밀번호 확인"
          type="password"
          value={passwordConfirm}
          placeholder="비밀번호를 다시 입력해주세요"
          helperText={helperText}
          helperTone={helperTone}
          onChange={onPasswordConfirmChange}
        />
      </div>
    </div>
  );
}
