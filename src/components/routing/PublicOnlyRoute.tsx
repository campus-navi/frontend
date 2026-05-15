import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { tokenStorage } from '@/shared/auth';
import { refreshSessionOnce } from '@/shared/auth/refreshSession';

type AuthenticationStatus = 'checking' | 'authenticated' | 'unauthenticated';

type PublicOnlyRouteProps = {
  children: ReactNode;
};

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const [authenticationStatus, setAuthenticationStatus] = useState<AuthenticationStatus>(() =>
    tokenStorage.getAccessToken() ? 'authenticated' : 'checking',
  );

  useEffect(() => {
    if (authenticationStatus !== 'checking') {
      return undefined;
    }

    if (tokenStorage.getAccessToken()) {
      setAuthenticationStatus('authenticated');
      return undefined;
    }

    let isActive = true;

    refreshSessionOnce()
      .then(() => {
        if (isActive) {
          setAuthenticationStatus('authenticated');
        }
      })
      .catch(() => {
        tokenStorage.clearAccessToken();

        if (isActive) {
          setAuthenticationStatus('unauthenticated');
        }
      });

    return () => {
      isActive = false;
    };
  }, [authenticationStatus]);

  if (authenticationStatus === 'authenticated') {
    return <Navigate replace to="/home" />;
  }

  if (authenticationStatus === 'unauthenticated') {
    return children;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white text-[#3A56F0]">
      <LoadingSpinner ariaLabel="인증 상태 확인 중" className="h-6 w-6" />
    </div>
  );
}
