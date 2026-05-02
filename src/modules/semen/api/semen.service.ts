import { SemenResponse, CreateSemenRequest, UpdateSemenRequest } from "../model/semen.model";
import { ApiResponse } from "@/shared/types";
import { apiClient } from "@/shared/api/api-client";

const endpoint = "/api/v1/pig-semen";

export const semenService = {
    getSemens: () =>
        apiClient.get<ApiResponse<SemenResponse>>(`${endpoint}`),

    getSemenById: (id: string) =>
        apiClient.get<ApiResponse<SemenResponse>>(`${endpoint}/${id}`),

    createSemen: (data: CreateSemenRequest) =>
        apiClient.post<ApiResponse<SemenResponse>>(`${endpoint}`, data),

    updateSemen: (id: string, data: UpdateSemenRequest) =>
        apiClient.put<ApiResponse<SemenResponse>>(`${endpoint}/${id}`, data),

    deleteSemen: (id: string) =>
        apiClient.delete<ApiResponse<SemenResponse>>(`${endpoint}/${id}`),
};