import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';

export interface Area {
  id: string;
  areaCode: string;
  name: string;
  description?: string;
}

export interface CreateAreaRequest {
  areaCode: string;
  name: string;
  description?: string;
}

export const areaService = {
  create: (data: CreateAreaRequest) =>
    apiClient.post<ApiResponse<Area>>('/api/v1/areas', data),
  getAll: () =>
    apiClient.get<ApiResponse<Area[]>>('/api/v1/areas'),
};
