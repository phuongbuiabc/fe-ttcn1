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
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mã vật tư</label>
              <input 
                type="text" required 
                value={supplyForm.supply_id} 
                onChange={e => setSupplyForm({ ...supplyForm, supply_id: e.target.value })} 
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Loại vật tư</label>
              <select 
                value={supplyForm.supply_type} 
                onChange={e => setSupplyForm({ ...supplyForm, supply_type: e.target.value })} 
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option>Thức ăn</option>
                <option>Thuốc thú y</option>
                <option>Dụng cụ</option>
              </select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tên vật tư</label>
              <input 
                type="text" required 
                value={supplyForm.supply_name} 
                onChange={e => setSupplyForm({ ...supplyForm, supply_name: e.target.value })} 
                placeholder="Tên sản phẩm..." 
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Số lượng</label>
              <input 
                type="number" required 
                value={supplyForm.quantity} 
                onChange={e => setSupplyForm({ ...supplyForm, quantity: parseInt(e.target.value) })} 
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Đơn vị</label>
              <input 
                type="text" required 
                value={supplyForm.unit} 
                onChange={e => setSupplyForm({ ...supplyForm, unit: e.target.value })} 
                placeholder="kg, gói, túi..." 
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" 
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mô tả</label>
              <textarea 
                rows={3} 
                value={supplyForm.description} 
                onChange={e => setSupplyForm({ ...supplyForm, description: e.target.value })} 
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none" 
              />
            </div>
            <div className="col-span-2 flex gap-4 mt-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-emerald-900/20"
              >
                Lưu vật tư
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
