import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';
import { Pig } from '../model/pig.model';

export const pigService = {
  getAll: (status?: string) =>
    apiClient.get<ApiResponse<Pig[]>>(`/api/v1/pigs${status ? `?status=${status}` : ''}`),
  getById: (id: string) =>
    apiClient.get<ApiResponse<Pig>>(`/api/v1/pigs/${id}`),
  create: (data: Partial<Pig>) =>
    apiClient.post<ApiResponse<Pig>>('/api/v1/pigs', data),
  update: (id: string, data: Partial<Pig>) =>
    apiClient.put<ApiResponse<Pig>>(`/api/v1/pigs/${id}`, data),
  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/pigs/${id}`),
};
