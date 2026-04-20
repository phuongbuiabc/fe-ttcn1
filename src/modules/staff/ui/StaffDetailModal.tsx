"use client";

import React from "react";
import { X, GraduationCap, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StaffDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: any | null;
}

export function StaffDetailModal({ isOpen, onClose, staff }: StaffDetailModalProps) {
  if (!isOpen || !staff) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0" 
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }} 
          className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden shadow-emerald-900/5"
        >
          <div className="h-16 bg-gradient-to-r from-[#006c49] to-[#00a67d]">
            <button 
              onClick={onClose} 
              className="absolute right-4 top-4 p-1.5 text-white/50 hover:text-white transition-all bg-white/10 rounded-lg"
            >
              <X size={14} />
            </button>
          </div>
          <div className="px-6 pb-6">
            <div className="relative -mt-10 mb-3">
              <div className="w-20 h-20 bg-white rounded-xl p-1 shadow-xl">
                <div className="w-full h-full bg-[#e2f7f1] rounded-lg flex items-center justify-center text-2xl font-black text-[#00a67d]">
                  {staff.full_name.charAt(0)}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-800 tracking-tight">{staff.full_name}</h2>
                <p className="text-[9px] font-bold text-[#00a67d] uppercase tracking-widest mt-0.5">{staff.position}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Mã nhân viên</p>
                <p className="text-base font-black text-slate-900 leading-none mt-1">#{staff.employee_id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 py-4 border-y border-slate-50 mb-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Giới tính</p>
                <p className="text-xs font-bold text-slate-700">{staff.gender}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Ngày sinh</p>
                <p className="text-xs font-bold text-slate-700">{staff.birth_date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Số điện thoại</p>
                <p className="text-xs font-bold text-slate-700">{staff.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Email liên hệ</p>
                <p className="text-xs font-bold text-slate-700">{staff.email}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Trình độ chuyên môn</p>
                <div className="flex items-center gap-2 p-2.5 bg-[#fbfcfd] rounded-xl border border-slate-100 text-xs font-bold text-slate-700">
                  <GraduationCap size={14} className="text-[#00a67d]" /> {staff.qualification}
                </div>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Địa chỉ đăng ký</p>
                <div className="flex items-start gap-2 text-xs font-bold text-slate-700">
                  <MapPin size={14} className="text-rose-500 mt-0.5" />
                  <span>{staff.address}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.25em] shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all"
            >
              Đóng hồ sơ nhân viên
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

