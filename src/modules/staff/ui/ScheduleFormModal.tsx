"use client";

import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  X,
  GraduationCap,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ScheduleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: any;
  employeeDetail: any;
}

export const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({
  isOpen,
  onClose,
  schedule,
  employeeDetail
}) => {
  return (
    <AnimatePresence>
      {isOpen && schedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }} 
            className="relative w-full max-w-2xl bg-white rounded-[1.75rem] shadow-2xl overflow-hidden p-10"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#e2f7f1] text-[#00a67d] rounded-3xl flex items-center justify-center shadow-inner">
                  <Clock size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Chi tiết kế hoạch vận hành</h2>
                </div>
              </div>
              <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100">
                <X />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 pb-8 border-b border-slate-50">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Thời gian trực</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Calendar size={16} className="text-[#00a67d]" />
                  {schedule.work_date}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ca thực hiện</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Clock size={16} className="text-blue-500" />
                  {schedule.shift === "MORNING" ? "Ca Sáng" : "Ca Chiều"}
                </div>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Địa điểm & Nhiệm vụ</p>
                <div className="p-4 md:p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-start gap-4">
                  <MapPin size={20} className="text-rose-500 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{schedule.section_name}</p>
                    <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">{schedule.task}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Detail */}
            {employeeDetail && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Nhân lực phụ trách</h4>
                <div className="p-4 md:p-6 bg-[#fbfcfd] rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-[#e2f7f1] text-[#00a67d] rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center text-2xl md:text-3xl font-black">
                    {schedule.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 text-center md:text-left w-full">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-1">
                      <div>
                        <p className="text-lg md:text-xl font-extrabold text-slate-800 tracking-tight">{schedule.full_name}</p>
                        <p className="text-[10px] md:text-xs font-bold text-[#00a67d] uppercase tracking-widest mt-0.5">{employeeDetail.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ID: {schedule.employee_id}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                      <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                        <GraduationCap size={15} className="text-[#00a67d]" /> 
                        {employeeDetail.qualification}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                        <Phone size={14} className="text-[#00a67d]" /> 
                        {employeeDetail.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={onClose} 
              className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10"
            >
              Đóng hồ sơ ca trực
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};