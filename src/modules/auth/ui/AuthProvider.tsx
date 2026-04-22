'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthLogic } from '../hooks/useAuth';
import { tokenStorage } from '../utils/token';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const auth = useAuthLogic();
  const router = useRouter();

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      auth.fetchUser();
    }
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