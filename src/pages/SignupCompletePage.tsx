import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/AppHeader';
import { CtaButton } from '@/components/ui/CtaButton';
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
    typeof snapshot.grade === 'number' &&
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
      <div className="relative mx-auto flex h-[100svh] w-full max-w-[393px] flex-col overflow-hidden bg-white">
        <AppHeader title="회원가입" />

        <section className="min-h-0 flex-1 overflow-hidden pb-[148px]">
          <SuccessStep snapshot={snapshot} />

          <div className="absolute bottom-0 left-0 right-0 flex h-32 flex-col justify-center px-4 pb-[max(60px,env(safe-area-inset-bottom))] pt-3">
            <CtaButton variant="primary" state="default" size="xlg" onClick={() => navigate('/home', { replace: true })}>
              홈으로
            </CtaButton>
          </div>
        </section>
      </div>
    </main>
  );
}
