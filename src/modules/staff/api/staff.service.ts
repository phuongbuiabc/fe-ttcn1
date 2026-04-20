import { apiClient } from '@/shared/api/api-client';
import { ApiResponse, Employee, CreateEmployeeRequest } from '@/shared/types';

export const staffService = {
	getEmployees: () => 
		apiClient.get<ApiResponse<Employee[]>>('/api/v1/employees'),
    
	getEmployeeById: (id: string) => 
		apiClient.get<ApiResponse<Employee>>(`/api/v1/employees/${id}`),
    
	createEmployee: (data: CreateEmployeeRequest) => 
		apiClient.post<ApiResponse<Employee>>('/api/v1/employees', data),
    
	updateEmployee: (id: string, data: Partial<CreateEmployeeRequest>) => 
		apiClient.put<ApiResponse<Employee>>(`/api/v1/employees/${id}`, data),
    
	deleteEmployee: (id: string) => 
		apiClient.delete<ApiResponse<any>>(`/api/v1/employees/${id}`),
};
