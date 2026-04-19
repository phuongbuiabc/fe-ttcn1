"use client";

import React from "react";
import { X, Baby } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FarrowingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FarrowingFormModal({ isOpen, onClose }: FarrowingFormModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }} 
          className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col border-t-8 border-emerald-500"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Baby size={24} /></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Ghi nhận Lứa đẻ</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={24} className="text-slate-300" /></button>
          </div>
          <form className="p-10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ngày đẻ chính thức</label>
                <input type="date" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số con sơ sinh</label>
                <input type="number" placeholder="0" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số con chết non</label>
                <input type="number" placeholder="0" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-rose-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cân nặng trung bình (kg)</label>
                <input type="number" step="0.1" placeholder="1.2" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" />
              </div>
            </div>
            <div className="pt-6 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest">Hủy bỏ</button>
              <button type="button" onClick={onClose} className="flex-[2] py-4 bg-[#00a67d] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-900/10 active:scale-95 transition-all">Hoàn tất ghi nhận</button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
