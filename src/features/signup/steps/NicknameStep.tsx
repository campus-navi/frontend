import { useMemo } from 'react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ClearIcon } from '@/features/signup/components/SignupIcons';
import { SignupTextField } from '@/features/signup/components/SignupTextField';

type NicknameStepProps = {
  helperText?: string;
  helperTone?: 'default' | 'success' | 'error';
  isNicknameChecking?: boolean;
  nickname: string;
  onChange: (value: string) => void;
};

export function NicknameStep({
  helperText,
  helperTone = 'default',
  isNicknameChecking = false,
  nickname,
  onChange,
}: NicknameStepProps) {
  const nicknameActions = useMemo(
    () =>
      nickname ? (
        <>
          {isNicknameChecking ? <LoadingSpinner ariaLabel="닉네임 확인 중" className="h-4 w-4 text-[#8D8D8D]" /> : null}
          <button
            type="button"
            aria-label="닉네임 지우기"
            onClick={() => onChange('')}
            className="text-[#B3B3B3] transition-colors hover:text-[#7A7A7A]"
          >
            <ClearIcon />
          </button>
        </>
      ) : null,
    [isNicknameChecking, nickname, onChange],
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
