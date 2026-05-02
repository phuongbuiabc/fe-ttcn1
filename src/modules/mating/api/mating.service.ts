import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';
import { CreateMatingRequest, UpdateMatingRequest, MatingResponse } from '../model/mating.model';
import { get } from 'http';

const endpoint = "/api/v1/mating-records";

export const matingService = {
    getMatings: () =>
        apiClient.get<ApiResponse<MatingResponse>>(`${endpoint}`),

    getMatingById: (id: string) =>
        apiClient.get<ApiResponse<MatingResponse>>(`${endpoint}/${id}`),

    getMatingsBySowId: (sowId: string) =>
        apiClient.get<ApiResponse<MatingResponse>>(`${endpoint}/ny-pig/${sowId}`),

    getMatingsByEarTag: (earTag: string) =>
        apiClient.get<ApiResponse<MatingResponse>>(`${endpoint}/by-ma-lon/${earTag}`),

    createMating: (data: CreateMatingRequest) =>
        apiClient.post<ApiResponse<MatingResponse>>(`${endpoint}`, data),

    updateMating: (id: string, data: UpdateMatingRequest) =>
        apiClient.put<ApiResponse<MatingResponse>>(`${endpoint}/${id}`, data),

    deleteMating: (id: string) =>
        apiClient.delete<ApiResponse<MatingResponse>>(`${endpoint}/${id}`),
};