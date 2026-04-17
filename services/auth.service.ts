// services/auth.service.ts
import { apiClient } from './api-client';
import { ApiResponse, User } from '@/types';

export const authService = {
  login: (credentials: any) => 
    apiClient.request<ApiResponse<any>>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
  register: (data: any) => 
    apiClient.request<ApiResponse<any>>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  getMe: () => 
    apiClient.request<ApiResponse<User>>('/api/v1/users/me'),
};
