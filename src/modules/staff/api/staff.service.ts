import { apiClient } from '@/shared/api/api-client';
import { ApiResponse, Employee, CreateEmployeeRequest } from '@/shared/types';

let employeeCache: Employee[] | null = null;

export const staffService = {
	getEmployees: async () => {
		const response = await apiClient.get<ApiResponse<Employee[]>>('/api/v1/employees');
		if (response.success) {
			employeeCache = response.data;
		}
		return response;
	},

	getCachedEmployees: () => employeeCache,
    
	getEmployeeById: (id: string) => 
		apiClient.get<ApiResponse<Employee>>(`/api/v1/employees/${id}`),

	getMe: () =>
		apiClient.get<ApiResponse<Employee>>('/api/v1/employees/me'),
    
	createEmployee: (data: CreateEmployeeRequest) => 
		apiClient.post<ApiResponse<Employee>>('/api/v1/employees', data),
    
	updateEmployee: (id: string, data: Partial<CreateEmployeeRequest>) => 
		apiClient.put<ApiResponse<Employee>>(`/api/v1/employees/${id}`, data),
    
	deleteEmployee: (id: string) => 
		apiClient.delete<ApiResponse<any>>(`/api/v1/employees/${id}`),
};

