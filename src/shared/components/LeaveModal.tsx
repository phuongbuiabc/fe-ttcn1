"use client";

import React from "react";
import { X, Calendar, Clock, User, FileText, Save, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: any;
}

export function LeaveModal({ isOpen, onClose, request }: LeaveModalProps) {
  if (!isOpen) return null;

  const isDetail = !!request;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
        >
          <div className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-manrope">
                  {isDetail ? "Chi tiết Đơn nghỉ phép" : "Tạo Đơn nghỉ phép mới"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {isDetail ? `Mã đơn: ${request.id}` : "Điền đầy đủ thông tin để gửi yêu cầu nghỉ phép lên hệ thống."}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {isDetail && (
              <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] flex items-center gap-6 border border-slate-100">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-sm">
                  <Image src={request.avatar} alt={request.name} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{request.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{request.role}</p>
                  <div className={cn(
                    "mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                    request.status === "Chờ duyệt" ? "bg-amber-100 text-amber-700" :
                    request.status === "Đã duyệt" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  )}>
                    {request.status}
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              {!isDetail && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nhân viên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none font-medium"
                    >
                      <option value="">Chọn nhân viên...</option>
                      <option>Lê Hoàng Nam</option>
                      <option>Nguyễn Thị Mai</option>
                      <option>Phạm Văn Đức</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Từ ngày</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date" 
                      readOnly={isDetail}
                      defaultValue={isDetail ? request.date.split('/').reverse().join('-') : ""}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Đến ngày</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date" 
                      readOnly={isDetail}
                      defaultValue={isDetail && !request.endDate.includes('(') ? request.endDate.split('/').reverse().join('-') : ""}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Lý do nghỉ phép</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea 
                    readOnly={isDetail}
                    defaultValue={isDetail ? request.reason : ""}
                    placeholder="Nhập lý do chi tiết..." 
                    rows={3}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none font-medium"
                  />
                </div>
              </div>

              {isDetail && request.status === "Chờ duyệt" ? (
                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Từ chối
                  </button>
                  <button 
                    type="button"
                    className="flex-[2] py-4 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Duyệt đơn
                  </button>
                </div>
              ) : !isDetail ? (
                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Gửi yêu cầu
                  </button>
                </div>
              ) : (
                <div className="pt-6">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="w-full py-4 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
