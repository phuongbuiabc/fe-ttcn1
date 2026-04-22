import { useState, useCallback } from 'react';
import { authService } from '@/modules/auth/api/auth.service';
import { tokenStorage } from '@/modules/auth/utils/token';
import { User } from '../model/auth.model';

export function useAuthLogic() {
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

    if (!res.success) {
      throw new Error(res.message);
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