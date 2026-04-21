"use client";

import React from "react";
import {
  Calendar,
  Eye
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";

interface ScheduleTableProps {
  schedules: any[];
  loading: boolean;
  onViewDetail: (schedule: any) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  loading,
  onViewDetail
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden responsive-table">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-8 py-6 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Ngày phối hợp</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Nhân sự phụ trách</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Ca trực</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Nhiệm vụ</th>
            <th className="px-8 py-6"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr>
              <td colSpan={5} className="py-20 text-center text-slate-400 font-black uppercase tracking-widest">
                Đang tải lịch trực...
              </td>
            </tr>
          ) : schedules.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-20 text-center text-slate-400 font-black uppercase tracking-widest">
                Không tìm thấy lịch trực nào
              </td>
            </tr>
          ) : (
            schedules.map((item, i) => (
              <motion.tr
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: i * 0.05 }}
                key={item.id} 
                onClick={() => onViewDetail(item)}
                className="hover:bg-slate-50/50 cursor-pointer group transition-all"
              >
                <td className="px-8 py-5 text-slate-900 font-bold flex items-center gap-3">
                  <Calendar size={18} className="text-slate-300" />
                  {item.work_date}
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-bold text-slate-800 leading-none">{item.full_name}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">ID: {item.employee_id}</p>
                </td>
                <td className="px-8 py-5">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", 
                    item.shift === "MORNING" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {item.shift === "MORNING" ? "Ca Sáng" : "Ca Chiều"}
                  </span>
                </td>
                <td className="px-8 py-5 text-slate-500 font-medium text-xs max-w-xs truncate overflow-hidden">
                  {item.task}
                </td>
                <td className="px-8 py-5 text-right">
                  <Eye size={18} className="text-slate-400 transition-all ml-auto hover:text-[#00a67d]" />
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};