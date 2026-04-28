import { apiClient } from "@/shared/api/api-client";
import {
  PigletHerdResponse,
  CreatePigletHerdRequest,
  UpdatePigletHerdRequest
} from "@/modules/pigletherds/model/pigletherd.model";

const BASE_URL = "/piglet-herds";

export const pigletHerdService = {
  getAll: () =>
    apiClient.get<{ data: PigletHerdResponse[] }>(BASE_URL),

  getById: (id: string) =>
    apiClient.get<{ data: PigletHerdResponse }>(`${BASE_URL}/${id}`),

  create: (data: CreatePigletHerdRequest) =>
    apiClient.post<{ data: PigletHerdResponse }>(BASE_URL, data),

  update: (id: string, data: UpdatePigletHerdRequest) =>
    apiClient.put<{ data: PigletHerdResponse }>(`${BASE_URL}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`${BASE_URL}/${id}`)
};