"use client";

import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/shared/utils/utils";
import { WorkSchedule } from "@/shared/types";

interface WorkScheduleTableProps {
  schedules: WorkSchedule[];
  loading: boolean;
  onEdit: (schedule: WorkSchedule) => void;
  onDelete: (schedule: WorkSchedule) => void;
  onView: (schedule: WorkSchedule) => void;
  isFarmManager?: boolean;
}

export function WorkScheduleTable({ schedules, loading, onEdit, onDelete, onView, isFarmManager = false }: WorkScheduleTableProps) {
  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Đang tải dữ liệu...</div>;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Nhân sự phụ trách</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Ca trực</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Công việc</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Trạng thái</th>
            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Không có dữ liệu lịch làm việc
              </td>
            </tr>
          ) : (
            schedules.map((s, i) => {
              const getStatusBadge = (status: string) => {
                switch (status) {
                  case "COMPLETED":
                    return (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100/50 inline-block">
                        Đã hoàn thành
                      </span>
                    );
                  case "IN_PROGRESS":
                    return (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100/50 inline-block">
                        Đang làm
                      </span>
                    );
                  case "PENDING":
                  default:
                    return (
                      <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100 inline-block">
                        Chưa thực hiện
                      </span>
                    );
                }
              };

              return (
                <motion.tr 
                  key={s.id} 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                  onClick={() => onView(s)}
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
                  <td className="px-8 py-6">
                    {getStatusBadge(s.status)}
                  </td>
                  <td className="px-8 py-2 text-right">
                    <div className="flex justify-end gap-1.5 transition-all">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onView(s); }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 transition-all"
                      >
                        <Eye size={16} />
                      </button>
                      {isFarmManager && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(s); }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(s); }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
