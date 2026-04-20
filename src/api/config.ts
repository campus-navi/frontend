const DEFAULT_API_TIMEOUT_MS = 10000;
const DEFAULT_REFRESH_PATH = '/auth/reissue';

function parseTimeout(value: string | undefined) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_API_TIMEOUT_MS;
  }

  return parsed;
}

export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  refreshPath: import.meta.env.VITE_API_REFRESH_PATH ?? DEFAULT_REFRESH_PATH,
  timeoutMs: parseTimeout(import.meta.env.VITE_API_TIMEOUT_MS),
} as const;
