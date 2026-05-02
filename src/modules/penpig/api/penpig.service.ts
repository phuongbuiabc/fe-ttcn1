import {apiClient} from "@/shared/api/api-client";
import {
  PenPigResponse,
  CreatePenPigRequest,
  UpdatePenPigRequest
} from "../model/penpig.model";

const BASE_URL = "/api/v1/pen-pigs";

export const penPigService = {
  getAll: () => apiClient.get<{ data: PenPigResponse[] }>(BASE_URL),

  getById: (id: string) =>
    apiClient.get<{ data: PenPigResponse }>(`${BASE_URL}/${id}`),

  create: (data: CreatePenPigRequest) =>
    apiClient.post<{ data: PenPigResponse }>(BASE_URL, data),

  update: (id: string, data: UpdatePenPigRequest) =>
    apiClient.put<{ data: PenPigResponse }>(`${BASE_URL}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`${BASE_URL}/${id}`)
};