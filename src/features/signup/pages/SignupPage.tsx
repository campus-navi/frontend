import { useSignupViewModel } from '@/features/signup/view-models/useSignupViewModel';
import { SignupView } from '@/features/signup/views/SignupView';

export function SignupPage() {
  const signupViewModel = useSignupViewModel();

  return <SignupView {...signupViewModel} />;
}
