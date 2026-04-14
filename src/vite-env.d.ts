/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ACCESS_TOKEN_STORAGE_KEY?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_REFRESH_PATH?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
  readonly VITE_REFRESH_TOKEN_STORAGE_KEY?: string;
  readonly VITE_USE_MOCK_UNIVERSITIES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
