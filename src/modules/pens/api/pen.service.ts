import { apiClient } from '@/shared/api/api-client';
import {
  PenResponse,
  PenDetailResponse,
  CreatePenRequest,
  UpdatePenRequest,
} from '@/modules/pens/model/pen.model';
import { ApiResponse } from '@/shared/types';

export const penService = {
  getAll: () =>
    apiClient.get<ApiResponse<PenResponse[]>>('/api/v1/pens'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<PenResponse>>(`/api/v1/pens/${id}`),

  getDetail: (id: string) =>
    apiClient.get<ApiResponse<PenDetailResponse>>(`/api/v1/pens/${id}/detail`),

  create: (data: CreatePenRequest) =>
    apiClient.post<ApiResponse<PenResponse>>('/api/v1/pens', data),

  update: (id: string, data: UpdatePenRequest) =>
    apiClient.put<ApiResponse<PenResponse>>(`/api/v1/pens/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`/api/v1/pens/${id}`),
};