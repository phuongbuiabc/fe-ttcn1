"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LitterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  editingLitter: any | null;
  litterFormData: any;
  setLitterFormData: (data: any) => void;
}

export function LitterFormModal({
  isOpen,
  onClose,
  onSave,
  editingLitter,
  litterFormData,
  setLitterFormData
}: LitterFormModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              {editingLitter ? "Sửa thông tin đàn con" : "Đăng ký đàn mới"}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
              <X size={24} className="text-slate-300" />
            </button>
          </div>
          <form onSubmit={onSave} className="p-10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mã đàn</label>
                <input 
                  type="text" required 
                  value={litterFormData.id} 
                  onChange={(e) => setLitterFormData({...litterFormData, id: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mã lợn mẹ</label>
                <input
                  type="text" required
                  value={litterFormData.motherId}
                  onChange={(e) => setLitterFormData({...litterFormData, motherId: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold opacity-70" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số lượng con</label>
                <input 
                  type="number" required
                  value={litterFormData.count}
                  onChange={(e) => setLitterFormData({...litterFormData, count: parseInt(e.target.value) || 0})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Chuồng nuôi</label>
                <input 
                  type="text" required
                  value={litterFormData.pen}
                  onChange={(e) => setLitterFormData({...litterFormData, pen: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Trạng thái đàn</label>
                <select
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" 
                  value={litterFormData.status}
                  onChange={(e) => setLitterFormData({...litterFormData, status: e.target.value})}
                >
                  <option>Khỏe mạnh</option>
                  <option>Cần theo dõi</option>
                  <option>Yếu</option>
                </select>
              </div>
            </div>
            <div className="pt-6 flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-[2] py-4 bg-[#00a67d] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
              >
                Lưu thông tin đàn
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

