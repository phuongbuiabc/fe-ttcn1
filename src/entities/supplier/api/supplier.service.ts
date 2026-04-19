import { apiClient } from "@/shared/api/api-client";
import { Supplier, ApiResponse } from "@/shared/types";

// Dữ liệu mẫu khởi tạo (Sử dụng let để có thể thay đổi trong phiên làm việc)
let mockSuppliers: Supplier[] = [
  {
    id: "1",
    supplierCode: "NCC001",
    name: "Công ty Thức ăn Chăn nuôi CP",
    type: "Thức ăn",
    address: "KCN Biên Hòa 2, Đồng Nai",
    phone: "0251 3836 251",
    email: "contact@cp.com.vn"
  },
  {
    id: "2",
    supplierCode: "NCC002",
    name: "Dược phẩm Thú y GreenVet",
    type: "Thuốc thú y",
    address: "Lô C14, KCN Hiệp Phước, TP.HCM",
    phone: "028 3780 0888",
    email: "info@greenvet.vn"
  }
];

export const supplierService = {
  // Lấy danh sách nhà cung cấp
  getSuppliers: async (): Promise<ApiResponse<Supplier[]>> => {
    // KHI CÓ BACKEND: return apiClient.get<ApiResponse<Supplier[]>>('/api/v1/suppliers');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [...mockSuppliers],
          message: "Lấy danh sách thành công"
        });
      }, 300);
    });
  },

  // Thêm mới
  createSupplier: async (data: Omit<Supplier, 'id'>): Promise<ApiResponse<Supplier>> => {
    // KHI CÓ BACKEND: return apiClient.post<ApiResponse<Supplier>>('/api/v1/suppliers', data);

    const newSupplier = { id: Math.random().toString(36).substr(2, 9), ...data };
    mockSuppliers = [newSupplier, ...mockSuppliers];
    
    return {
      success: true,
      data: newSupplier,
      message: "Thêm thành công"
    };
  },

  // Cập nhật
  updateSupplier: async (id: string, data: Partial<Supplier>): Promise<ApiResponse<Supplier>> => {
    // KHI CÓ BACKEND: return apiClient.put<ApiResponse<Supplier>>(`/api/v1/suppliers/${id}`, data);

    mockSuppliers = mockSuppliers.map(s => s.id === id ? { ...s, ...data } : s);
    const updated = mockSuppliers.find(s => s.id === id);

    return {
      success: true,
      data: updated as Supplier,
      message: "Cập nhật thành công"
    };
  },

  // Xóa
  deleteSupplier: async (id: string): Promise<ApiResponse<any>> => {
    // KHI CÓ BACKEND: return apiClient.delete<ApiResponse<any>>(`/api/v1/suppliers/${id}`);

    mockSuppliers = mockSuppliers.filter(s => s.id !== id);
    return {
      success: true,
      data: null,
      message: "Xóa nhà cung cấp thành công"
    };
  }
};
