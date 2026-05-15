import { authApi } from '@/api/modules/auth';

let refreshSessionPromise: Promise<unknown> | null = null;

export function refreshSessionOnce() {
  refreshSessionPromise ??= authApi.reissueAccessToken().finally(() => {
    refreshSessionPromise = null;
  });

  return refreshSessionPromise;
}
