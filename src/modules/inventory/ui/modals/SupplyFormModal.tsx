"use client";

import React from "react";
import { X, Package, Tag, Scale, Layers, FileText, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Supply, SupplyFormInput } from "../../model/inventory.model";

interface SupplyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  editingSupply: Supply | null;
  supplyForm: SupplyFormInput;
  setSupplyForm: React.Dispatch<React.SetStateAction<SupplyFormInput>>;
}

export function SupplyFormModal({
  isOpen,
  onClose,
  onSave,
  editingSupply,
  supplyForm,
  setSupplyForm
}: SupplyFormModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100/50 overflow-hidden p-10 relative"
        >
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight font-headline">
                {editingSupply ? "Cập nhật vật tư" : "Nhập kho vật tư"}
              </h2>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-0.5">
                {editingSupply ? "Điều chỉnh thông số kho hàng" : "Đăng ký nhập mới hàng hóa"}
              </p>
            </div>
          </div>

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
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Loại vật tư</label>
              <div className="relative">
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  value={supplyForm.materialType}
                  onChange={e => {
                    const val = e.target.value;
                    let unit = supplyForm.unit;
                    if (val === "FEED") unit = "Bao";
                    else if (val === "VACCINE") unit = "Liều";
                    else if (val === "MEDICINE") unit = "Chai";
                    setSupplyForm({ ...supplyForm, materialType: val, unit });
                  }}
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 outline-none appearance-none cursor-pointer"
                >
                  <option value="FEED">Thức ăn</option>
                  <option value="VACCINE">Vaccine</option>
                  <option value="MEDICINE">Thuốc thú y</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Đơn vị tính</label>
              <div className="relative">
                <Scale className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  required
                  value={supplyForm.unit}
                  onChange={e => setSupplyForm({ ...supplyForm, unit: e.target.value })}
                  className="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 outline-none appearance-none cursor-pointer"
                >
                  <option value="Kg">Kilogram (Kg)</option>
                  <option value="Bao">Bao / Túi</option>
                  <option value="Lít">Lít (L)</option>
                  <option value="Chai">Chai / Lọ</option>
                  <option value="Viên">Viên</option>
                  <option value="Liều">Liều</option>
                  <option value="Hộp">Hộp / Thùng</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số lượng tồn ban đầu</label>
              <div className="relative">
                <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="number" required min="0"
                  value={supplyForm.quantity}
                  onChange={e => setSupplyForm({ ...supplyForm, quantity: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 outline-none placeholder:text-slate-400"
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
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300 outline-none resize-none placeholder:text-slate-400"
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
                {editingSupply ? "Cập nhật dữ liệu" : "Xác nhận nhập kho"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
