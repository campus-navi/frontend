import { AppHeader } from '@/components/ui/AppHeader';

type SignupHeaderProps = {
  progressValue?: number;
  onBack: () => void;
};

export function SignupHeader({ progressValue, onBack }: SignupHeaderProps) {
  return (
    <div>
      <AppHeader title="회원가입" onBack={onBack} />
      {typeof progressValue === 'number' ? (
        <div className="h-[3px] w-full bg-[#D9D9D9]">
          <div
            className="h-full bg-[#6C6C6C] transition-all duration-300"
            style={{ width: `${progressValue * 100}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
