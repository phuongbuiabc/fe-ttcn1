import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';
import {
    CreateMatingRequest,
    UpdateMatingRequest,
    MatingResponse,
    PregnancyCheck,
} from '../model/mating.model';
import { MatingStatus } from '@/shared/enums/mating.enum';

const endpoint = "/api/v1/mating-records";

export const matingService = {
    getMatings: (status?: MatingStatus) => {
        const query = status ? `?status=${encodeURIComponent(status)}` : '';
        return apiClient.get<ApiResponse<MatingResponse>>(`${endpoint}${query}`);
    },

    getMatingById: (id: string) =>
        apiClient.get<ApiResponse<MatingResponse>>(`${endpoint}/${id}`),

    getMatingsBySowId: (sowId: string) =>
        apiClient.get<ApiResponse<MatingResponse>>(`${endpoint}/by-pig/${sowId}`),

    getMatingsByEarTag: (earTag: string) =>
        apiClient.get<ApiResponse<MatingResponse>>(`${endpoint}/by-ma-lon/${earTag}`),

    createMating: (data: CreateMatingRequest) =>
        apiClient.post<ApiResponse<MatingResponse>>(`${endpoint}`, data),

    updateMating: (id: string, data: UpdateMatingRequest) =>
        apiClient.put<ApiResponse<MatingResponse>>(`${endpoint}/${id}`, data),

    updatePregnancyStatus: (ids: string[], status: MatingStatus) =>
        Promise.all(
            ids.map((id) =>
                apiClient.post<ApiResponse<PregnancyCheck>>(`${endpoint}/${id}/pregnancy-status`, { status })
            )
        ),

    deleteMating: (id: string) =>
        apiClient.delete<ApiResponse<MatingResponse>>(`${endpoint}/${id}`),
};