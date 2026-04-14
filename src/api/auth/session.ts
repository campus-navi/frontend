import type { ApiError } from '@/api/errors';

type SessionExpiredListener = (error: ApiError) => void;

let sessionExpired = false;
const listeners = new Set<SessionExpiredListener>();

export function getIsSessionExpired() {
  return sessionExpired;
}

export function markSessionExpired(error: ApiError) {
  sessionExpired = true;
  listeners.forEach((listener) => listener(error));
}

export function resetSessionExpired() {
  sessionExpired = false;
}

export function subscribeSessionExpired(listener: SessionExpiredListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
