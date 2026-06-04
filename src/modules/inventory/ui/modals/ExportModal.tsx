"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, User, FileText, Plus, Trash2, DollarSign, Package } from "lucide-react";
import { BaseModal } from "@/shared/components/ui/BaseModal";
import { CustomSelect } from "@/shared/components/ui/CustomSelect";
import { staffService } from "@/modules/staff/api/staff.service";
import { inventoryService } from "../../api/inventory.service";
import { Supply } from "../../model/inventory.model";
import { Employee } from "@/shared/types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "create" | "edit" | "view";
  selectedId?: string;
}

interface ExportDetailItem {
  materialId: string;
  quantity: number;
  unitPrice: number;
}

export function ExportModal({ isOpen, onClose, onSuccess, mode = "create", selectedId }: ExportModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const optionsLoadedRef = useRef(false);

  // Form states
  const [exportDate, setExportDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [employeeId, setEmployeeId] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState<ExportDetailItem[]>([
    { materialId: "", quantity: 1, unitPrice: 0 }
  ]);

  // Load options data
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoadingOptions(true);
      try {
        if (!optionsLoadedRef.current) {
          const [empRes, matRes] = await Promise.all([
            staffService.getEmployees(),
            inventoryService.getSupplies()
          ]);

          if (empRes.success) setEmployees(empRes.data || []);
          if (matRes.success) setSupplies(matRes.data || []);
          optionsLoadedRef.current = true;
        }

        if ((mode === "edit" || mode === "view") && selectedId) {
          const res = await inventoryService.getExportById(selectedId);
          if (res.success && res.data) {
            setExportDate(res.data.exportDate);
            setEmployeeId(res.data.employeeId);
            setReason(res.data.reason);
            setDetails(res.data.details.map(d => ({
              materialId: d.materialId,
              quantity: d.quantity,
              unitPrice: d.unitPrice
            })));
          } else {
            alert(res.message || "Không thể tải chi tiết phiếu xuất");
          }
        }
      } catch (err) {
        console.error("Error loading export form options:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadData();

    if (mode === "create") {
      setExportDate(new Date().toISOString().split("T")[0]);
      setEmployeeId("");
      setReason("");
      setDetails([{ materialId: "", quantity: 1, unitPrice: 0 }]);
    }
  }, [isOpen, mode, selectedId]);

  const handleAddRow = () => {
    setDetails([...details, { materialId: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    if (details.length === 1) {
      setDetails([{ materialId: "", quantity: 1, unitPrice: 0 }]);
    } else {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  const handleRowChange = (index: number, field: keyof ExportDetailItem, value: any) => {
    const updated = [...details];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setDetails(updated);
  };

  const calculateTotal = () => {
    return details.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;
    if (!employeeId) return alert("Vui lòng chọn nhân viên thực hiện");
    if (!reason) return alert("Vui lòng nhập lý do xuất kho");

    for (const d of details) {
      if (!d.materialId) return alert("Vui lòng chọn đầy đủ vật tư");
      if (d.quantity <= 0) return alert("Số lượng xuất phải lớn hơn 0");
    }

    setSubmitting(true);
    try {
      const payload = {
        exportDate,
        employeeId,
        reason,
        totalLoss: calculateTotal(),
        details: details.map(d => {
          const item = supplies.find(s => s.id === d.materialId);
          return {
            materialId: d.materialId,
            quantity: Number(d.quantity),
            unitPrice: Number(d.unitPrice),
            lineTotal: Number(d.quantity) * Number(d.unitPrice),
            unit: item ? item.unit : "Kg",
            reason: reason
          };
        })
      };

      const res = mode === "edit" && selectedId
        ? await inventoryService.updateExport(selectedId, payload)
        : await inventoryService.exportMaterials(payload);

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        alert(res.message || "Đã xảy ra lỗi khi lưu phiếu xuất");
      }
    } catch (err) {
      alert("Lỗi kết nối khi gửi yêu cầu xuất kho");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "view" ? "Chi Tiết Phiếu Xuất" : mode === "edit" ? "Chỉnh Sửa Phiếu Xuất" : "Tạo Phiếu Xuất Kho"}
      subtitle={mode === "view" ? "Xem chi tiết phiếu xuất vật tư" : mode === "edit" ? "Chỉnh sửa thông tin và danh sách xuất kho" : "Xuất vật tư chăn nuôi sử dụng cho chuồng trại hoặc hao hụt"}
      className="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ngày xuất kho</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="date"
                required
                disabled={mode === "view"}
                value={exportDate}
                onChange={e => setExportDate(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-[#f8fafc] border-2 border-transparent rounded-2xl text-sm font-bold focus:border-rose-500/20 focus:bg-white focus:ring-4 focus:ring-rose-500/5 transition-all duration-300 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nhân viên thực hiện</label>
            <CustomSelect
              value={employeeId}
              disabled={mode === "view"}
              onChange={val => setEmployeeId(val)}
              options={employees.map(emp => ({
                value: emp.id,
                label: emp.fullName || `${emp.firstName} ${emp.lastName}`
              }))}
              icon={User}
              placeholder="Chọn nhân viên"
            />
          </div>
        </div>

        {/* Reason Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Lý do xuất kho</label>
          <div className="relative">
            <FileText className="absolute left-5 top-5 text-slate-400" size={16} />
            <textarea
              required
              disabled={mode === "view"}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Ví dụ: Xuất cho chuồng đẻ ăn, Tiêm phòng vaccine tai xanh chuồng cai sữa..."
              rows={2}
              className="w-full pl-12 pr-5 py-4 bg-[#f8fafc] border-2 border-transparent rounded-2xl text-sm font-bold focus:border-rose-500/20 focus:bg-white focus:ring-4 focus:ring-rose-500/5 transition-all duration-300 outline-none placeholder:text-slate-400 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Materials Table List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">Danh sách vật tư xuất kho</span>
            {mode !== "view" && (
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all"
              >
                <Plus size={12} /> Thêm dòng
              </button>
            )}
          </div>

          <div className="space-y-3 overflow-visible min-h-[120px]">
            {details.map((row, index) => {
              const selectedItem = supplies.find(s => s.id === row.materialId);
              const unitLabel = selectedItem ? selectedItem.unit : "";

              return (
                <div key={index} className="flex flex-col md:flex-row items-end md:items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60 overflow-visible relative z-20">
                  {/* Select Material */}
                  <div className="w-full md:flex-1 space-y-1">
                    <CustomSelect
                      value={row.materialId}
                      disabled={mode === "view"}
                      onChange={val => handleRowChange(index, "materialId", val)}
                      options={supplies.map(sup => ({
                        value: sup.id,
                        label: `${sup.name} (${sup.materialType === "FEED" ? "Thức ăn" : sup.materialType === "VACCINE" ? "Vaccine" : "Thuốc"}) - Tồn: ${sup.quantity} ${sup.unit}`
                      }))}
                      placeholder="Chọn vật tư..."
                      icon={Package}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="w-full md:w-40 space-y-1">
                    <div className="relative">
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        required
                        disabled={mode === "view"}
                        value={row.quantity || ""}
                        onChange={e => handleRowChange(index, "quantity", e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Số lượng"
                        className="w-full pl-4 pr-16 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-rose-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      {unitLabel && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase">
                          {unitLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="w-full md:w-36 space-y-1">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        required
                        disabled={mode === "view"}
                        value={row.unitPrice || ""}
                        onChange={e => handleRowChange(index, "unitPrice", e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Đơn giá"
                        className="w-full pl-8 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-rose-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    </div>
                  </div>

                  {/* Total Line */}
                  <div className="w-28 text-right pr-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Trị giá</span>
                    <span className="text-xs font-bold text-slate-700">
                      {((row.quantity || 0) * (row.unitPrice || 0)).toLocaleString()} đ
                    </span>
                  </div>

                  {/* Delete Button */}
                  {mode !== "view" && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-all active:scale-95"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Summary & Submit */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Tổng giá trị xuất kho</span>
            <span className="text-xl font-black text-rose-600 tracking-tight">
              {calculateTotal().toLocaleString()} đ
            </span>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 md:flex-none px-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
            >
              {mode === "view" ? "Đóng" : "Hủy bỏ"}
            </button>
            {mode !== "view" && (
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 md:flex-none px-8 py-4 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {submitting ? "Đang xử lý..." : mode === "edit" ? "Cập nhật phiếu" : "Lưu phiếu xuất"}
              </button>
            )}
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
