// pigletherd-movement.service.ts

import { apiClient } from '@/shared/api/api-client';
import {
  PigletHerdMovement,
  CreatePigletHerdMovementRequest,
  UpdatePigletHerdMovementRequest,
} from '@/modules/pigletherds/model/pigletherdmovement.model';

const BASE_URL = '/piglet-herd-movement';

export const pigletHerdMovementService = {
  getAll: () =>
    apiClient.get<{ data: PigletHerdMovement[] }>(BASE_URL),

  getById: (id: string) =>
    apiClient.get<{ data: PigletHerdMovement }>(`${BASE_URL}/${id}`),

  create: (data: CreatePigletHerdMovementRequest) =>
    apiClient.post(BASE_URL, data),

  update: (id: string, data: UpdatePigletHerdMovementRequest) =>
    apiClient.put(`${BASE_URL}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`${BASE_URL}/${id}`),
};