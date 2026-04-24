'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthLogic } from '@/modules/auth/hooks/useAuth';
import { tokenStorage } from '@/modules/auth/utils/tokenStorage';
import { authService } from '@/modules/auth/api/auth.service';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const auth = useAuthLogic();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      // ❌ không có refreshToken => khỏi cố
      if (!refreshToken) return;

      try {
        // ✅ Có accessToken → thử lấy user (ApiClient sẽ auto refresh nếu 401)
        if (accessToken) {
          await auth.fetchUser();
          return;
        }

        // ✅ Không có accessToken → dùng refreshToken để login lại
        const res = await authService.refreshToken(refreshToken);

        if (res.success) {
          tokenStorage.setTokens(
            res.data.accessToken,
            refreshToken // ⚠️ BE bạn không trả refreshToken mới
          );

          await auth.fetchUser();
        }
      } catch (err) {
        console.log('Auto login failed');
        tokenStorage.clear();
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

export const useAuth = () => {
  return useContext(AuthContext);
};