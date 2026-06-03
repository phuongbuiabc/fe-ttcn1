'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService as authApi } from '@/modules/auth/api/auth.service';
import { User } from '@/modules/auth/model/auth.model';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  updateLocalAvatar: (avatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setUser = useCallback((newUser: User | null | ((prev: User | null) => User | null)) => {
    setUserState(prev => {
      const resolved = typeof newUser === 'function' ? (newUser as Function)(prev) : newUser;
      if (resolved && resolved.email) {
        const localAvatar = localStorage.getItem(`mdfarm_avatar_${resolved.email}`);
        if (localAvatar) {
          return { ...resolved, avatarUrl: localAvatar };
        }
      }
      return resolved;
    });
  }, []);

  const updateLocalAvatar = useCallback((avatarUrl: string) => {
    setUserState(prev => {
      if (prev && prev.email) {
        localStorage.setItem(`mdfarm_avatar_${prev.email}`, avatarUrl);
        return { ...prev, avatarUrl };
      }
      return prev;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/login');
  }, [router, setUser]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await authApi.getMe();
      if (response.success) {
        setUser(response.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout, setUser]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (credentials: any) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data?.accessToken) {
        const { accessToken, refreshToken, user: userData } = response.data;
        
        localStorage.setItem('token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        setUser(userData);
        router.push('/');
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (error: any) {
      console.error('Full Login Error Response:', error);
      // Nếu có thông tin chi tiết từ server, hãy hiện ra để debug
      if (error.response?.data) {
        console.log('Server Error Detail:', error.response.data);
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateLocalAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

