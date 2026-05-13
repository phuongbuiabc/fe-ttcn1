import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import { Supplier } from '../model/supplier.model';

const ENDPOINT = '/api/v1/suppliers';

let supplierCache: Supplier[] | null = null;

export const supplierService = {
	// Lấy danh sách nhà cung cấp
	getSuppliers: async (): Promise<ApiResponse<Supplier[]>> => {
		const response = await apiClient.get<ApiResponse<Supplier[]>>(ENDPOINT);
		if (response.success) {
			supplierCache = response.data;
		}
		return response;
	},
	
	getCachedSuppliers: () => supplierCache,


	// Thêm mới
	createSupplier: async (data: Omit<Supplier, 'id'>): Promise<ApiResponse<Supplier>> => {
		return apiClient.post<ApiResponse<Supplier>>(ENDPOINT, data);
	},

	// Cập nhật
	updateSupplier: async (id: string, data: Partial<Supplier>): Promise<ApiResponse<Supplier>> => {
		return apiClient.put<ApiResponse<Supplier>>(`${ENDPOINT}/${id}`, data);
	},
	
	// Xóa nhà cung cấp
	deleteSupplier: async (id: string): Promise<ApiResponse<null>> => {
		return apiClient.delete<ApiResponse<null>>(`${ENDPOINT}/${id}`);
	}
}