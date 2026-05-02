"use client";

import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PregnancyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PregnancyFormModal({ isOpen, onClose }: PregnancyFormModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[1.75rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col border-t-8 border-blue-500"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><CheckCircle2 size={24} /></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Kiểm tra Thai kỳ</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={24} className="text-slate-300" /></button>
          </div>
          <form className="p-10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kết quả kiểm tra</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="py-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-[#00a67d] font-black text-sm uppercase">Đã đậu thai</button>
                  <button type="button" className="py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-400 font-black text-sm uppercase">Phối lại</button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ngày kiểm tra</label>
                <input type="date" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dự kiến ngày đẻ</label>
                <input type="date" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-blue-600" />
              </div>
            </div>
            <div className="pt-6 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest">Đóng</button>
              <button type="button" onClick={onClose} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 active:scale-95 transition-all">Lưu kết quả khám</button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

