import { useState, useCallback } from 'react';
import { authService } from '@/modules/auth/api/auth.service';
import { tokenStorage } from '@/modules/auth/utils/tokenStorage';
import { User } from '../model/auth.model';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authService.getMe();
      if (res.success) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: any) => {
    const res = await authService.login(credentials);
    const oldRefreshToken = tokenStorage.getRefreshToken();

    if (!res.success) {
      throw new Error(res.message);
    }

    if (!res.data.refreshToken) {
      throw new Error('No refresh token returned from server');
    }

    tokenStorage.setTokens(
      res.data.accessToken,
      res.data.refreshToken
    );

    setUser(res.data.user);
  };

  const logout = () => {
    tokenStorage.clear();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    fetchUser,
  };
}