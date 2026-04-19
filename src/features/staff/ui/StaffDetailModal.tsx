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
          className="relative w-full max-w-2xl bg-white rounded-[1.75rem] shadow-2xl overflow-hidden shadow-emerald-900/5"
        >
          <div className="h-24 bg-gradient-to-r from-[#006c49] to-[#00a67d]">
            <button 
              onClick={onClose} 
              className="absolute right-6 top-6 p-2 text-white/50 hover:text-white transition-all bg-white/10 rounded-xl"
            >
              <X size={18} />
            </button>
          </div>
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-4">
              <div className="w-24 h-24 bg-white rounded-[2rem] p-1.5 shadow-xl">
                <div className="w-full h-full bg-[#e2f7f1] rounded-[2rem] flex items-center justify-center text-3xl font-black text-[#00a67d]">
                  {staff.full_name.charAt(0)}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">{staff.full_name}</h2>
                <p className="text-[10px] font-bold text-[#00a67d] uppercase tracking-widest mt-1">{staff.position}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Mã nhân viên</p>
                <p className="text-lg font-black text-slate-900 leading-none mt-1.5">#{staff.employee_id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-5 py-6 border-y border-slate-50 mb-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Giới tính</p>
                <p className="text-sm font-bold text-slate-700">{staff.gender}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ngày sinh</p>
                <p className="text-sm font-bold text-slate-700">{staff.birth_date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Số điện thoại</p>
                <p className="text-sm font-bold text-slate-700">{staff.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Email liên hệ</p>
                <p className="text-sm font-bold text-slate-700">{staff.email}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Trình độ chuyên môn</p>
                <div className="flex items-center gap-2 p-4 bg-[#fbfcfd] rounded-2xl border border-slate-100 text-sm font-bold text-slate-700">
                  <GraduationCap size={18} className="text-[#00a67d]" /> {staff.qualification}
                </div>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Địa chỉ đăng ký</p>
                <div className="flex items-start gap-2 text-sm font-bold text-slate-700">
                  <MapPin size={18} className="text-rose-500 mt-0.5" />
                  <span>{staff.address}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all"
            >
              Đóng hồ sơ nhân viên
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

