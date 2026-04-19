// services/auth.service.ts
import { apiClient } from '@/shared/api/api-client';
import { ApiResponse, User } from '@/shared/types';

export const authService = {
  login: (credentials: any) => 
    apiClient.post<ApiResponse<any>>('/api/v1/auth/login', credentials),
    
  register: (data: any) => 
    apiClient.post<ApiResponse<any>>('/api/v1/auth/register', data),
    
  getMe: () => 
    apiClient.get<ApiResponse<User>>('/api/v1/users/me'),
};
