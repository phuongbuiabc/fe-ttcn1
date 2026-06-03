import { apiClient } from "@/shared/api/api-client";
import { 
  Supply, 
  SupplyLoss, 
  MaterialIssue, 
  MaterialIssueDetail, 
  MaterialReceipt, 
  MaterialReceiptDetail,
  ReceiptHistoryItem 
} from "../model/inventory.model";
import { ApiResponse } from "@/shared/types";

const ENDPOINT = '/api/v1/livestock-materials';

let inventoryCache: Supply[] | null = null;

export const inventoryService = {
  // Lấy danh sách vật tư
  getSupplies: async (params?: Record<string, string | number>): Promise<ApiResponse<Supply[]>> => {
    const response = await apiClient.get<ApiResponse<Supply[]>>(ENDPOINT);
    if (response.success) {
      inventoryCache = response.data;
    }
    return response;
  },

  getCachedSupplies: (): Supply[] | null => inventoryCache,

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
  deleteSupply: async (id: string): Promise<ApiResponse<unknown>> => {
    return apiClient.delete<ApiResponse<unknown>>(`${ENDPOINT}/${id}`);
  },

  // Ghi nhận hao hụt thực tế
  recordLoss: async (data: Omit<SupplyLoss, 'id'>): Promise<ApiResponse<MaterialIssueDetail | null>> => {
    try {
      // Bước 1: Tạo phiếu xuất kho (MaterialIssue)
      const issueRes = await apiClient.post<ApiResponse<MaterialIssue>>('/api/v1/material-issues', {
        issueDate: data.date,
        employeeId: data.employee_id,
        reason: data.reason,
        notes: data.note
      });

      if (!issueRes.success || !issueRes.data) {
        return {
          success: false,
          data: null,
          message: issueRes.message || "Không thể tạo phiếu xuất kho"
        };
      }

      const issueId = issueRes.data.id;

      // Bước 2: Tạo chi tiết hao hụt (MaterialIssueDetail)
      const detailRes = await apiClient.post<ApiResponse<MaterialIssueDetail>>('/api/v1/material-issue-details', {
        issueId: issueId,
        itemId: data.supply_id,
        quantity: data.quantity,
        unit: "Cái" 
      });

      // Bước 3: Tự động trừ tồn kho ngay lập tức
      const currentSupply = inventoryCache?.find(s => s.id === data.supply_id);
      if (currentSupply && detailRes.success) {
        const newQuantity = Math.max(0, currentSupply.quantity - data.quantity);
        await apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${data.supply_id}`, {
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
        apiClient.get<ApiResponse<MaterialIssueDetail[]>>('/api/v1/material-issue-details'),
        apiClient.get<ApiResponse<MaterialIssue[]>>('/api/v1/material-issues')
      ]);

      if (!detailsRes.success || !issuesRes.success) {
        return { success: false, data: [], message: "Không thể tải lịch sử" };
      }

      const details = detailsRes.data || [];
      const issues = issuesRes.data || [];

      // 2. Kết hợp dữ liệu (Join) - Sử dụng cache từ các lần load trước
      const mergedHistory: SupplyLoss[] = details.map(detail => {
        const parentIssue = issues.find(i => i.id === detail.issueId);
        const itemId = detail.itemId ?? (detail as any).item_id;
        const supplyInfo = inventoryCache?.find(s => s.id === itemId);
        
        return {
          id: detail.id,
          loss_id: parentIssue?.id || `ISSUE-${detail.id.slice(0,4)}`,
          supply_id: supplyInfo?.name || itemId || "Không rõ",
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
        apiClient.delete<ApiResponse<unknown>>(`/api/v1/material-issue-details/${lossDetail.id}`),
        apiClient.delete<ApiResponse<unknown>>(`/api/v1/material-issues/${issueId}`)
      ]);

      // 2. Hoàn kho: Cộng lại số lượng vật tư
      const supply = inventoryCache?.find(s => s.name === lossDetail.supply_id || s.id === lossDetail.supply_id);
      if (supply) {
        const newQty = (supply.quantity || 0) + (lossDetail.quantity || 0);
        await apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${supply.id}`, {
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
  getReceiptHistory: async (): Promise<ApiResponse<ReceiptHistoryItem[]>> => {
    try {
      const [detailsRes, receiptsRes] = await Promise.all([
        apiClient.get<ApiResponse<MaterialReceiptDetail[]>>('/api/v1/material-receipt-details'),
        apiClient.get<ApiResponse<MaterialReceipt[]>>('/api/v1/material-receipts')
      ]);

      if (!detailsRes.success || !receiptsRes.success) {
        return { success: false, data: [], message: "Không thể tải lịch sử nhập kho" };
      }

      const details = detailsRes.data || [];
      const receipts = receiptsRes.data || [];

      const mergedHistory: ReceiptHistoryItem[] = details.map(detail => {
        const parent = receipts.find(r => r.id === detail.receiptId);
        const itemId = detail.itemId ?? (detail as any).item_id;
        const supplyInfo = inventoryCache?.find(s => s.id === itemId);
        
        return {
          id: detail.id,
          receipt_id: parent?.id || `REC-${detail.id.slice(0,4)}`,
          supply_id: supplyInfo?.name || itemId || "Không rõ",
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
      data: null as unknown as Supply,
      message: "Vui lòng sử dụng chức năng Cập nhật để điều chỉnh số lượng"
    };
  },

  // Nhập kho vật tư (Transaction mô phỏng ở Frontend)
  importMaterials: async (data: {
    importDate: string;
    employeeId: string;
    supplierId: string;
    totalAmount: number;
    details: { materialId: string; quantity: number; unitPrice: number; lineTotal: number }[];
  }): Promise<ApiResponse<null>> => {
    try {
      // 1. Tạo phiếu nhập
      const receiptRes = await apiClient.post<ApiResponse<MaterialReceipt>>('/api/v1/material-receipts', {
        receiptDate: data.importDate,
        employeeId: data.employeeId,
        supplierId: data.supplierId,
        totalAmount: data.totalAmount
      });

      if (!receiptRes.success || !receiptRes.data) {
        return {
          success: false,
          data: null,
          message: receiptRes.message || "Không thể tạo phiếu nhập kho"
        };
      }

      const receiptId = receiptRes.data.id;

      // 2. Tạo chi tiết phiếu nhập & cập nhật tồn kho vật tư tương ứng
      for (const detail of data.details) {
        const detailRes = await apiClient.post<ApiResponse<MaterialReceiptDetail>>('/api/v1/material-receipt-details', {
          receiptId: receiptId,
          itemId: detail.materialId,
          itemType: "LIVESTOCK_MATERIAL",
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          lineTotal: detail.lineTotal
        });

        if (!detailRes.success) {
          return {
            success: false,
            data: null,
            message: detailRes.message || "Lỗi khi lưu chi tiết vật tư nhập kho"
          };
        }

        // Lấy thông tin hiện tại của vật tư để cộng thêm tồn
        let currentSupply = inventoryCache?.find(s => s.id === detail.materialId);
        if (!currentSupply) {
          const supplyRes = await apiClient.get<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`);
          if (supplyRes.success && supplyRes.data) {
            currentSupply = supplyRes.data;
          }
        }

        if (currentSupply) {
          const newQuantity = (currentSupply.quantity || 0) + detail.quantity;
          await apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`, {
            ...currentSupply,
            quantity: newQuantity
          });
        }
      }

      inventoryCache = null; // Xóa cache để làm mới danh mục vật tư
      return { success: true, data: null, message: "Nhập kho vật tư thành công" };
    } catch (error) {
      return { success: false, data: null, message: "Lỗi kết nối khi nhập kho" };
    }
  },

  // Xuất kho vật tư (Transaction mô phỏng ở Frontend)
  exportMaterials: async (data: {
    exportDate: string;
    employeeId: string;
    reason: string;
    totalLoss: number;
    details: { materialId: string; quantity: number; unitPrice: number; lineTotal: number; unit: string; reason?: string }[];
  }): Promise<ApiResponse<null>> => {
    try {
      // 1. Kiểm tra tồn kho toàn bộ vật tư trước khi tạo bất cứ thứ gì để tránh phiếu rác
      const suppliesToUpdate: { supply: Supply; quantityToSubtract: number }[] = [];
      
      for (const detail of data.details) {
        let currentSupply = inventoryCache?.find(s => s.id === detail.materialId);
        if (!currentSupply) {
          const supplyRes = await apiClient.get<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`);
          if (supplyRes.success && supplyRes.data) {
            currentSupply = supplyRes.data;
          }
        }

        if (!currentSupply) {
          return {
            success: false,
            data: null,
            message: "Không tìm thấy thông tin vật tư trong hệ thống"
          };
        }

        if ((currentSupply.quantity || 0) < detail.quantity) {
          return {
            success: false,
            data: null,
            message: `Vật tư "${currentSupply.name}" không đủ tồn kho (Còn lại: ${currentSupply.quantity} ${currentSupply.unit}, yêu cầu xuất: ${detail.quantity})`
          };
        }

        suppliesToUpdate.push({ supply: currentSupply, quantityToSubtract: detail.quantity });
      }

      // 2. Tạo phiếu xuất
      const issueRes = await apiClient.post<ApiResponse<MaterialIssue>>('/api/v1/material-issues', {
        issueDate: data.exportDate,
        employeeId: data.employeeId,
        reason: data.reason,
        totalLoss: data.totalLoss
      });

      if (!issueRes.success || !issueRes.data) {
        return {
          success: false,
          data: null,
          message: issueRes.message || "Không thể tạo phiếu xuất kho"
        };
      }

      const issueId = issueRes.data.id;

      // 3. Tạo chi tiết phiếu xuất & thực hiện trừ tồn kho vật tư
      for (let i = 0; i < data.details.length; i++) {
        const detail = data.details[i];
        const updateInfo = suppliesToUpdate[i];

        const detailRes = await apiClient.post<ApiResponse<MaterialIssueDetail>>('/api/v1/material-issue-details', {
          issueId: issueId,
          itemId: detail.materialId,
          quantity: detail.quantity,
          unit: detail.unit,
          unitPrice: detail.unitPrice,
          lineTotal: detail.lineTotal,
          reason: detail.reason || data.reason
        });

        if (!detailRes.success) {
          return {
            success: false,
            data: null,
            message: detailRes.message || "Lỗi khi lưu chi tiết vật tư xuất kho"
          };
        }

        // Cập nhật trừ tồn kho vật tư
        const newQuantity = Math.max(0, (updateInfo.supply.quantity || 0) - updateInfo.quantityToSubtract);
        await apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`, {
          ...updateInfo.supply,
          quantity: newQuantity
        });
      }

      inventoryCache = null; // Xóa cache
      return { success: true, data: null, message: "Xuất kho vật tư thành công" };
    } catch (error) {
      return { success: false, data: null, message: "Lỗi kết nối khi xuất kho" };
    }
  },

  // Lấy chi tiết 1 phiếu nhập kho
  getImportById: async (id: string): Promise<ApiResponse<{
    id: string;
    importDate: string;
    employeeId: string;
    supplierId: string;
    totalAmount: number;
    details: { id: string; materialId: string; quantity: number; unitPrice: number; lineTotal: number }[];
  }>> => {
    try {
      const receiptRes = await apiClient.get<ApiResponse<MaterialReceipt & { employeeId?: string, supplierId?: string, totalAmount?: number }>>(`/api/v1/material-receipts/${id}`);
      if (!receiptRes.success || !receiptRes.data) {
        return { success: false, data: null as any, message: receiptRes.message || "Không tìm thấy phiếu nhập" };
      }

      const detailsRes = await apiClient.get<ApiResponse<MaterialReceiptDetail[]>>('/api/v1/material-receipt-details');
      if (!detailsRes.success || !detailsRes.data) {
        return { success: false, data: null as any, message: "Không thể tải chi tiết phiếu nhập" };
      }

      // Handle both camelCase (receiptId) and snake_case (receipt_id) from backend
      const receiptDetails = detailsRes.data.filter((d: any) =>
        (d.receiptId ?? d.receipt_id) === id
      );

      const formattedDetails = receiptDetails.map((d: any) => ({
        id: d.id,
        materialId: d.itemId ?? d.item_id,
        quantity: d.quantity,
        unitPrice: d.unitPrice ?? d.unit_price ?? 0,
        lineTotal: d.quantity * (d.unitPrice ?? d.unit_price ?? 0)
      }));

      return {
        success: true,
        data: {
          id: receiptRes.data.id,
          importDate: receiptRes.data.receiptDate,
          employeeId: receiptRes.data.employeeId || "",
          supplierId: receiptRes.data.supplierId || "",
          totalAmount: receiptRes.data.totalAmount || 0,
          details: formattedDetails
        }
      };
    } catch (error) {
      return { success: false, data: null as any, message: "Lỗi kết nối khi tải phiếu nhập" };
    }
  },

  // Lấy chi tiết 1 phiếu xuất kho
  getExportById: async (id: string): Promise<ApiResponse<{
    id: string;
    exportDate: string;
    employeeId: string;
    reason: string;
    totalLoss: number;
    details: { id: string; materialId: string; quantity: number; unitPrice: number; lineTotal: number; unit: string }[];
  }>> => {
    try {
      const issueRes = await apiClient.get<ApiResponse<MaterialIssue & { totalLoss?: number }>>(`/api/v1/material-issues/${id}`);
      if (!issueRes.success || !issueRes.data) {
        return { success: false, data: null as any, message: issueRes.message || "Không tìm thấy phiếu xuất" };
      }

      const detailsRes = await apiClient.get<ApiResponse<MaterialIssueDetail[]>>('/api/v1/material-issue-details');
      if (!detailsRes.success || !detailsRes.data) {
        return { success: false, data: null as any, message: "Không thể tải chi tiết phiếu xuất" };
      }

      // Handle both camelCase (issueId) and snake_case (issue_id) from backend
      const issueDetails = detailsRes.data.filter((d: any) =>
        (d.issueId ?? d.issue_id) === id
      );

      const formattedDetails = issueDetails.map((d: any) => ({
        id: d.id,
        materialId: d.itemId ?? d.item_id,
        quantity: d.quantity,
        unitPrice: d.unitPrice ?? d.unit_price ?? 0,
        lineTotal: (d.lineTotal ?? d.line_total) || d.quantity * (d.unitPrice ?? d.unit_price ?? 0),
        unit: d.unit
      }));

      return {
        success: true,
        data: {
          id: issueRes.data.id,
          exportDate: issueRes.data.issueDate,
          employeeId: issueRes.data.employeeId || "",
          reason: issueRes.data.reason || "",
          totalLoss: issueRes.data.totalLoss || 0,
          details: formattedDetails
        }
      };
    } catch (error) {
      return { success: false, data: null as any, message: "Lỗi kết nối khi tải phiếu xuất" };
    }
  },

  // Hủy phiếu nhập và trừ kho tương ứng
  deleteImport: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const importRes = await inventoryService.getImportById(id);
      if (!importRes.success || !importRes.data) {
        return { success: false, data: null, message: importRes.message || "Không thể tìm thấy phiếu nhập" };
      }

      const importData = importRes.data;

      for (const detail of importData.details) {
        let currentSupply = inventoryCache?.find(s => s.id === detail.materialId);
        if (!currentSupply) {
          const supplyRes = await apiClient.get<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`);
          if (supplyRes.success && supplyRes.data) {
            currentSupply = supplyRes.data;
          }
        }

        if (currentSupply) {
          const newQuantity = Math.max(0, (currentSupply.quantity || 0) - detail.quantity);
          await apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`, {
            ...currentSupply,
            quantity: newQuantity
          });
        }
      }

      for (const detail of importData.details) {
        if (detail.id) {
          await apiClient.delete<ApiResponse<unknown>>(`/api/v1/material-receipt-details/${detail.id}`);
        }
      }

      await apiClient.delete<ApiResponse<unknown>>(`/api/v1/material-receipts/${id}`);

      inventoryCache = null;
      return { success: true, data: null, message: "Đã hủy phiếu nhập và trừ tồn kho thành công" };
    } catch (error) {
      return { success: false, data: null, message: "Lỗi khi hủy phiếu nhập" };
    }
  },

  // Hủy phiếu xuất và cộng trả kho tương ứng
  deleteExport: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const exportRes = await inventoryService.getExportById(id);
      if (!exportRes.success || !exportRes.data) {
        return { success: false, data: null, message: exportRes.message || "Không thể tìm thấy phiếu xuất" };
      }

      const exportData = exportRes.data;

      for (const detail of exportData.details) {
        if (!detail.materialId) continue;
        let currentSupply = inventoryCache?.find(s => s.id === detail.materialId);
        if (!currentSupply) {
          const supplyRes = await apiClient.get<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`);
          if (supplyRes.success && supplyRes.data) {
            currentSupply = supplyRes.data;
          }
        }

        if (currentSupply) {
          const newQuantity = (currentSupply.quantity || 0) + detail.quantity;
          await apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`, {
            ...currentSupply,
            quantity: newQuantity
          });
        }
      }

      for (const detail of exportData.details) {
        if (detail.id) {
          await apiClient.delete<ApiResponse<unknown>>(`/api/v1/material-issue-details/${detail.id}`);
        }
      }

      await apiClient.delete<ApiResponse<unknown>>(`/api/v1/material-issues/${id}`);

      inventoryCache = null;
      return { success: true, data: null, message: "Đã hủy phiếu xuất và hoàn kho thành công" };
    } catch (error) {
      return { success: false, data: null, message: "Lỗi khi hủy phiếu xuất" };
    }
  },

  // Cập nhật phiếu nhập kho và điều chỉnh tồn kho theo chênh lệch
  updateImport: async (id: string, data: {
    importDate: string;
    employeeId: string;
    supplierId: string;
    totalAmount: number;
    details: { materialId: string; quantity: number; unitPrice: number; lineTotal: number }[];
  }): Promise<ApiResponse<null>> => {
    try {
      const oldImportRes = await inventoryService.getImportById(id);
      if (!oldImportRes.success || !oldImportRes.data) {
        return { success: false, data: null, message: oldImportRes.message || "Không tìm thấy phiếu nhập cũ" };
      }

      const oldImport = oldImportRes.data;

      for (const detail of oldImport.details) {
        let currentSupply = inventoryCache?.find(s => s.id === detail.materialId);
        if (!currentSupply) {
          const supplyRes = await apiClient.get<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`);
          if (supplyRes.success && supplyRes.data) {
            currentSupply = supplyRes.data;
          }
        }
        if (currentSupply) {
          const rolledBackQty = Math.max(0, (currentSupply.quantity || 0) - detail.quantity);
          await apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`, {
            ...currentSupply,
            quantity: rolledBackQty
          });
        }
      }

      for (const detail of oldImport.details) {
        if (detail.id) {
          await apiClient.delete<ApiResponse<unknown>>(`/api/v1/material-receipt-details/${detail.id}`);
        }
      }

      const updateHeaderRes = await apiClient.put<ApiResponse<MaterialReceipt>>(`/api/v1/material-receipts/${id}`, {
        receiptDate: data.importDate,
        employeeId: data.employeeId,
        supplierId: data.supplierId,
        totalAmount: data.totalAmount
      });

      if (!updateHeaderRes.success) {
        return { success: false, data: null, message: updateHeaderRes.message || "Lỗi khi cập nhật thông tin chung phiếu nhập" };
      }

      for (const detail of data.details) {
        const createDetailRes = await apiClient.post<ApiResponse<MaterialReceiptDetail>>('/api/v1/material-receipt-details', {
          receiptId: id,
          itemId: detail.materialId,
          itemType: "LIVESTOCK_MATERIAL",
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          lineTotal: detail.lineTotal
        });

        if (!createDetailRes.success) {
          return { success: false, data: null, message: createDetailRes.message || "Lỗi khi lưu chi tiết vật tư nhập mới" };
        }

        let currentSupply = inventoryCache?.find(s => s.id === detail.materialId);
        if (!currentSupply) {
          const supplyRes = await apiClient.get<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`);
          if (supplyRes.success && supplyRes.data) {
            currentSupply = supplyRes.data;
          }
        }
        if (currentSupply) {
          const newQty = (currentSupply.quantity || 0) + detail.quantity;
          await apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`, {
            ...currentSupply,
            quantity: newQty
          });
        }
      }

      inventoryCache = null;
      return { success: true, data: null, message: "Cập nhật phiếu nhập kho thành công" };
    } catch (error) {
      return { success: false, data: null, message: "Lỗi kết nối khi cập nhật phiếu nhập" };
    }
  },

  // Cập nhật phiếu xuất kho và điều chỉnh tồn kho theo chênh lệch (có kiểm tra tồn khả dụng)
  updateExport: async (id: string, data: {
    exportDate: string;
    employeeId: string;
    reason: string;
    totalLoss: number;
    details: { materialId: string; quantity: number; unitPrice: number; lineTotal: number; unit: string; reason?: string }[];
  }): Promise<ApiResponse<null>> => {
    try {
      const oldExportRes = await inventoryService.getExportById(id);
      if (!oldExportRes.success || !oldExportRes.data) {
        return { success: false, data: null, message: oldExportRes.message || "Không tìm thấy phiếu xuất cũ" };
      }

      const oldExport = oldExportRes.data;
      const tempStockMap: Record<string, { supply: Supply, tempQuantity: number }> = {};

      for (const detail of oldExport.details) {
        if (!detail.materialId) continue;
        let currentSupply = inventoryCache?.find(s => s.id === detail.materialId);
        if (!currentSupply) {
          const supplyRes = await apiClient.get<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`);
          if (supplyRes.success && supplyRes.data) {
            currentSupply = supplyRes.data;
          }
        }
        if (currentSupply) {
          if (!tempStockMap[detail.materialId]) {
            tempStockMap[detail.materialId] = {
              supply: currentSupply,
              tempQuantity: (currentSupply.quantity || 0) + detail.quantity
            };
          } else {
            tempStockMap[detail.materialId].tempQuantity += detail.quantity;
          }
        }
      }

      for (const detail of data.details) {
        if (!detail.materialId) continue;
        if (!tempStockMap[detail.materialId]) {
          let currentSupply = inventoryCache?.find(s => s.id === detail.materialId);
          if (!currentSupply) {
            const supplyRes = await apiClient.get<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`);
            if (supplyRes.success && supplyRes.data) {
              currentSupply = supplyRes.data;
            }
          }
          if (currentSupply) {
            tempStockMap[detail.materialId] = {
              supply: currentSupply,
              tempQuantity: currentSupply.quantity || 0
            };
          } else {
            return { success: false, data: null, message: `Không tìm thấy vật tư có ID: ${detail.materialId}` };
          }
        }
      }

      for (const detail of data.details) {
        if (!detail.materialId) continue;
        const stockData = tempStockMap[detail.materialId];
        if (!stockData || stockData.tempQuantity < detail.quantity) {
          const name = stockData?.supply.name || detail.materialId;
          const available = stockData ? stockData.tempQuantity : 0;
          return {
            success: false,
            data: null,
            message: `Vật tư "${name}" không đủ tồn kho để cập nhật phiếu xuất (Tồn khả dụng tối đa sau hoàn trả: ${available}, yêu cầu xuất mới: ${detail.quantity})`
          };
        }
        stockData.tempQuantity -= detail.quantity;
      }

      for (const detail of oldExport.details) {
        if (!detail.materialId) continue;
        const currentSupply = tempStockMap[detail.materialId]?.supply;
        if (currentSupply) {
          const rolledBackQty = (currentSupply.quantity || 0) + detail.quantity;
          currentSupply.quantity = rolledBackQty;
          await apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`, {
            ...currentSupply,
            quantity: rolledBackQty
          });
        }
      }

      for (const detail of oldExport.details) {
        if (detail.id) {
          await apiClient.delete<ApiResponse<unknown>>(`/api/v1/material-issue-details/${detail.id}`);
        }
      }

      const updateHeaderRes = await apiClient.put<ApiResponse<MaterialIssue>>(`/api/v1/material-issues/${id}`, {
        issueDate: data.exportDate,
        employeeId: data.employeeId,
        reason: data.reason,
        totalLoss: data.totalLoss
      });

      if (!updateHeaderRes.success) {
        return { success: false, data: null, message: updateHeaderRes.message || "Lỗi khi cập nhật thông tin chung phiếu xuất" };
      }

      for (const detail of data.details) {
        const createDetailRes = await apiClient.post<ApiResponse<MaterialIssueDetail>>('/api/v1/material-issue-details', {
          issueId: id,
          itemId: detail.materialId,
          quantity: detail.quantity,
          unit: detail.unit,
          unitPrice: detail.unitPrice,
          lineTotal: detail.lineTotal,
          reason: detail.reason || data.reason
        });

        if (!createDetailRes.success) {
          return { success: false, data: null, message: createDetailRes.message || "Lỗi khi lưu chi tiết vật tư xuất mới" };
        }

        const currentSupply = tempStockMap[detail.materialId]?.supply;
        if (currentSupply) {
          const newQty = Math.max(0, (currentSupply.quantity || 0) - detail.quantity);
          currentSupply.quantity = newQty;
          await apiClient.put<ApiResponse<Supply>>(`${ENDPOINT}/${detail.materialId}`, {
            ...currentSupply,
            quantity: newQty
          });
        }
      }

      inventoryCache = null;
      return { success: true, data: null, message: "Cập nhật phiếu xuất kho thành công" };
    } catch (error) {
      return { success: false, data: null, message: "Lỗi kết nối khi cập nhật phiếu xuất" };
    }
  }
};