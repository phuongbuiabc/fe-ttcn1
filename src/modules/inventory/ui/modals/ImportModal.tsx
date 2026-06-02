"use client";

import React, { useState, useEffect } from "react";
import { Calendar, User, Truck, FileText, Plus, Trash2, DollarSign, Package } from "lucide-react";
import { BaseModal } from "@/shared/components/ui/BaseModal";
import { CustomSelect } from "@/shared/components/ui/CustomSelect";
import { staffService } from "@/modules/staff/api/staff.service";
import { supplierService } from "@/modules/supplier/api/supplier.service";
import { inventoryService } from "../../api/inventory.service";
import { Supply } from "../../model/inventory.model";
import { Supplier } from "@/modules/supplier/model/supplier.model";
import { Employee } from "@/shared/types";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "create" | "edit" | "view";
  selectedId?: string;
}

interface ImportDetailItem {
  materialId: string;
  quantity: number;
  unitPrice: number;
}

export function ImportModal({ isOpen, onClose, onSuccess, mode = "create", selectedId }: ImportModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [importDate, setImportDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [supplierId, setSupplierId] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [details, setDetails] = useState<ImportDetailItem[]>([
    { materialId: "", quantity: 1, unitPrice: 0 }
  ]);

  // Load options data
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoadingOptions(true);
      try {
        const [empRes, supRes, matRes] = await Promise.all([
          staffService.getEmployees(),
          supplierService.getSuppliers(),
          inventoryService.getSupplies()
        ]);

        if (empRes.success) setEmployees(empRes.data || []);
        if (supRes.success) setSuppliers(supRes.data || []);
        if (matRes.success) setSupplies(matRes.data || []);

        if ((mode === "edit" || mode === "view") && selectedId) {
          const res = await inventoryService.getImportById(selectedId);
          if (res.success && res.data) {
            setImportDate(res.data.importDate);
            setEmployeeId(res.data.employeeId);
            setSupplierId(res.data.supplierId);
            setDetails(res.data.details.map(d => ({
              materialId: d.materialId,
              quantity: d.quantity,
              unitPrice: d.unitPrice
            })));
          } else {
            alert(res.message || "Không thể tải chi tiết phiếu nhập");
          }
        }
      } catch (err) {
        console.error("Error loading import form options:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadData();

    if (mode === "create") {
      setImportDate(new Date().toISOString().split("T")[0]);
      setSupplierId("");
      setEmployeeId("");
      setNote("");
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

  const handleRowChange = (index: number, field: keyof ImportDetailItem, value: any) => {
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
    if (!supplierId) return alert("Vui lòng chọn nhà cung cấp");

    const invalidDetails = details.some(d => !d.materialId || d.quantity <= 0);
    if (invalidDetails) {
      return alert("Vui lòng chọn đầy đủ vật tư và số lượng lớn hơn 0");
    }

    setSubmitting(true);
    try {
      const payload = {
        importDate,
        employeeId,
        supplierId,
        totalAmount: calculateTotal(),
        note: note || "Nhập kho vật tư nông trại",
        details: details.map(d => ({
          materialId: d.materialId,
          quantity: Number(d.quantity),
          unitPrice: Number(d.unitPrice),
          lineTotal: Number(d.quantity) * Number(d.unitPrice)
        }))
      };

      const res = mode === "edit" && selectedId
        ? await inventoryService.updateImport(selectedId, payload)
        : await inventoryService.importMaterials(payload);

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        alert(res.message || "Đã xảy ra lỗi khi lưu phiếu nhập");
      }
    } catch (err) {
      alert("Lỗi kết nối khi gửi yêu cầu nhập kho");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "view" ? "Chi Tiết Phiếu Nhập" : mode === "edit" ? "Chỉnh Sửa Phiếu Nhập" : "Tạo Phiếu Nhập Kho"}
      subtitle={mode === "view" ? "Xem thông tin chi tiết phiếu nhập vật tư" : mode === "edit" ? "Chỉnh sửa thông tin và danh sách nhập kho" : "Nhập thêm vật tư chăn nuôi (Thức ăn, Vaccine, Thuốc)"}
      className="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ngày nhập kho</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="date"
                required
                disabled={mode === "view"}
                value={importDate}
                onChange={e => setImportDate(e.target.value)}
                className="w-full pl-12 pr-5 py-4 bg-[#f8fafc] border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
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

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nhà cung cấp</label>
            <CustomSelect
              value={supplierId}
              disabled={mode === "view"}
              onChange={val => setSupplierId(val)}
              options={suppliers.map(sup => ({
                value: sup.id,
                label: sup.name
              }))}
              icon={Truck}
              placeholder="Chọn nhà cung cấp"
            />
          </div>
        </div>

        {/* Note Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ghi chú phiếu nhập</label>
          <div className="relative">
            <FileText className="absolute left-5 top-5 text-slate-400" size={16} />
            <textarea
              value={note}
              disabled={mode === "view"}
              onChange={e => setNote(e.target.value)}
              placeholder="Nhập lý do nhập hàng hoặc ghi chú thêm..."
              rows={2}
              className="w-full pl-12 pr-5 py-4 bg-[#f8fafc] border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 outline-none placeholder:text-slate-400 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Materials Table List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">Danh sách vật tư nhập kho</span>
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
                        label: `${sup.name} (${sup.materialType === "FEED" ? "Thức ăn" : sup.materialType === "VACCINE" ? "Vaccine" : "Thuốc"})`
                      }))}
                      placeholder="Chọn vật tư..."
                      icon={Package}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="w-full md:w-32 space-y-1">
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
                        className="w-full pl-4 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      {unitLabel && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">
                          {unitLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="w-full md:w-40 space-y-1">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        required
                        disabled={mode === "view"}
                        value={row.unitPrice || ""}
                        onChange={e => handleRowChange(index, "unitPrice", e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Đơn giá"
                        className="w-full pl-8 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    </div>
                  </div>

                  {/* Total Line */}
                  <div className="w-32 text-right pr-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Thành tiền</span>
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Tổng tiền hóa đơn</span>
            <span className="text-xl font-black text-emerald-600 tracking-tight">
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
                className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {submitting ? "Đang xử lý..." : mode === "edit" ? "Cập nhật phiếu" : "Lưu phiếu nhập"}
              </button>
            )}
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
