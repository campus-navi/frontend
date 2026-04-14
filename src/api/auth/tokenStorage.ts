import { apiConfig } from '@/api/config';

export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

const memoryFallback: AuthTokens = {
  accessToken: null,
  refreshToken: null,
};

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readToken(key: string, fallbackKey: keyof AuthTokens) {
  const storage = getStorage();

  if (!storage) {
    return memoryFallback[fallbackKey];
  }

  return storage.getItem(key);
}

function writeToken(key: string, fallbackKey: keyof AuthTokens, value: string | null) {
  const storage = getStorage();
  memoryFallback[fallbackKey] = value;

  if (!storage) {
    return;
  }

  if (value) {
    storage.setItem(key, value);
    return;
  }

  storage.removeItem(key);
}

export const tokenStorage = {
  clear() {
    this.setTokens({ accessToken: null, refreshToken: null });
  },
  getAccessToken() {
    return readToken(apiConfig.accessTokenStorageKey, 'accessToken');
  },
  getRefreshToken() {
    return readToken(apiConfig.refreshTokenStorageKey, 'refreshToken');
  },
  getTokens(): AuthTokens {
    return {
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
    };
  },
  setAccessToken(accessToken: string | null) {
    writeToken(apiConfig.accessTokenStorageKey, 'accessToken', accessToken);
  },
  setRefreshToken(refreshToken: string | null) {
    writeToken(apiConfig.refreshTokenStorageKey, 'refreshToken', refreshToken);
  },
  setTokens(tokens: Partial<AuthTokens>) {
    if (tokens.accessToken !== undefined) {
      this.setAccessToken(tokens.accessToken);
    }

    if (tokens.refreshToken !== undefined) {
      this.setRefreshToken(tokens.refreshToken);
    }
  },
};
