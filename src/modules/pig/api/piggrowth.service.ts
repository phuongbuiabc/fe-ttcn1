// growth.service.ts

import { apiClient } from '@/shared/api/api-client';
import {
  GrowthTracking,
  CreateGrowthTrackingRequest,
  UpdateGrowthTrackingRequest,
} from '../model/piggrowth.model';

const BASE_URL = '/growth-tracking';

export const growthService = {
  getAll: () => apiClient.get<{ data: GrowthTracking[] }>(BASE_URL),

  getById: (id: string) =>
    apiClient.get<{ data: GrowthTracking }>(`${BASE_URL}/${id}`),

  create: (data: CreateGrowthTrackingRequest) =>
    apiClient.post(BASE_URL, data),

  update: (id: string, data: UpdateGrowthTrackingRequest) =>
    apiClient.put(`${BASE_URL}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`${BASE_URL}/${id}`),
};