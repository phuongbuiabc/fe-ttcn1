import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';
import {
  DiseaseHistoryResponse,
  CreateDiseaseHistoryRequest,
  UpdateDiseaseHistoryRequest,
} from '../model/diseasehistory.model';

export const diseaseHistoryService = {
  getAll: () =>
    apiClient.get<ApiResponse<DiseaseHistoryResponse[]>>(
      '/api/v1/disease-histories'
    ),

  getById: (id: string) =>
    apiClient.get<ApiResponse<DiseaseHistoryResponse>>(
      `/api/v1/disease-histories/${id}`
    ),

  create: (data: CreateDiseaseHistoryRequest) =>
    apiClient.post<ApiResponse<DiseaseHistoryResponse>>(
      '/api/v1/disease-histories',
      data
    ),

  update: (id: string, data: UpdateDiseaseHistoryRequest) =>
    apiClient.put<ApiResponse<DiseaseHistoryResponse>>(
      `/api/v1/disease-histories/${id}`,
      data
    ),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(
      `/api/v1/disease-histories/${id}`
    ),
};