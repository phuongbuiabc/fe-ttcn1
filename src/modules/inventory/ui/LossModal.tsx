"use client";

import React from "react";
import { X, ChevronDown, User, Calendar, AlertTriangle, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";

interface LossModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  supply: any | null;
  lossForm: any;
  setLossForm: (data: any) => void;
  employees?: any[];
}

export function LossModal({ isOpen, onClose, onSave, supply, lossForm, setLossForm, employees = [] }: LossModalProps) {
  const [isEmpOpen, setIsEmpOpen] = React.useState(false);
  const [isReasonOpen, setIsReasonOpen] = React.useState(false);

  if (!isOpen || !supply) return null;

  const handleSelectEmployee = (id: string) => {
    setLossForm({ ...lossForm, employee_id: id });
    setIsEmpOpen(false);
  };

  const handleSelectReason = (reason: string) => {
    setLossForm({ ...lossForm, reason: reason });
    setIsReasonOpen(false);
  };

  const selectedEmployee = employees.find(e => e.id === lossForm.employee_id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }} 
          className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-visible border border-slate-100"
        >
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white relative">
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Ghi nhận hao hụt</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Vật tư:</span>
              <span className="text-sm font-bold opacity-80">{supply.supply_name || supply.name}</span>
            </div>
          </div>

          <form onSubmit={onSave} className="p-10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã phiếu</label>
                <input
                  type="text" readOnly value={lossForm.loss_id} 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày ghi nhận</label>
                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="date" value={lossForm.date} 
                    onChange={e => setLossForm({ ...lossForm, date: e.target.value })}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>
            </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nhân viên thực hiện</label>
                  <button
                    type="button"
                    onClick={() => setIsEmpOpen(!isEmpOpen)}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold flex items-center justify-between hover:bg-slate-100/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-slate-400" />
                      <span className={selectedEmployee ? "text-slate-800" : "text-slate-400"}>
                        {selectedEmployee ? selectedEmployee.fullName : "Chọn nhân viên..."}
                      </span>
                    </div>
                    <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isEmpOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {isEmpOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[80] overflow-hidden p-2"
                      >
                        <div className="max-h-48 overflow-y-auto no-scrollbar">
                          {employees.map((emp) => (
                            <button
                              key={emp.id} type="button" onClick={() => handleSelectEmployee(emp.id)}
                              className="w-full p-3 rounded-xl hover:bg-emerald-50 flex items-center gap-3 transition-colors text-left group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-emerald-500 transition-colors">
                                <User size={14} />
                              </div>
                              <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-600">{emp.fullName}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số lượng mất</label>
                  <div className="relative">
                    <AlertTriangle className={cn("absolute left-5 top-1/2 -translate-y-1/2", lossForm.quantity > supply.quantity ? "text-rose-600" : "text-rose-400")} size={16} />
                    <input
                      type="number" 
                      required min="1"
                      value={lossForm.quantity} 
                      onChange={e => setLossForm({ ...lossForm, quantity: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                      className={cn(
                        "w-full pl-12 pr-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold transition-all outline-none",
                        lossForm.quantity > supply.quantity ? "border-rose-500 bg-rose-50 text-rose-600" : "border-transparent focus:border-rose-500/20 focus:bg-white text-rose-600"
                      )}
                    />
                  </div>
                  {lossForm.quantity > supply.quantity && (
                    <p className="text-[10px] font-bold text-rose-500 ml-1">Vượt quá tồn kho ({supply.quantity} {supply.unit})</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lý do chính</label>
                <button
                  type="button"
                  onClick={() => setIsReasonOpen(!isReasonOpen)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold flex items-center justify-between hover:bg-slate-100/50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Tag size={16} className="text-slate-400" />
                    <span className="text-slate-800">{lossForm.reason}</span>
                  </div>
                  <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isReasonOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isReasonOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[80] overflow-hidden p-2"
                    >
                      {["Hỏng hóc", "Hết hạn sử dụng", "Mất mát / Thất thoát", "Khác"].map((r) => (
                        <button
                          key={r} type="button" onClick={() => handleSelectReason(r)}
                          className="w-full p-3 rounded-xl hover:bg-rose-50 flex items-center gap-3 transition-colors text-left group"
                        >
                          <Tag size={14} className="text-slate-300 group-hover:text-rose-400 transition-colors" />
                          <span className="text-xs font-bold text-slate-700 group-hover:text-rose-600">{r}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú chi tiết</label>
                <textarea
                  value={lossForm.note} onChange={e => setLossForm({ ...lossForm, note: e.target.value })}
                  rows={3} placeholder="Mô tả cụ thể trường hợp hao hụt..."
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-medium focus:border-emerald-500/20 focus:bg-white transition-all outline-none resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors">
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={lossForm.quantity > supply.quantity || lossForm.quantity <= 0 || !lossForm.employee_id}
                  className={cn(
                    "flex-[2] py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all",
                    (lossForm.quantity > supply.quantity || lossForm.quantity <= 0 || !lossForm.employee_id)
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-rose-500 text-white shadow-rose-500/20 active:scale-95"
                  )}
                >
                  Xác nhận ghi hao hụt
                </button>
              </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
