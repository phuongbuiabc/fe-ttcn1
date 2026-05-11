import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import { SowRecord, ReproductionStats } from '../model/reproduction.model';

const BASE_URL = "/api/v1/reproduction";
export const reproductionService = {
	getSows: () =>
		apiClient.get<ApiResponse<SowRecord[]>>(`${BASE_URL}/sows`),

	getStats: () =>
		apiClient.get<ApiResponse<ReproductionStats>>(`${BASE_URL}/stats`),

	

	updateSowStatus: (id: string, status: string) =>
		apiClient.put<ApiResponse<SowRecord>>(`${BASE_URL}/sows/${id}/status`, { status }),

	recordMating: (id: string, data: any) =>
		apiClient.post<ApiResponse<any>>(`${BASE_URL}/sows/${id}/mating`, data),
};
