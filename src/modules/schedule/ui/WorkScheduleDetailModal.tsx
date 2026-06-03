"use client";

import React from "react";
import { 
  MapPin, Clock, Briefcase, ShieldCheck, FileText
} from "lucide-react";
import { WorkSchedule } from "@/shared/types";
import { BaseModal } from "@/shared/components/ui/BaseModal";

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

  const shiftLabel = schedule.shift === "MORNING" ? "Sáng" : schedule.shift === "AFTERNOON" ? "Chiều" : "Đêm";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết nhiệm vụ"
      subtitle={`${schedule.workDate} • Ca ${shiftLabel}`}
      className="max-w-xl"
    >
      <div className="space-y-6 mt-4">
        {/* Task and Area Info */}
        <div className="p-6 bg-[#f8fafc] rounded-[2rem] border border-slate-100 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100">
              <Briefcase size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Công việc thực hiện</p>
              <p className="text-base font-bold text-slate-800">{schedule.workName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Địa điểm / Khu vực</p>
              <p className="text-base font-bold text-slate-800">{schedule.areaName || "Tất cả khu vực"}</p>
            </div>
          </div>
        </div>

        {/* Assigned Staff */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nhân sự phụ trách</h4>
          <div className="flex items-center gap-4 p-5 border border-slate-100 bg-[#f8fafc]/50 rounded-[2rem]">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner">
              {schedule.employeeName?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <p className="text-lg font-black text-slate-800 leading-none mb-1">{schedule.employeeName}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {schedule.employeeId?.substring(0, 8).toUpperCase() || "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Xác minh</span>
            </div>
          </div>
        </div>

        {/* Operating Note */}
        {schedule.note && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Ghi chú vận hành</h4>
            <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-[1.5rem] text-slate-600 text-sm font-medium leading-relaxed italic">
              "{schedule.note}"
            </div>
          </div>
        )}

        <button 
          onClick={onClose}
          className="w-full py-4 mt-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-emerald-500/10 transition-all active:scale-95 duration-200"
        >
          Hoàn tất kiểm tra
        </button>
      </div>
    </BaseModal>
  );
}
