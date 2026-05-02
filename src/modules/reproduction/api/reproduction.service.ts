import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import { SowRecord, ReproductionStats } from '../model/reproduction.model';

export const reproductionService = {
	getSows: () =>
		apiClient.get<ApiResponse<SowRecord[]>>("/api/v1/reproduction/sows"),

	getStats: () =>
		apiClient.get<ApiResponse<ReproductionStats>>("/api/v1/reproduction/stats"),

	updateSowStatus: (id: string, status: string) =>
		apiClient.put<ApiResponse<SowRecord>>(`/api/v1/reproduction/sows/${id}/status`, { status }),

	recordMating: (id: string, data: any) =>
		apiClient.post<ApiResponse<any>>(`/api/v1/reproduction/sows/${id}/mating`, data),
};
