import { apiClient } from "@/shared/api/api-client";
import { Supply, SupplyLoss, ApiResponse } from "@/shared/types";

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

  // Sửa
  updateSupply: async (id: string, data: Partial<Supply>): Promise<ApiResponse<Supply>> => {
    // KHI CÓ BACKEND: return apiClient.put<ApiResponse<Supply>>(`/api/v1/supplies/${id}`, data);
    mockSupplies = mockSupplies.map(s => s.id === id ? { ...s, ...data } : s);
    const updated = mockSupplies.find(s => s.id === id);
    return {
      success: true,
      data: updated as Supply,
      message: "Cập nhật thành công"
    };
  },

  // Xóa
  deleteSupply: async (id: string): Promise<ApiResponse<any>> => {
    // KHI CÓ BACKEND: return apiClient.delete<ApiResponse<any>>(`/api/v1/supplies/${id}`);
    mockSupplies = mockSupplies.filter(s => s.id !== id);
    return {
      success: true,
      data: null,
      message: "Xóa vật tư thành công"
    };
  },

  // Ghi nhận hao hụt
  recordLoss: async (data: Omit<SupplyLoss, 'id'>): Promise<ApiResponse<SupplyLoss>> => {
    // KHI CÓ BACKEND: return apiClient.post<ApiResponse<SupplyLoss>>('/api/v1/supplies/losses', data);
    const newLoss = { id: Math.random().toString(36).substr(2, 9), ...data };
    mockLossHistory = [newLoss, ...mockLossHistory];
    
    // Cập nhật tồn kho tự động
    const supply = mockSupplies.find(s => s.supply_id === data.supply_id);
    if (supply) {
      supply.quantity = Math.max(0, supply.quantity - data.quantity);
    }

    return {
      success: true,
      data: newLoss,
      message: "Ghi nhận hao hụt thành công"
    };
  },

  // Xem lịch sử hao hụt
  getLossHistory: async (params?: any): Promise<ApiResponse<SupplyLoss[]>> => {
    // KHI CÓ BACKEND: return apiClient.get<ApiResponse<SupplyLoss[]>>('/api/v1/supplies/losses', { params });
    let filtered = [...mockLossHistory];
    if (params?.supply_id) {
      filtered = filtered.filter(l => l.supply_id === params.supply_id);
    }
    return {
      success: true,
      data: filtered,
      message: "Lấy lịch sử hao hụt thành công"
    };
  },

  // Điều chỉnh tồn kho
  adjustStock: async (id: string, data: { quantity_change: number, reason: string, note?: string }): Promise<ApiResponse<Supply>> => {
    // KHI CÓ BACKEND: return apiClient.post<ApiResponse<Supply>>(`/api/v1/supplies/${id}/adjust`, data);
    const supply = mockSupplies.find(s => s.id === id);
    if (supply) {
      supply.quantity = Math.max(0, supply.quantity + data.quantity_change);
    }
    return {
      success: true,
      data: supply as Supply,
      message: "Điều chỉnh tồn kho thành công"
    };
  }
};