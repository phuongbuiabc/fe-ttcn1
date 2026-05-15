"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SupplyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  editingSupply: any | null;
  supplyForm: any;
  setSupplyForm: (data: any) => void;
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[1.75rem] w-full max-w-2xl shadow-2xl overflow-hidden p-10"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter font-headline">
              {editingSupply ? "Cập nhật vật tư" : "Nhập kho vật tư mới"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X /></button>
          </div>
          <form onSubmit={onSave} className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tên vật tư</label>
              <input
                type="text" required
                value={supplyForm.name}
                onChange={e => setSupplyForm({ ...supplyForm, name: e.target.value })}
                placeholder="Tên sản phẩm..."
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/10 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Loại vật tư</label>
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
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/10 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="FEED">Thức ăn</option>
                <option value="VACCINE">Vaccine</option>
                <option value="MEDICINE">Thuốc thú y</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Đơn vị tính</label>
              <select
                required
                value={supplyForm.unit}
                onChange={e => setSupplyForm({ ...supplyForm, unit: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/10 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="Kg">Kilogram (Kg)</option>
                <option value="Bao">Bao / Túi</option>
                <option value="Lít">Lít (L)</option>
                <option value="Chai">Chai / Lọ</option>
                <option value="Viên">Viên</option>
                <option value="Liều">Liều</option>
                <option value="Hộp">Hộp / Thùng</option>
              </select>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số lượng tồn ban đầu</label>
              <input
                type="number" required min="0"
                value={supplyForm.quantity}
                onChange={e => setSupplyForm({ ...supplyForm, quantity: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/10 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ghi chú bổ sung</label>
              <textarea
                rows={3}
                value={supplyForm.description}
                onChange={e => setSupplyForm({ ...supplyForm, description: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/10 focus:bg-white transition-all outline-none resize-none"
                placeholder="Thông tin thêm về sản phẩm..."
              />
            </div>
            <div className="col-span-2 flex gap-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
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

