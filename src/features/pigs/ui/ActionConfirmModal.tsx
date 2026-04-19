"use client";

import React from "react";
import { AlertTriangle, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";

interface ActionConfirmModalProps {
  isOpen: boolean;
  type: "delete-pig" | "delete-litter" | "approve-sale" | "confirm-disposal";
  targetName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ActionConfirmModal({
  isOpen,
  type,
  targetName,
  onClose,
  onConfirm
}: ActionConfirmModalProps) {
  if (!isOpen) return null;

  const isPositive = type === "approve-sale";
  
  const getTitle = () => {
    switch(type) {
      case "delete-pig": return "Xác nhận xóa heo?";
      case "delete-litter": return "Xác nhận xóa đàn?";
      case "approve-sale": return "Duyệt đơn bán mới?";
      case "confirm-disposal": return "Xác nhận tiêu hủy?";
    }
  };

  const getDescription = () => {
    switch(type) {
      case "delete-pig": return `Bạn có chắc chắn muốn xóa cá thể "${targetName}"?`;
      case "delete-litter": return `Hành động này sẽ xóa toàn bộ dữ liệu của đàn "${targetName}".`;
      case "approve-sale": return "Duyệt toàn bộ danh sách đề xuất bán hiện tại?";
      case "confirm-disposal": return "Xác nhận tiêu hủy các cá thể trong danh sách đề xuất?";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }} 
          className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-10 text-center"
        >
          <div className={cn(
            "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6",
            isPositive ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
          )}>
            {type === "approve-sale" ? <ShoppingCart size={40} /> : type.includes("delete") ? <Trash2 size={40} /> : <AlertTriangle size={40} />}
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
            {getTitle()}
          </h3>
          
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            {getDescription()}
            <br /><span className="font-bold text-slate-900">Hành động này không thể hoàn tác.</span>
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest"
            >
              Hủy bỏ
            </button>
            <button 
              onClick={onConfirm}
              className={cn(
                "flex-1 py-4 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all",
                isPositive ? "bg-[#00a67d] shadow-emerald-900/10" : "bg-rose-500 shadow-rose-900/20"
              )}
            >
              Xác nhận
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
