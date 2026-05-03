import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';
import { GrowthTrackingResponse, CreateGrowthTrackingRequest, UpdateGrowthTrackingRequest} from '../model/growthtracking.model';

const endpoint = '/api/v1/growth-tracking';

export const growthTrackingService = {
    getAll: () =>
        apiClient.get<ApiResponse<GrowthTrackingResponse[]>>(endpoint),

    getById: (id: string) =>
        apiClient.get<ApiResponse<GrowthTrackingResponse>>(`${endpoint}/${id}`),

    create: (data: CreateGrowthTrackingRequest) =>
        apiClient.post<ApiResponse<GrowthTrackingResponse>>(endpoint, data),

    update: (id: string, data: UpdateGrowthTrackingRequest) =>
        apiClient.put<ApiResponse<GrowthTrackingResponse>>(`${endpoint}/${id}`, data),

    delete: (id: string) =>
        apiClient.delete<ApiResponse<void>>(`${endpoint}/${id}`),
};