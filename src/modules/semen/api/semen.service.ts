import { SemenResponse, CreateSemenRequest, UpdateSemenRequest } from "../model/semen.model";
import { ApiResponse } from "@/shared/types";
import { apiClient } from "@/shared/api/api-client";
import { create } from "domain";

const BASE_URL = "/api/v1/pig-semen";

export const semenService = {
    getSemens: () =>
        apiClient.get<ApiResponse<SemenResponse>>(`${BASE_URL}`),

    getSemenById: (id: string) =>
        apiClient.get<ApiResponse<SemenResponse>>(`${BASE_URL}/${id}`),

    createSemen: (data: CreateSemenRequest) =>
        apiClient.post<ApiResponse<SemenResponse>>(`${BASE_URL}`, data),

    updateSemen: (id: string, data: UpdateSemenRequest) =>
        apiClient.put<ApiResponse<SemenResponse>>(`${BASE_URL}/${id}`, data),

    deleteSemen: (id: string) =>
        apiClient.delete<ApiResponse<SemenResponse>>(`${BASE_URL}/${id}`),
};