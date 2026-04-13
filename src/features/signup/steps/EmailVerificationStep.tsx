import { SignupTextField } from '@/features/signup/components/SignupTextField';
import { formatRemainingTime } from '@/features/signup/utils';

type EmailVerificationStepProps = {
  emailLocalPart: string;
  emailDomain: string;
  emailVerified: boolean;
  verificationCode: string;
  verificationSent: boolean;
  verificationError: string;
  timeLeft: number;
  onEmailChange: (value: string) => void;
  onVerificationCodeChange: (value: string) => void;
  onSendVerification: () => void;
  onSubmitVerification: () => void;
};

export function EmailVerificationStep({
  emailLocalPart,
  emailDomain,
  emailVerified,
  verificationCode,
  verificationSent,
  verificationError,
  timeLeft,
  onEmailChange,
  onVerificationCodeChange,
  onSendVerification,
  onSubmitVerification,
}: EmailVerificationStepProps) {
  const isCodeReady = verificationCode.length === 6;
  const isSendEnabled = Boolean(emailLocalPart.trim());
  const timerLabel = emailVerified ? null : timeLeft > 0 ? `남은시간 ${formatRemainingTime(timeLeft)}` : '시간 만료';
  const isVerifyButtonEnabled = !emailVerified && isCodeReady;

  return (
    <div>
      <h1 className="text-[22px] font-bold leading-[1.45] tracking-[-0.03em] text-[#303030]">
        대학인증을 위해
        <br />
        이메일을 입력해주세요
      </h1>

      {verificationSent ? (
        <div className="mt-10">
          <p className="text-[15px] font-medium leading-none text-[#7E7E7E]">인증번호</p>
          <div className="mt-5 flex items-center gap-3 border-b border-[#1F1F1F] pb-3">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(event) => onVerificationCodeChange(event.target.value)}
              readOnly={emailVerified}
              className={[
                'min-w-0 flex-1 border-0 bg-transparent px-0 text-[22px] tracking-[0.28em] focus:outline-none',
                emailVerified ? 'cursor-default text-[#3A7A44]' : 'text-[#111111]',
              ].join(' ')}
            />
            {timerLabel ? <span className="text-[14px] text-[#8E8E8E]">{timerLabel}</span> : null}
            <button
              type="button"
              disabled={!isVerifyButtonEnabled}
              onClick={onSubmitVerification}
              className={[
                'rounded-[14px] px-4 py-3 text-[16px] font-semibold transition-colors',
                emailVerified
                  ? 'bg-[#E8F4EA] text-[#3A7A44]'
                  : isCodeReady
                    ? 'bg-[#3F4045] text-white'
                    : 'bg-[#E6E6E6] text-[#B8B8B8]',
              ].join(' ')}
            >
              {emailVerified ? '인증완료' : '인증하기'}
            </button>
          </div>
          {verificationError ? <p className="mt-2 text-sm text-[#D34B4B]">{verificationError}</p> : null}
          {emailVerified ? <p className="mt-2 text-sm text-[#3A7A44]">이메일 인증이 완료되었습니다.</p> : null}
        </div>
      ) : null}

      <div className="mt-10">
        <p className="text-[15px] font-medium leading-none text-[#7E7E7E]">학교 이메일</p>
        <div className="mt-5 flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <SignupTextField label="" value={emailLocalPart} placeholder="이메일 아이디" onChange={onEmailChange} />
          </div>
          <div className="w-[108px] border-b border-[#1F1F1F] pb-[11px] text-[17px] leading-none text-[#5B5B5B]">
            @{emailDomain}
          </div>
          <button
            type="button"
            disabled={!isSendEnabled}
            onClick={onSendVerification}
            className={[
              'shrink-0 rounded-[14px] border px-4 py-3 text-[15px] font-semibold transition-colors',
              isSendEnabled ? 'border-[#2F2F2F] bg-white text-[#2F2F2F]' : 'border-[#E6E6E6] bg-[#E6E6E6] text-[#B9B9B9]',
            ].join(' ')}
          >
            {verificationSent ? '다시전송' : '본인인증'}
          </button>
        </div>
      </div>
    </div>
  );
}
