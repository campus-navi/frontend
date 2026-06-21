const LOGOUT_SESSION_RESTORE_SUPPRESSION_KEY =
  'campus-navi:skip-session-restore-after-logout';
let shouldSuppressSessionRestoreFallback = false;

export function clearLogoutSessionRestoreSuppression() {
  shouldSuppressSessionRestoreFallback = false;

  try {
    sessionStorage.removeItem(LOGOUT_SESSION_RESTORE_SUPPRESSION_KEY);
  } catch {
    // Storage 접근 실패가 명시적 로그인 완료 흐름을 막지 않도록 무시한다.
  }
}

export function setLogoutSessionRestoreSuppression() {
  shouldSuppressSessionRestoreFallback = true;

  try {
    sessionStorage.setItem(LOGOUT_SESSION_RESTORE_SUPPRESSION_KEY, 'true');
  } catch {
    // 같은 탭에서는 메모리 fallback으로 세션 복구를 계속 차단한다.
  }
}

export function shouldSuppressSessionRestore() {
  try {
    return (
      sessionStorage.getItem(LOGOUT_SESSION_RESTORE_SUPPRESSION_KEY) === 'true' ||
      shouldSuppressSessionRestoreFallback
    );
  } catch {
    return shouldSuppressSessionRestoreFallback;
  }
}
