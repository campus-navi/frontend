import { useMemo } from 'react';

import { ClearIcon } from '@/features/signup/components/SignupIcons';
import { SignupTextField } from '@/features/signup/components/SignupTextField';

type NicknameStepProps = {
  helperText?: string;
  helperTone?: 'default' | 'success' | 'error';
  nickname: string;
  onChange: (value: string) => void;
};

export function NicknameStep({ helperText, helperTone = 'default', nickname, onChange }: NicknameStepProps) {
  const nicknameActions = useMemo(
    () =>
      nickname ? (
        <button
          type="button"
          aria-label="닉네임 지우기"
          onClick={() => onChange('')}
          className="text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
        >
          <ClearIcon />
        </button>
      ) : null,
    [nickname, onChange],
  );

  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        게시판에서 사용할
        <br />
        닉네임을 만들어주세요.
      </h1>
      <div className="mt-10">
        <SignupTextField
          label="닉네임"
          value={nickname}
          placeholder="캠퍼스네비3423"
          helperText={helperText}
          helperTone={helperTone}
          trailingActions={nicknameActions}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
