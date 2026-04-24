'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { tokenStorage } from '@/modules/auth/utils/tokenStorage';
import { authService } from '@/modules/auth/api/auth.service';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        tokenStorage.clear();
        router.push('/login');
        return;
      }

      try {
        if (accessToken) {
          await auth.fetchUser();
          return;
        }

        const res = await authService.refreshToken(refreshToken);

        if (res.success) {
          tokenStorage.setTokens(
            res.data.accessToken,
            refreshToken
          );

          await auth.fetchUser();
        }
      } catch (err) {
        console.log('Auto login failed');
        tokenStorage.clear();
        router.push('/login');
      }
    };

    initAuth();
  }, []);

  const login = async (data: any) => {
    await auth.login(data);
    router.push('/');
  };

  const logout = () => {
    auth.logout();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};
