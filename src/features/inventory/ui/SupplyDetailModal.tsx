"use client";

import React from "react";
import { X, Package } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";

interface SupplyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  supply: any | null;
  onEdit: (supply: any) => void;
}

export function SupplyDetailModal({ isOpen, onClose, supply, onEdit }: SupplyDetailModalProps) {
  if (!isOpen || !supply) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }} 
          className="bg-white rounded-[1.75rem] w-full max-w-xl shadow-2xl overflow-hidden p-10"
        >
          <div className="flex justify-between items-center mb-10">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center">
              <Package size={32} />
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X className="text-slate-400" /></button>
          </div>

          <div className="space-y-8">
            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                Chi tiết vật tư • {supply.supply_id}
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">{supply.supply_name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-50">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Loại vật tư</p>
                <p className="text-sm font-bold text-slate-700">{supply.supply_type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Số lượng hiện tại</p>
                <p className={cn("text-xl font-black leading-none mt-1", supply.quantity < 10 ? "text-rose-500" : "text-emerald-600")}>
                  {supply.quantity} {supply.unit}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Mô tả sản phẩm</p>
              <p className="text-sm font-medium text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {supply.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => onEdit(supply)}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
              >
                Chỉnh sửa thông tin
              </button>
              <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Đóng</button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

