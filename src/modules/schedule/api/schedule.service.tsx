import { apiClient } from "@/shared/api/api-client";
import { WorkSchedule, CreateScheduleRequest, ApiResponse } from "@/shared/types";

export const scheduleService = {
  getSchedules: (params?: any) => 
    apiClient.get<ApiResponse<WorkSchedule[]>>('/api/v1/work-schedules', {
      // Query params handling would go here if needed, 
      // but standard fetch needs it in the URL
      // For now we'll just handle the URL directly if params are provided.
    }),
    
  getScheduleById: (id: string) => 
    apiClient.get<ApiResponse<WorkSchedule>>(`/api/v1/work-schedules/${id}`),
    
  createSchedule: (data: CreateScheduleRequest) => 
    apiClient.post<ApiResponse<WorkSchedule>>('/api/v1/work-schedules', data),
    
  updateSchedule: (id: string, data: Partial<CreateScheduleRequest>) => 
    apiClient.put<ApiResponse<WorkSchedule>>(`/api/v1/work-schedules/${id}`, data),
    
  deleteSchedule: (id: string) => 
    apiClient.delete<ApiResponse<any>>(`/api/v1/work-schedules/${id}`),
};