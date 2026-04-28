import { apiClient } from '@/shared/api/api-client';
import {
  AreaResponse,
  CreateAreaRequest,
  UpdateAreaRequest,
} from '../model/area.model';
import { ApiResponse } from '@/shared/types';

export const areaService = {
  getAll: () =>
    apiClient.get<ApiResponse<AreaResponse[]>>('/api/v1/areas'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<AreaResponse>>(`/api/v1/areas/${id}`),

  create: (data: CreateAreaRequest) =>
    apiClient.post<ApiResponse<AreaResponse>>('/api/v1/areas', data),

  update: (id: string, data: UpdateAreaRequest) =>
    apiClient.put<ApiResponse<AreaResponse>>(`/api/v1/areas/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/areas/${id}`),
};