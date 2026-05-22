"use client";

import React from "react";
import { X, Package, Tag, Layers, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";
import { Supply } from "../../model/inventory.model";

interface SupplyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  supply: Supply | null;
  onEdit: (supply: Supply) => void;
}

const materialTypeLabels: Record<string, string> = {
  FEED: "Thức ăn",
  VACCINE: "Vaccine",
  MEDICINE: "Thuốc thú y",
};

export function SupplyDetailModal({ isOpen, onClose, supply, onEdit }: SupplyDetailModalProps) {
  if (!isOpen || !supply) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 15 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 15 }} 
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100/50 overflow-hidden p-10 relative"
        >
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>

          {/* Header Icon */}
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-sm mb-6">
            <Package size={32} />
          </div>

          <div className="space-y-6">
            <div>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-emerald-100/40">
                Thông tin sản phẩm
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-3 leading-tight">{supply.name}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Mã vật tư: {supply.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-100/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Tag size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Phân loại</span>
                </div>
                <p className="text-sm font-bold text-slate-700 mt-1">
                  {materialTypeLabels[supply.materialType] || supply.materialType}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Layers size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Tồn kho khả dụng</span>
                </div>
                <p className={cn("text-xl font-black leading-none mt-1", supply.quantity < 10 ? "text-rose-500" : "text-emerald-600")}> 
                  {supply.quantity.toLocaleString()} <span className="text-xs font-black uppercase text-slate-400">{supply.unit}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <FileText size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Mô tả sản phẩm</span>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60 max-h-40 overflow-y-auto no-scrollbar italic">
                {supply.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => onEdit(supply)}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-950/10 active:scale-95 transition-all duration-200"
              >
                Chỉnh sửa thông tin
              </button>
              <button 
                onClick={onClose} 
                className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
