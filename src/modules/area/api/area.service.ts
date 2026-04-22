import { apiClient } from '@/shared/api/api-client';
import { Area, CreateAreaRequest } from '@/modules/area/model/area.model';

export const areaService = {
  getAll: () => apiClient.get<{ data: Area[] }>('/api/v1/areas'),
  create: (data: CreateAreaRequest) => apiClient.post('/api/v1/areas', data),
};
