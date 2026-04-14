const DEFAULT_API_TIMEOUT_MS = 10000;
const DEFAULT_REFRESH_PATH = '/auth/reissue';
const DEFAULT_ACCESS_TOKEN_STORAGE_KEY = 'navi.accessToken';
const DEFAULT_REFRESH_TOKEN_STORAGE_KEY = 'navi.refreshToken';

function parseTimeout(value: string | undefined) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_API_TIMEOUT_MS;
  }

  return parsed;
}

export const apiConfig = {
  accessTokenStorageKey: import.meta.env.VITE_ACCESS_TOKEN_STORAGE_KEY ?? DEFAULT_ACCESS_TOKEN_STORAGE_KEY,
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  refreshPath: import.meta.env.VITE_API_REFRESH_PATH ?? DEFAULT_REFRESH_PATH,
  refreshTokenStorageKey: import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY ?? DEFAULT_REFRESH_TOKEN_STORAGE_KEY,
  timeoutMs: parseTimeout(import.meta.env.VITE_API_TIMEOUT_MS),
} as const;
