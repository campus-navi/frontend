import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '@/api';
import { queryClient } from '@/app/queryClient';
import { resetNoticeInterestPromptDismiss } from '@/features/home/noticeInterestPromptDismissState';
import { tokenStorage } from '@/shared/auth';

export function useLogout() {
  const navigate = useNavigate();
  const isLoggingOutRef = useRef(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    if (isLoggingOutRef.current) {
      return;
    }

    isLoggingOutRef.current = true;
    setIsLoggingOut(true);

    try {
      await authApi.logout();
    } catch {
      // A failed server request must not prevent the client logout flow.
    } finally {
      tokenStorage.clearAccessToken();
      queryClient.clear();
      resetNoticeInterestPromptDismiss();
      navigate('/login', {
        replace: true,
        state: { skipSessionRestore: true },
      });
    }
  };

  return {
    isLoggingOut,
    logout,
  };
}
