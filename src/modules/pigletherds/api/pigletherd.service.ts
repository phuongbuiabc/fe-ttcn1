import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import {
  PigletHerdResponse,
  CreatePigletHerdRequest,
  UpdatePigletHerdRequest
} from "@/modules/pigletherds/model/pigletherd.model";

const BASE_URL = "/api/v1/piglet-herds";

export const pigletHerdService = {
  getAll: () =>
    apiClient.get<{ data: PigletHerdResponse[] }>(BASE_URL),

  getById: (id: string) =>
    apiClient.get<{ data: PigletHerdResponse }>(`${BASE_URL}/${id}`),

  getDetail: (id: string) =>
    apiClient.get<ApiResponse<any>>(`${BASE_URL}/${id}/detail`),

  split: (id: string, data: any) =>
    apiClient.post(`${BASE_URL}/${id}/split`, data),

  create: (data: CreatePigletHerdRequest) =>
    apiClient.post<{ data: PigletHerdResponse }>(BASE_URL, data),

  update: (id: string, data: UpdatePigletHerdRequest) =>
    apiClient.put<{ data: PigletHerdResponse }>(`${BASE_URL}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`${BASE_URL}/${id}`)
};