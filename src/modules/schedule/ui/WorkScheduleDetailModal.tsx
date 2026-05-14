"use client";

import React from "react";
import { 
  X, Calendar, Clock, MapPin, User, 
  FileText, CheckCircle2, ShieldCheck, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WorkSchedule } from "@/shared/types";

interface WorkScheduleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: WorkSchedule | null;
}

export function WorkScheduleDetailModal({ 
  isOpen, 
  onClose, 
  schedule 
}: WorkScheduleDetailModalProps) {
  if (!isOpen || !schedule) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
        />
        
        <motion.div 
          initial={{ y: 20, scale: 0.95, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Top Banner */}
          <div className="h-32 bg-slate-900 relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Calendar size={120} />
             </div>
             <div className="absolute -bottom-8 left-10 w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 border-4 border-white">
                <Clock size={32} />
             </div>
          </div>

          <div className="p-10 pt-14 space-y-8">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none mb-2">Chi tiết nhiệm vụ</h3>
                  <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">{schedule.workDate} • Ca {schedule.shift === "MORNING" ? "Sáng" : "Chiều"}</p>
               </div>
               <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
                  <X size={20} />
               </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                     <Briefcase size={18} />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Công việc thực hiện</p>
                     <p className="text-base font-bold text-slate-800">{schedule.workName}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                     <MapPin size={18} />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Địa điểm / Khu vực</p>
                     <p className="text-base font-bold text-slate-800">{schedule.areaName || "Tất cả khu vực"}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-2">Nhân sự phụ trách</h4>
               <div className="flex items-center gap-4 p-5 border-2 border-slate-50 rounded-[2rem]">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-black">
                     {schedule.employeeName?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                     <p className="text-lg font-black text-slate-800 leading-none mb-1">{schedule.employeeName}</p>
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ID: {schedule.employeeId}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
                     <ShieldCheck size={14} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Xác minh</span>
                  </div>
               </div>
            </div>

            {schedule.note && (
               <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-2">Ghi chú vận hành</h4>
                  <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-[1.5rem] text-slate-600 text-sm font-medium leading-relaxed italic">
                     "{schedule.note}"
                  </div>
               </div>
            )}

            <button 
              onClick={onClose}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all active:scale-95"
            >
              Hoàn tất kiểm tra
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
