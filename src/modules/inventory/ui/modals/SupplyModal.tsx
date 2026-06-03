"use client";

import React from "react";
import { Package, Tag, Scale, Layers, FileText } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { Supply, SupplyFormInput } from "../../model/inventory.model";
import { BaseModal } from "@/shared/components/ui/BaseModal";
import { CustomSelect } from "@/shared/components/ui/CustomSelect";

type ModalMode = "create" | "edit" | "view";

interface SupplyModalProps {
  isOpen: boolean;
  mode: ModalMode;
  setMode: (mode: ModalMode) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  supply: Supply | null;
  supplyForm: SupplyFormInput;
  setSupplyForm: React.Dispatch<React.SetStateAction<SupplyFormInput>>;
}

const materialTypeLabels: Record<string, string> = {
  FEED: "Thức ăn",
  VACCINE: "Vaccine",
  MEDICINE: "Thuốc thú y",
};

export function SupplyModal({
  isOpen,
  mode,
  setMode,
  onClose,
  onSave,
  supply,
  supplyForm,
  setSupplyForm
}: SupplyModalProps) {
  
  // Decide Modal Titles based on current active mode
  const getModalTitle = () => {
    if (mode === "create") return "Nhập kho vật tư";
    if (mode === "edit") return "Cập nhật vật tư";
    return "Thông tin sản phẩm";
  };

  const getModalSubtitle = () => {
    if (mode === "create") return "Đăng ký nhập mới hàng hóa";
    if (mode === "edit") return "Điều chỉnh thông số kho hàng";
    return "Chi tiết thuộc tính tồn kho";
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      subtitle={getModalSubtitle()}
      className={mode === "view" ? "max-w-xl" : "max-w-2xl"}
    >
      {/* -------------------- VIEW MODE -------------------- */}
      {mode === "view" && supply && (
        <div className="space-y-6">
          {/* Header Icon */}
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-sm mb-2">
            <Package size={32} />
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-900 leading-tight font-headline">{supply.name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-100/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Tag size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Phân loại</span>
              </div>
              <p className="text-sm font-bold text-slate-700 mt-1">
                {materialTypeLabels[supply.materialType] || supply.materialType}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Layers size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Tồn kho khả dụng</span>
              </div>
              <p className={cn("text-xl font-black leading-none mt-1", supply.quantity < 10 ? "text-rose-500" : "text-emerald-600")}> 
                {supply.quantity.toLocaleString()} <span className="text-xs font-black uppercase text-slate-400">{supply.unit}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
              <FileText size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Mô tả sản phẩm</span>
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60 max-h-40 overflow-y-auto no-scrollbar italic">
              {supply.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose} 
              className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* -------------------- CREATE / EDIT FORM MODES -------------------- */}
      {(mode === "create" || mode === "edit") && (
        <form onSubmit={onSave} className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tên vật tư / Sản phẩm</label>
            <div className="relative">
              <Package className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text" required
                value={supplyForm.name}
                onChange={e => setSupplyForm({ ...supplyForm, name: e.target.value })}
                placeholder="Ví dụ: Thức ăn hỗn hợp heo thịt, Vaccine tai xanh..."
                className="w-full pl-12 pr-5 py-4 bg-[#f8fafc] border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Loại vật tư</label>
            <CustomSelect
              value={supplyForm.materialType}
              options={[
                { value: "FEED", label: "Thức ăn" },
                { value: "VACCINE", label: "Vaccine" },
                { value: "MEDICINE", label: "Thuốc thú y" },
              ]}
              icon={Tag}
              onChange={val => {
                const unit = val === "FEED" ? "Kg" : val === "VACCINE" ? "Liều" : "Chai";
                setSupplyForm({ ...supplyForm, materialType: val, unit });
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Đơn vị tính (Mặc định)</label>
            <div className="relative">
              <Scale className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                disabled
                value={
                  supplyForm.materialType === "FEED" ? "Kilogram (Kg)" :
                  supplyForm.materialType === "VACCINE" ? "Liều" : "Chai"
                }
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số lượng tồn kho</label>
            <div className="relative">
              <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="number" required min="0"
                value={supplyForm.quantity}
                onChange={e => setSupplyForm({ ...supplyForm, quantity: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                className="w-full pl-12 pr-5 py-4 bg-[#f8fafc] border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ghi chú bổ sung</label>
            <div className="relative">
              <FileText className="absolute left-5 top-4 text-slate-400" size={16} />
              <textarea
                rows={3}
                value={supplyForm.description}
                onChange={e => setSupplyForm({ ...supplyForm, description: e.target.value })}
                className="w-full pl-12 pr-5 py-4 bg-[#f8fafc] border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 outline-none resize-none placeholder:text-slate-400"
                placeholder="Thông tin nguồn gốc, lô sản xuất, cách bảo quản..."
              />
            </div>
          </div>

          <div className="col-span-2 flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 duration-200"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all duration-200"
            >
              {mode === "edit" ? "Cập nhật dữ liệu" : "Xác nhận nhập kho"}
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
}
