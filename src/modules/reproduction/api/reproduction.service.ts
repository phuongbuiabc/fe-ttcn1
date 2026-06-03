import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import {
  SowRecord,
  ReproductionStats,
  FarrowingRecordRequest,
  ReproductionCycleStatusRequest,
} from '../model/reproduction.model';
import { ReproductionCycle } from '@/shared/enums/reproductioncycle.enum';
import type { PregnantResponse } from '@/modules/pig/model/pig.model';

const BASE_URL = "/api/v1/reproduction-cycles";

export const reproductionService = {
	getAll: () => apiClient.get<ApiResponse<SowRecord[]>>(`${BASE_URL}`),
	getPregnantCycles: (status: ReproductionCycle = ReproductionCycle.TRACKING) =>
		apiClient.get<ApiResponse<PregnantResponse[]>>(
			`${BASE_URL}?status=${encodeURIComponent(status)}`
		),
	create: (data: Partial<SowRecord>) => apiClient.post<ApiResponse<SowRecord>>(`${BASE_URL}`, data),
	recordMiscarriage: (records: ReproductionCycleStatusRequest[]) =>
		apiClient.post<ApiResponse<unknown>>(`${BASE_URL}/miscarriage`, records),
	recordFarrowing: (records: FarrowingRecordRequest[]) =>
		apiClient.post<ApiResponse<unknown>>(`${BASE_URL}/farrowing`, records),
};
