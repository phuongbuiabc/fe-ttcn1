import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';
import {
  DiseaseHistoryResponse,
  CreateDiseaseHistoryRequest,
  UpdateDiseaseHistoryRequest,
  DeleteDiseaseHistory,
} from '../model/diseasehistory.model';

const BASE_URL = '/api/v1/disease-histories';

export const diseaseHistoryService = {
  getAll: () =>
    apiClient.get<ApiResponse<DiseaseHistoryResponse[]>>(
      `${BASE_URL}`
    ),

  getById: (id: string) =>
    apiClient.get<ApiResponse<DiseaseHistoryResponse>>(
      `${BASE_URL}/${id}`
    ),

  create: (data: CreateDiseaseHistoryRequest) =>
    apiClient.post<ApiResponse<DiseaseHistoryResponse>>(
      `${BASE_URL}`,
      data
    ),

  update: (id: string, data: UpdateDiseaseHistoryRequest) =>
    apiClient.put<ApiResponse<DiseaseHistoryResponse>>(
      `${BASE_URL}/${id}`,
      data
    ),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<DeleteDiseaseHistory>>(
      `${BASE_URL}/${id}`
    ),
};