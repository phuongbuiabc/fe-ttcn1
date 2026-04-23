export const tokenStorage = {
  getAccessToken: () =>
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null,

  getRefreshToken: () =>
    typeof window !== 'undefined'
      ? localStorage.getItem('refreshToken')
      : null,

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
};