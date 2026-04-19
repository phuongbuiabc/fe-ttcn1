"use client";

import React from "react";
import { X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MatingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MatingFormModal({ isOpen, onClose }: MatingFormModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }} 
          className="bg-white rounded-[1.75rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center"><Heart size={24} /></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Phối giống mới</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={24} className="text-slate-300" /></button>
          </div>
          <form className="p-10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mã lợn nái</label>
                <input type="text" placeholder="Nhập ID nái..." className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/10" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mã lợn đực (Siêu tinh)</label>
                <input type="text" placeholder="Nhập ID đực..." className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ngày phối giống</label>
                <input type="date" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Người thực hiện</label>
                <input type="text" placeholder="Tên kỹ thuật viên..." className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" />
              </div>
            </div>
            <div className="pt-6 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest">Hủy</button>
              <button type="button" onClick={onClose} className="flex-[2] py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-900/10 active:scale-95 transition-all">Xác nhận phối giống</button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

