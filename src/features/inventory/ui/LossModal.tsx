"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LossModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  supply: any | null;
  lossForm: any;
  setLossForm: (data: any) => void;
}

export function LossModal({ isOpen, onClose, onSave, supply, lossForm, setLossForm }: LossModalProps) {
  if (!isOpen || !supply) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }} 
          className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl p-10 border-t-8 border-rose-500"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase leading-none">GHI NHẬN HAO HỤT</h2>
              <p className="text-[10px] text-rose-500 font-bold mt-2 uppercase tracking-widest">Vật tư: {supply.supply_name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X className="text-slate-400" /></button>
          </div>
          <form onSubmit={onSave} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Mã hao hụt</label>
                <input type="text" readOnly value={lossForm.loss_id} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Ngày ghi nhận</label>
                <input type="date" value={lossForm.date} onChange={e => setLossForm({ ...lossForm, date: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500/20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Mã NV thực hiện</label>
                <input type="text" required value={lossForm.employee_id} onChange={e => setLossForm({ ...lossForm, employee_id: e.target.value })} placeholder="NV01" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-rose-500/20 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Số lượng hao hụt</label>
                <input type="number" max={supply.quantity} required value={lossForm.quantity} onChange={e => setLossForm({ ...lossForm, quantity: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-rose-500/20 outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Lý do chính</label>
              <select value={lossForm.reason} onChange={e => setLossForm({ ...lossForm, reason: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none">
                <option>Hỏng hóc</option>
                <option>Hết hạn</option>
                <option>Mất mát</option>
                <option>Khác</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Ghi chú chi tiết</label>
              <textarea value={lossForm.note} onChange={e => setLossForm({ ...lossForm, note: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold resize-none outline-none" rows={2} />
            </div>
            <button type="submit" className="w-full py-4 bg-rose-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-rose-900/20 mt-4 active:scale-95 transition-all uppercase tracking-[0.2em]">Xác nhận ghi hao hụt</button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
