"use client";

import React from 'react';
import { X, AlertTriangle, Calendar, User, Tag, Hash, FileText, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupplyLoss } from '../../model/inventory.model';

interface LossDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  loss: SupplyLoss | null;
}

export function LossDetailModal({ isOpen, onClose, loss }: LossDetailModalProps) {
  if (!loss) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100/50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-rose-500 p-8 text-white relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Chi tiết phiếu hao hụt</p>
                  <h2 className="text-2xl font-black uppercase tracking-tight">#{loss.loss_id || 'N/A'}</h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Package size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Vật tư</span>
                  </div>
                  <p className="text-sm font-black text-slate-800">{loss.supply_id}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Hash size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Số lượng mất</span>
                  </div>
                  <p className="text-lg font-black text-rose-500">-{loss.quantity}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ngày ghi nhận</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{loss.date}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <User size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Người thực hiện</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 uppercase">{loss.employee_id}</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Tag size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Lý do chính</span>
                </div>
                <p className="text-sm font-bold text-slate-700">{loss.reason}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <FileText size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Ghi chú chi tiết</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60 max-h-40 overflow-y-auto no-scrollbar">
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    {loss.note || "Không có ghi chú thêm cho trường hợp này."}
                  </p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all mt-4 duration-200"
              >
                Đóng thông tin
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
