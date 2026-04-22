import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';
import {
  BreedResponse,
  CreateBreedRequest,
  UpdateBreedRequest,
} from '../model/breed.model';

export const breedService = {
  getAll: () =>
    apiClient.get<ApiResponse<BreedResponse[]>>('/api/v1/breeds'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<BreedResponse>>(`/api/v1/breeds/${id}`),

  create: (data: CreateBreedRequest) =>
    apiClient.post<ApiResponse<BreedResponse>>('/api/v1/breeds', data),

  update: (id: string, data: UpdateBreedRequest) =>
    apiClient.put<ApiResponse<BreedResponse>>(`/api/v1/breeds/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/breeds/${id}`),
};