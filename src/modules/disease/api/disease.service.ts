import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';
import { CreateDiseaseRequest, UpdateDiseaseRequest, DiseaseResponse } from '@/modules/disease/model/disease.model';


export const diseaseService = {
  getAll: () =>
    apiClient.get<ApiResponse<DiseaseResponse[]>>('/api/v1/diseases'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<DiseaseResponse>>(`/api/v1/diseases/${id}`),

  create: (data: CreateDiseaseRequest) =>
    apiClient.post<ApiResponse<DiseaseResponse>>('/api/v1/diseases', data),

  update: (id: string, data: UpdateDiseaseRequest) =>
    apiClient.put<ApiResponse<DiseaseResponse>>(`/api/v1/diseases/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/diseases/${id}`),
};