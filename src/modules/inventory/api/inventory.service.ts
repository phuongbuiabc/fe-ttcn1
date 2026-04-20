import { apiClient } from "@/shared/api/api-client";
import { ApiResponse } from "@/shared/types";
import { Supply, SupplyLoss } from '../model/inventory.model';

// Mock data
let mockSupplies: Supply[] = [
	{
		id: "1",
		supply_id: "VT001",
		supply_name: "Cám heo giai đoạn 1",
		quantity: 500,
		unit: "Bao 25kg",
		supply_type: "Thức ăn",
		description: "Thức ăn hỗn hợp cho heo từ 10-20kg"
	},
	{
		id: "2",
		supply_id: "VT002",
		supply_name: "Vaccine dịch tả",
		quantity: 100,
		unit: "Liều",
		supply_type: "Thuốc thú y",
		description: "Vaccine phòng bệnh dịch tả lợn"
	}
];

let mockLossHistory: SupplyLoss[] = [];

export const inventoryService = {
	// Lấy danh sách vật tư
	getSupplies: async (params?: any): Promise<ApiResponse<Supply[]>> => {
		// KHI CÓ BACKEND: return apiClient.get<ApiResponse<Supply[]>>('/api/v1/supplies', { params });
		return {
			success: true,
			data: [...mockSupplies],
			message: "Lấy danh sách vật tư thành công"
		};
	},

	// Chi tiết vật tư
	getSupplyById: async (id: string): Promise<ApiResponse<Supply>> => {
		// KHI CÓ BACKEND: return apiClient.get<ApiResponse<Supply>>(`/api/v1/supplies/${id}`);
		const supply = mockSupplies.find(s => s.id === id);
		return {
			success: true,
			data: supply as Supply,
			message: "Lấy chi tiết thành công"
		};
	},

	// Thêm mới
	createSupply: async (data: Omit<Supply, 'id'>): Promise<ApiResponse<Supply>> => {
		// KHI CÓ BACKEND: return apiClient.post<ApiResponse<Supply>>('/api/v1/supplies', data);
		const newSupply = { id: Math.random().toString(36).substr(2, 9), ...data };
		mockSupplies = [newSupply, ...mockSupplies];
    
		return {
			success: true,
			data: newSupply,
			message: "Thêm vật tư thành công"
		};
	},
	// ...existing code...
