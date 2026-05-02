import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import { WorkSchedule, CreateScheduleRequest } from '../model/staff.model';

export const scheduleService = {
	getSchedules: (params?: any) => 
		apiClient.get<ApiResponse<WorkSchedule[]>>('/api/v1/work-schedules', { params }),
    
	getScheduleById: (id: string) => 
		apiClient.get<ApiResponse<WorkSchedule>>(`/api/v1/work-schedules/${id}`),
    
	createSchedule: (data: CreateScheduleRequest) => 
		apiClient.post<ApiResponse<WorkSchedule>>('/api/v1/work-schedules', data),
    
	updateSchedule: (id: string, data: Partial<CreateScheduleRequest>) => 
		apiClient.put<ApiResponse<WorkSchedule>>(`/api/v1/work-schedules/${id}`, data),
    
	deleteSchedule: (id: string) => 
		apiClient.delete<ApiResponse<any>>(`/api/v1/work-schedules/${id}`),
};
