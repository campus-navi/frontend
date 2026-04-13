import { BackIcon } from '@/features/signup/components/SignupIcons';

type SignupHeaderProps = {
  progressValue?: number;
  onBack: () => void;
};

export function SignupHeader({ progressValue, onBack }: SignupHeaderProps) {
  return (
    <header className="pt-[max(20px,env(safe-area-inset-top))]">
      <div className="flex h-[60px] items-center px-5">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center text-[#2B2B2B]"
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>
      </div>
      {typeof progressValue === 'number' ? (
        <div className="h-[3px] w-full bg-[#D9D9D9]">
          <div
            className="h-full bg-[#6C6C6C] transition-all duration-300"
            style={{ width: `${progressValue * 100}%` }}
          />
        </div>
      ) : null}
    </header>
  );
}
