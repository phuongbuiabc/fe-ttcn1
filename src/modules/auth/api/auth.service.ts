import { apiClient } from '@/shared/api/api-client';
import { ApiResponse, LoginResponse, User } from '../model/auth.model';

export const authService = {
  login: (credentials: any) =>
    apiClient.post<ApiResponse<LoginResponse>>(
      '/api/v1/auth/login',
      credentials
    ),

  register: (data: any) =>
    apiClient.post<ApiResponse<any>>(
      '/api/v1/auth/register',
      data
    ),

  getMe: () =>
    apiClient.get<ApiResponse<User>>('/api/v1/users/me'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<LoginResponse>>(
      '/api/v1/auth/refresh-token',
      { refreshToken }
    ),
};