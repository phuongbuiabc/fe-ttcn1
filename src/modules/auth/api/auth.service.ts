import { apiClient } from '@/shared/api/api-client';
import { ApiResponse, LoginResponse, User } from '../model/auth.model';

export const authService = {
  login: (credentials: any) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials),

  register: (data: any) =>
    apiClient.post<ApiResponse<any>>('/auth/register', data),

  getMe: () =>
    apiClient.get<ApiResponse<User>>('/users/me'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh-token', {
      refreshToken,
    }),
};