// services/pig.service.ts
import { apiClient } from './api-client';
import { Pig, ApiResponse } from '@/types';

export const pigService = {
  getAll: (status?: string) => 
    apiClient.request<ApiResponse<Pig[]>>(`/api/v1/pigs${status ? `?status=${status}` : ''}`),
    
  getById: (id: string) => 
    apiClient.request<ApiResponse<Pig>>(`/api/v1/pigs/${id}`),
    
  create: (data: Partial<Pig>) => 
    apiClient.request<ApiResponse<Pig>>('/api/v1/pigs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: Partial<Pig>) => 
    apiClient.request<ApiResponse<Pig>>(`/api/v1/pigs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  delete: (id: string) => 
    apiClient.request<ApiResponse<void>>(`/api/v1/pigs/${id}`, {
      method: 'DELETE',
    }),
};
