import { SignupTextField } from '@/features/signup/components/SignupTextField';

type UsernameStepProps = {
  username: string;
  onChange: (value: string) => void;
};

export function UsernameStep({ username, onChange }: UsernameStepProps) {
  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">사용할 아이디를 입력해주세요</h1>
      <div className="mt-10">
        <SignupTextField
          label="아이디"
          value={username}
          placeholder="영문 소문자, 숫자 포함 4자 이상"
          helperText="영문 소문자, 숫자, `_` 조합으로 4자 이상 입력해주세요."
          onChange={onChange}
        />
      </div>
    </div>
  );
}
