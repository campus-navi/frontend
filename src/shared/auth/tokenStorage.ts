let accessToken: string | null = null;

export const tokenStorage = {
  clearAccessToken() {
    accessToken = null;
  },
  getAccessToken() {
    return accessToken;
  },
  setAccessToken(token: string | null) {
    accessToken = token;
  },
};
