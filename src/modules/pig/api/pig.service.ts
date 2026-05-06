import { apiClient } from '@/shared/api/api-client';
import {
  CreatePigRequest,
  UpdatePigRequest,
  PigResponse,
  PigDetailResponse,
  SowResponse,
  PigCurrentResponse,
  PregnantResponse,
  PigHistoryFarrowingResponse
} from '../model/pig.model';
import { ApiResponse } from '@/shared/types';
import { get } from 'http';

const endpoint = '/api/v1/pigs';

export const pigService = {
  create: (data: CreatePigRequest) =>
    apiClient.post<ApiResponse<PigResponse>>(`${endpoint}`, data),

  update: (id: string, data: UpdatePigRequest) =>
    apiClient.put<ApiResponse<PigResponse>>(`${endpoint}/${id}`, data),

  getAll: () =>
    apiClient.get<ApiResponse<PigResponse[]>>(`${endpoint}`),

  getById: (id: string) =>
    apiClient.get<ApiResponse<PigResponse>>(`${endpoint}/${id}`),

  getPigDetail: (id: string) =>
    apiClient.get<ApiResponse<PigDetailResponse>>(
      `${endpoint}/${id}/detail`
    ),

  getPigCurrent: (type?: string) =>
    apiClient.get<ApiResponse<PigCurrentResponse[]>>(
      `${endpoint}/with-latest-growth${
        type ? `?type=${encodeURIComponent(type)}` : ''
      }`
    ),
  
  getSow: () =>
    apiClient.get<ApiResponse<SowResponse[]>>(`${endpoint}/sows`),

  getPregnantPigs: () =>
    apiClient.get<ApiResponse<PregnantResponse[]>>(`${endpoint}/pregnant`),

  getPigHistoryFarrowing: (id: string) =>
    apiClient.get<ApiResponse<PigHistoryFarrowingResponse[]>>(
      `${endpoint}/${id}/farrowing-history`
    ),
    
  delete: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`${endpoint}/${id}`),
};