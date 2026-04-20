import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { CtaButton } from '@/components/ui/CtaButton';
import { SignupHeader } from '@/features/signup/components/SignupHeader';
import { SuccessStep } from '@/features/signup/steps/SuccessStep';
import type { SignupCompleteSnapshot } from '@/features/signup/types';

function isSignupCompleteSnapshot(value: unknown): value is SignupCompleteSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const snapshot = value as Partial<SignupCompleteSnapshot>;

  return (
    typeof snapshot.admissionYear === 'number' &&
    typeof snapshot.department === 'string' &&
    typeof snapshot.email === 'string' &&
    typeof snapshot.nickname === 'string' &&
    typeof snapshot.universityName === 'string' &&
    typeof snapshot.username === 'string'
  );
}

export default function SignupCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const snapshot = isSignupCompleteSnapshot(location.state) ? location.state : null;

  if (!snapshot) {
    return <Navigate replace to="/signup" />;
  }

  return (
    <main className="h-[100svh] overflow-hidden bg-white">
      <div className="mx-auto flex h-[100svh] w-full max-w-[393px] flex-col overflow-hidden bg-white">
        <SignupHeader onBack={() => navigate('/', { replace: true })} />

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 py-10 pb-[max(24px,env(safe-area-inset-bottom))]">
          <div className="min-h-0 flex-1 overflow-hidden">
            <SuccessStep snapshot={snapshot} />
          </div>

          <div className="mt-auto pt-8">
            <CtaButton active className="py-[18px] text-[18px]" onClick={() => navigate('/', { replace: true })}>
              메인으로 이동
            </CtaButton>
          </div>
        </section>
      </div>
    </main>
  );
}
