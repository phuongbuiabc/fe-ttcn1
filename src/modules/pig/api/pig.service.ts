import { apiClient } from '@/shared/api/api-client';
import {
  CreatePigRequest,
  UpdatePigRequest,
  PigResponse,
  PigDetailResponse,
} from '../model/pig.model';
import { ApiResponse } from '@/shared/types';

export const pigService = {
  create: (data: CreatePigRequest) =>
    apiClient.post<ApiResponse<PigResponse>>('/api/v1/pigs', data),

  update: (id: string, data: UpdatePigRequest) =>
    apiClient.put<ApiResponse<PigResponse>>(`/api/v1/pigs/${id}`, data),

  getAll: () =>
    apiClient.get<ApiResponse<PigResponse[]>>('/api/v1/pigs'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<PigResponse>>(`/api/v1/pigs/${id}`),

  getPigDetail: (id: string) =>
    apiClient.get<ApiResponse<PigDetailResponse>>(
      `/api/v1/pigs/${id}/detail`
    ),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`/api/v1/pigs/${id}`),
};