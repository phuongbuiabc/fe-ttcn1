"use client";

import React from "react";
import { X, Mail, Phone, MapPin, Briefcase, Calendar, User, IdCard, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";

interface StaffDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: any | null;
}

export function StaffDetailModal({ isOpen, onClose, staff }: StaffDetailModalProps) {
  if (!isOpen || !staff) return null;

  const InfoCard = ({ label, value, icon: Icon, colorClass = "bg-slate-50" }: any) => (
    <div className={cn("p-4 rounded-2xl border border-slate-100 flex items-start gap-4 transition-all hover:shadow-md hover:shadow-slate-200/50", colorClass)}>
      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
        <Icon size={18} className="text-slate-400" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-800 leading-tight">{value || "Chưa cập nhật"}</p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
        />
        
        <motion.div 
          initial={{ scale: 0.95, y: 20, opacity: 0 }} 
          animate={{ scale: 1, y: 0, opacity: 1 }} 
          exit={{ scale: 0.95, y: 20, opacity: 0 }} 
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 relative">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <button 
              onClick={onClose} 
              className="absolute right-6 top-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Profile Header */}
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex items-end gap-5">
              <div className="w-32 h-32 bg-white rounded-[2rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-4xl font-black text-emerald-600 shadow-inner">
                  {staff.firstName?.charAt(0)}
                </div>
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck size={10} /> {staff.employmentStatus || "Đang làm việc"}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{staff.firstName} {staff.lastName}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{staff.position}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <InfoCard label="Giới tính" value={staff.gender === "MALE" ? "Nam giới" : "Nữ giới"} icon={User} />
              <InfoCard label="Ngày sinh" value={staff.dateOfBirth} icon={Calendar} />
              
              <div className="col-span-2">
                <InfoCard label="Email liên hệ" value={staff.email} icon={Mail} colorClass="bg-emerald-50/30 border-emerald-100/50" />
              </div>
              
              <div className="col-span-2">
                <InfoCard label="Số điện thoại" value={staff.phone} icon={Phone} />
              </div>

              <div className="col-span-2">
                <InfoCard label="Địa chỉ cư trú" value={staff.currentAddress} icon={MapPin} />
              </div>
              

            </div>

            <button 
              onClick={onClose} 
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all hover:bg-slate-800"
            >
              Đóng hồ sơ
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


