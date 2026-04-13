import { SignupTextField } from '@/features/signup/components/SignupTextField';

type NicknameStepProps = {
  nickname: string;
  onChange: (value: string) => void;
};

export function NicknameStep({ nickname, onChange }: NicknameStepProps) {
  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">닉네임을 입력해주세요</h1>
      <div className="mt-10">
        <SignupTextField label="닉네임" value={nickname} placeholder="2자 이상 입력해주세요" onChange={onChange} />
      </div>
    </div>
  );
}
