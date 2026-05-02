// pigletherd-growth.service.ts

import { apiClient } from '@/shared/api/api-client';
import {
  PigletHerdGrowth,
  CreatePigletHerdGrowthRequest,
  UpdatePigletHerdGrowthRequest,
} from '../model/pigletherdgrowth.model';

const BASE_URL = '/api/v1/piglet-herd-growth';

export const pigletHerdGrowthService = {
  getAll: () =>
    apiClient.get<{ data: PigletHerdGrowth[] }>(BASE_URL),

  getById: (id: string) =>
    apiClient.get<{ data: PigletHerdGrowth }>(`${BASE_URL}/${id}`),

  create: (data: CreatePigletHerdGrowthRequest) =>
    apiClient.post(BASE_URL, data),

  update: (id: string, data: UpdatePigletHerdGrowthRequest) =>
    apiClient.put(`${BASE_URL}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`${BASE_URL}/${id}`),
};