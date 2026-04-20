import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';

export interface Warehouse {
	id: string;
	name: string;
	location: string;
	capacity: number;
}

export const warehouseService = {
	getAll: () => apiClient.get<ApiResponse<Warehouse[]>>('/api/v1/warehouses'),
	getById: (id: string) => apiClient.get<ApiResponse<Warehouse>>(`/api/v1/warehouses/${id}`),
	create: (data: Partial<Warehouse>) => 
		apiClient.post<ApiResponse<Warehouse>>('/api/v1/warehouses', data),
};
