"use client";

import React from "react";
import { X, Activity, MessageSquare, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Supply, AdjustmentFormInput } from "../../model/inventory.model";

interface AdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  supply: Supply | null;
  adjForm: AdjustmentFormInput;
  setAdjForm: React.Dispatch<React.SetStateAction<AdjustmentFormInput>>;
}

export function AdjustmentModal({ isOpen, onClose, onSave, supply, adjForm, setAdjForm }: AdjustmentModalProps) {
  if (!isOpen || !supply) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 15 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 15 }} 
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100/50 overflow-hidden p-10 relative"
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
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight font-headline">
                Điều chỉnh tồn kho
              </h2>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-0.5">
                Vật tư: {supply.name} (Tồn kho: {supply.quantity} {supply.unit})
              </p>
            </div>
          </div>

          <form onSubmit={onSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Số lượng thay đổi (+ tăng / - giảm)
              </label>
              <div className="relative">
                <Activity className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="number" required 
                  value={adjForm.quantity_change} 
                  onChange={e => setAdjForm({ ...adjForm, quantity_change: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })} 
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-center text-lg font-black text-slate-800 placeholder:text-slate-400 focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" 
                  placeholder="Nhập số ví dụ: +15, -10..." 
                />
              </div>
              <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-tight">
                * Số dương: Tăng số lượng trong kho | Số âm: Giảm số lượng trong kho
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lý do điều chỉnh</label>
              <div className="relative">
                <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" required 
                  value={adjForm.reason} 
                  onChange={e => setAdjForm({ ...adjForm, reason: e.target.value })} 
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none placeholder:text-slate-400" 
                  placeholder="Ví dụ: Kiểm kho phát hiện dư, Bù trừ hao hụt..." 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú chi tiết</label>
              <div className="relative">
                <FileText className="absolute left-5 top-4 text-slate-400" size={16} />
                <textarea 
                  value={adjForm.note} 
                  onChange={e => setAdjForm({ ...adjForm, note: e.target.value })} 
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold resize-none outline-none focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all" 
                  rows={2} 
                  placeholder="Mô tả hoàn cảnh điều chỉnh..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 duration-200"
              >
                Huỷ bỏ
              </button>
              <button 
                type="submit"
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 active:scale-95 transition-all duration-200"
              >
                Cập nhật kho
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
