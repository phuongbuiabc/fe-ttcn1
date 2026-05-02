"use client";

import React from "react";
import { X, ArrowRightLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TransferPigModalProps {
  isOpen: boolean;
  onClose: () => void;
  barns: any[];
}

export function TransferPigModal({ isOpen, onClose, barns }: TransferPigModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[1.75rem] w-full max-w-md overflow-hidden shadow-2xl"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Điều chuyển đàn heo</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
              <X size={24} className="text-slate-300" />
            </button>
          </div>
          <div className="p-10 space-y-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Chuồng nguồn (Từ)</label>
              <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00a67d]/10 outline-none appearance-none">
                {barns.map(b => <option key={b.id}>{b.name} - {b.section}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Chuồng mục tiêu (Đến)</label>
              <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00a67d]/10 outline-none appearance-none">
                {barns.map(b => <option key={b.id}>{b.name} - {b.section}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số lượng cần chuyển</label>
              <input
                type="number"
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00a67d]/10 outline-none placeholder:text-slate-300" 
                placeholder="Nhập số lượng..."
              />
            </div>
            <button
              onClick={onClose}
              className="w-full py-5 bg-[#00a67d] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/10 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRightLeft size={18} />
              Xác nhận điều chuyển
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

