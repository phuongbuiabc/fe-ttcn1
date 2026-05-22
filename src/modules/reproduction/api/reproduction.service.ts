import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import { SowRecord, ReproductionStats } from '../model/reproduction.model';
import { create } from "domain";

const BASE_URL = "/api/v1/reproduction-cycles";

export const reproductionService = {
	getAll: () => apiClient.get<ApiResponse<SowRecord[]>>(`${BASE_URL}`),
	create: (data: Partial<SowRecord>) => apiClient.post<ApiResponse<SowRecord>>(`${BASE_URL}`, data),
};
