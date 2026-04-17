import { apiClient } from "@/shared/api/api-client";
import { ApiResponse, SowRecord, ReproductionStats } from "@/shared/types";

export const reproductionService = {
  getSows: () => 
    apiClient.get<ApiResponse<SowRecord[]>>("/reproduction/sows"),

  getStats: () => 
    apiClient.get<ApiResponse<ReproductionStats>>("/reproduction/stats"),

  updateSowStatus: (id: string, status: string) => 
    apiClient.put<ApiResponse<SowRecord>>(`/reproduction/sows/${id}/status`, { status }),

  recordMating: (id: string, data: any) => 
    apiClient.post<ApiResponse<any>>(`/reproduction/sows/${id}/mating`, data),
};
