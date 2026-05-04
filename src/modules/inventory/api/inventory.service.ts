import { apiClient } from "@/shared/api/api-client";
import { Supply, SupplyLoss } from "../model/inventory.model";
import { ApiResponse } from "@/shared/types";

const ENDPOINT = '/api/v1/livestock-materials';

let inventoryCache: Supply[] | null = null;

export const inventoryService = {
  // Lấy danh sách vật tư
  getSupplies: async (params?: any): Promise<ApiResponse<Supply[]>> => {
    const response = await apiClient.get<ApiResponse<Supply[]>>(ENDPOINT);
    if (response.success) {
      inventoryCache = response.data;
    }
    return response;
  },

  getCachedSupplies: () => inventoryCache,

  // Chi tiết vật tư
  getSupplyById: async (id: string): Promise<ApiResponse<Supply>> => {
    return apiClient.get<ApiResponse<Supply>>(`${ENDPOINT}/${id}`);
  },

  // Thêm mới
  createSupply: async (data: Omit<Supply, 'id'>): Promise<ApiResponse<Supply>> => {
    return apiClient.post<ApiResponse<Supply>>(ENDPOINT, data);
  },

  // Sửa
  updateSupply: async (id: string, data: Partial<Supply>): Promise<ApiResponse<Supply>> => {
    return apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${id}`, data);
  },

  // Xóa
  deleteSupply: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<ApiResponse<any>>(`${ENDPOINT}/${id}`);
  },

  // Ghi nhận hao hụt (API hiện tại chưa có phần này trong screenshot, giữ nguyên mock hoặc cập nhật nếu có endpoint)
  recordLoss: async (data: Omit<SupplyLoss, 'id'>): Promise<ApiResponse<SupplyLoss>> => {
    // API endpoint for loss is not clearly defined in the screenshot provided.
    // For now, we'll keep a mock or use a generic one if you provide it.
    // Assuming there might be a separate endpoint for this later.
    return {
      success: false,
      data: null as any,
      message: "Chức năng này chưa được API hỗ trợ"
    };

  },

  // Xem lịch sử hao hụt
  getLossHistory: async (params?: any): Promise<ApiResponse<SupplyLoss[]>> => {
    return {
      success: true,
      data: [],
      message: "Lấy lịch sử hao hụt thành công (Mock)"
    };
  },

  // Điều chỉnh tồn kho
  adjustStock: async (id: string, data: { quantity_change: number, reason: string, note?: string }): Promise<ApiResponse<Supply>> => {
    // Usually stock adjustment is a PUT or a specific POST endpoint.
    // Based on the screenshot, we only have GET, POST, PUT, DELETE for the material itself.
    // So we might need to use PUT to update the quantity.
    return {
      success: false,
      data: null as any,
      message: "Vui lòng sử dụng chức năng Cập nhật để điều chỉnh số lượng"
    };

  }
};