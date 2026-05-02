// growth.service.ts

import { apiClient } from '@/shared/api/api-client';
import {
  GrowthTracking,
  CreateGrowthTrackingRequest,
  UpdateGrowthTrackingRequest,
} from '../model/piggrowth.model';

const endpoint = '/api/v1/growth-tracking';

export const growthService = {
  getAll: () => apiClient.get<{ data: GrowthTracking[] }>(endpoint),

  getById: (id: string) =>
    apiClient.get<{ data: GrowthTracking }>(`${endpoint}/${id}`),

  create: (data: CreateGrowthTrackingRequest) =>
    apiClient.post(endpoint, data),

  update: (id: string, data: UpdateGrowthTrackingRequest) =>
    apiClient.put(`${endpoint}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`${endpoint}/${id}`),
};