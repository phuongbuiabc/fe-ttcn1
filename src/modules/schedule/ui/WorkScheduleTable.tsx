"use client";

import React from "react";
import { Eye } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/shared/utils/utils";
import { WorkSchedule } from "@/shared/types";

interface WorkScheduleTableProps {
  schedules: WorkSchedule[];
  loading: boolean;
  onEdit: (schedule: WorkSchedule) => void;
  onDelete: (id: string) => void;
  onView: (schedule: WorkSchedule) => void;
}

export function WorkScheduleTable({ schedules, loading, onEdit, onView }: WorkScheduleTableProps) {
  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Đang tải dữ liệu...</div>;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Nhân sự phụ trách</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Ca trực</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Công việc</th>
            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Không có dữ liệu lịch làm việc
              </td>
            </tr>
          ) : (
            schedules.map((s, i) => (
              <motion.tr 
                key={s.id} 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                onClick={() => onEdit(s)}
              >
                <td className="px-8 py-6">
                  <p className="text-sm font-black text-slate-800 leading-none">{s.employeeName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">ID: {s.employeeId?.substring(0, 8).toUpperCase() || "N/A"}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-block",
                    s.shift === "MORNING" ? "bg-amber-50 text-amber-500" :
                    s.shift === "AFTERNOON" ? "bg-blue-50 text-blue-500" : "bg-purple-50 text-purple-500"
                  )}>
                    {s.shift === "MORNING" ? "Ca Sáng" : s.shift === "AFTERNOON" ? "Ca Chiều" : "Ca Đêm"}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm">{s.workName}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">{s.workDate}</p>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                    <Eye size={20} />
                  </button>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
