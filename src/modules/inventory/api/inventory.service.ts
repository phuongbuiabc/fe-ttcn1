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

  // Ghi nhận hao hụt thực tế
  recordLoss: async (data: Omit<SupplyLoss, 'id'>): Promise<ApiResponse<any>> => {
    try {
      // Bước 1: Tạo phiếu xuất kho (MaterialIssue)
      const issueRes = await apiClient.post<ApiResponse<any>>('/api/v1/material-issues', {
        issueDate: data.date,
        employeeId: data.employee_id,
        reason: data.reason,
        notes: data.note
      });

      if (!issueRes.success || !issueRes.data) {
        return issueRes;
      }

      const issueId = issueRes.data.id;

      // Bước 2: Tạo chi tiết hao hụt (MaterialIssueDetail)
      const detailRes = await apiClient.post<ApiResponse<any>>('/api/v1/material-issue-details', {
        issueId: issueId,
        itemId: data.supply_id,
        quantity: data.quantity,
        unit: "Cái" 
      });

      // Bước 3: Tự động trừ tồn kho ngay lập tức
      const currentSupply = inventoryCache?.find(s => s.id === data.supply_id);
      if (currentSupply && detailRes.success) {
        const newQuantity = Math.max(0, currentSupply.quantity - data.quantity);
        await apiClient.put(`${ENDPOINT}/${data.supply_id}`, {
          ...currentSupply,
          quantity: newQuantity
        });
      }

      return detailRes;
    } catch (error) {
      return {
        success: false,
        data: null,
        message: "Lỗi kết nối khi ghi nhận hao hụt"
      };
    }
  },

  // Xem lịch sử hao hụt thật từ API (Đã tối ưu tốc độ)
  getLossHistory: async (): Promise<ApiResponse<SupplyLoss[]>> => {
    try {
      // 1. Chỉ lấy những thứ thực sự cần thiết (Details và Issues)
      const [detailsRes, issuesRes] = await Promise.all([
        apiClient.get<ApiResponse<any[]>>('/api/v1/material-issue-details'),
        apiClient.get<ApiResponse<any[]>>('/api/v1/material-issues')
      ]);

      if (!detailsRes.success || !issuesRes.success) {
        return { success: false, data: [], message: "Không thể tải lịch sử" };
      }

      const details = detailsRes.data || [];
      const issues = issuesRes.data || [];

      // 2. Kết hợp dữ liệu (Join) - Sử dụng cache từ các lần load trước
      const mergedHistory: SupplyLoss[] = details.map(detail => {
        const parentIssue = issues.find(i => i.id === detail.issueId);
        const supplyInfo = inventoryCache?.find(s => s.id === detail.itemId);
        
        return {
          id: detail.id,
          loss_id: parentIssue?.id || `ISSUE-${detail.id.slice(0,4)}`,
          supply_id: supplyInfo?.name || detail.itemId,
          date: parentIssue?.issueDate || "N/A",
          employee_id: parentIssue?.employeeId || "N/A",
          quantity: detail.quantity,
          reason: parentIssue?.reason || "Hao hụt",
          note: parentIssue?.notes || ""
        };
      });

      return {
        success: true,
        data: mergedHistory.reverse()
      };
    } catch (error) {
      return { success: false, data: [], message: "Lỗi kết nối lịch sử" };
    }
  },

  // Hủy phiếu hao hụt và hoàn kho
  voidLoss: async (lossDetail: SupplyLoss): Promise<ApiResponse<null>> => {
    try {
      const issueId = lossDetail.loss_id;
      // 1. Xóa các bản ghi liên quan
      await Promise.all([
        apiClient.delete(`/api/v1/material-issue-details/${lossDetail.id}`),
        apiClient.delete(`/api/v1/material-issues/${issueId}`)
      ]);

      // 2. Hoàn kho: Cộng lại số lượng vật tư
      const supply = inventoryCache?.find(s => s.name === lossDetail.supply_id || s.id === lossDetail.supply_id);
      if (supply) {
        const newQty = (supply.quantity || 0) + (lossDetail.quantity || 0);
        await apiClient.put(`${ENDPOINT}/${supply.id}`, {
          ...supply,
          quantity: newQty
        });
      }

      return { success: true, data: null, message: "Đã hủy phiếu và hoàn kho thành công" };
    } catch (error) {
      return { success: false, data: null, message: "Lỗi khi hủy phiếu" };
    }
  },

  // Lấy lịch sử nhập kho
  getReceiptHistory: async (): Promise<ApiResponse<any[]>> => {
    try {
      const [detailsRes, receiptsRes] = await Promise.all([
        apiClient.get<ApiResponse<any[]>>('/api/v1/material-receipt-details'),
        apiClient.get<ApiResponse<any[]>>('/api/v1/material-receipts')
      ]);

      if (!detailsRes.success || !receiptsRes.success) {
        return { success: false, data: [], message: "Không thể tải lịch sử nhập kho" };
      }

      const details = detailsRes.data || [];
      const receipts = receiptsRes.data || [];

      const mergedHistory = details.map(detail => {
        const parent = receipts.find(r => r.id === detail.receiptId);
        const supplyInfo = inventoryCache?.find(s => s.id === detail.itemId);
        
        return {
          id: detail.id,
          receipt_id: parent?.id || `REC-${detail.id.slice(0,4)}`,
          supply_id: supplyInfo?.name || detail.itemId,
          date: parent?.receiptDate || "N/A",
          supplier: parent?.supplierName || "N/A",
          quantity: detail.quantity,
          price: detail.unitPrice,
          unit: detail.unit || "Cái"
        };
      });

      return { success: true, data: mergedHistory.reverse() };
    } catch (error) {
      return { success: false, data: [], message: "Lỗi kết nối nhập kho" };
    }
  },

  // Điều chỉnh tồn kho
  adjustStock: async (id: string, data: { quantity_change: number, reason: string, note?: string }): Promise<ApiResponse<Supply>> => {
    return {
      success: false,
      data: null as any,
      message: "Vui lòng sử dụng chức năng Cập nhật để điều chỉnh số lượng"
    };
  }
};