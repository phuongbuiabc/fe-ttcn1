"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PigFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  editingPig: any | null;
  formData: any;
  setFormData: (data: any) => void;
}

export function PigFormModal({
  isOpen,
  onClose,
  onSave,
  editingPig,
  formData,
  setFormData
}: PigFormModalProps) {
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
              {editingPig ? "Cập nhật thông tin Heo" : "Thêm cá thể mới"}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
              <X size={24} className="text-slate-400" />
            </button>
          </div>
          <form onSubmit={onSave} className="p-10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số tai / ID</label>
                <input 
                  type="text" required 
                  value={formData.id} 
                  onChange={(e) => setFormData({...formData, id: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Loại lợn</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" 
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>Lợn nái</option>
                  <option>Lợn nọc</option>
                  <option>Lợn con</option>
                  <option>Lợn vỗ béo</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Giống</label>
                <input 
                  type="text" required 
                  value={formData.breed} 
                  onChange={(e) => setFormData({...formData, breed: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Chuồng</label>
                <input 
                  type="text" required 
                  value={formData.pen} 
                  onChange={(e) => setFormData({...formData, pen: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cân nặng (kg)</label>
                <input 
                  type="number" required 
                  value={formData.weight} 
                  onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Trạng thái</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option>Bình thường</option>
                  <option>Cảnh báo Sức khỏe</option>
                  <option>Cần theo dõi</option>
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
                Lưu thông tin cá thể
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

