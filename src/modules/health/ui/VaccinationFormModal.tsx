"use client";

import React from "react";
import { X, Pill } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VaccinationFormModalProps {
  isOpen: boolean;
  isLitter: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
}

export function VaccinationFormModal({
  isOpen,
  isLitter,
  onClose,
  onSave,
  formData,
  setFormData
}: VaccinationFormModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }} 
          className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Pill size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {isLitter ? "Tiêm phòng Đàn con" : "Tiêm phòng Lợn cá thể"}
              </h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
              <X size={24} className="text-slate-300" />
            </button>
          </div>
          <form onSubmit={onSave} className="p-10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  {isLitter ? "Mã đàn" : "Số tai / ID"}
                </label>
                <input 
                  type="text" required 
                  value={formData.id} 
                  onChange={(e) => setFormData({...formData, id: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none" 
                />
              </div>
              {isLitter && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số lượng con</label>
                  <input 
                    type="number" required 
                    value={formData.count} 
                    onChange={(e) => setFormData({...formData, count: parseInt(e.target.value) || 0})} 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên thuốc/Vaccine</label>
                <input 
                  type="text" required 
                  value={formData.vaccine} 
                  onChange={(e) => setFormData({...formData, vaccine: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                  placeholder="Ví dụ: Circo-Vac"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Liều lượng</label>
                <input 
                  type="text" required 
                  value={formData.dose} 
                  onChange={(e) => setFormData({...formData, dose: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ngày thực hiện</label>
                <input 
                  type="text" required 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nhân viên</label>
                <input 
                  type="text" required 
                  value={formData.staff} 
                  onChange={(e) => setFormData({...formData, staff: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" 
                />
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
                Ghi nhận tiêm phòng
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

