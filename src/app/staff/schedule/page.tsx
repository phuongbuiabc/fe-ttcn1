"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  MoreVertical,
  ChevronRight,
  Zap,
  MapPin,
  TrendingUp,
  Calendar,
  Clock,
  User,
  FileText,
  Edit2,
  Trash2
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ScheduleModal } from "@/shared/components/ScheduleModal";
import { scheduleService } from "@/entities/staff/api/schedule.service";
import { WorkSchedule } from "@/shared/types";

export default function SchedulePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeShift, setActiveShift] = useState("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<WorkSchedule | null>(null);
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.getSchedules();
      if (response.success) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleCreate = () => {
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (schedule: WorkSchedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Xác nhận xóa lịch làm việc này?")) {
      try {
        await scheduleService.deleteSchedule(id);
        fetchSchedules();
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  const filteredSchedules = schedules.filter(item => {
    const matchesSearch = 
      item.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sectionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const shiftMap: Record<string, string> = {
      "Ca Sáng": "MORNING",
      "Ca Chiều": "AFTERNOON",
      "Ca Đêm": "NIGHT"
    };

    const matchesShift = activeShift === "Tất cả" || item.shift === shiftMap[activeShift];
    return matchesSearch && matchesShift;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Lịch làm việc toàn trang trại</h1>
          <p className="text-slate-500 mt-1 font-medium">Quản lý lịch trình vận hành hệ thống MDFARM.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleCreate}
            className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Tạo lịch mới
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none w-full lg:w-auto">
          {["Tất cả", "Ca Sáng", "Ca Chiều", "Ca Đêm"].map((shift) => (
            <button
              key={shift}
              onClick={() => setActiveShift(shift)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                activeShift === shift 
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              {shift}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm NV, Khu vực, Công việc..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-slate-700 font-medium"
            />
          </div>
          <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nhân viên</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ca làm</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Khu vực</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Công việc</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center text-slate-400 font-medium">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center text-slate-400 font-medium">Chưa có lịch làm việc nào được thiết lập.</td>
                </tr>
              ) : filteredSchedules.map((item, i) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-900">{item.workDate}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.employeeName || "Mã NV: " + item.employeeCode}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Mã nhân viên: {item.employeeCode}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      item.shift === "MORNING" ? "bg-amber-50 text-amber-600" :
                      item.shift === "AFTERNOON" ? "bg-blue-50 text-blue-600" : 
                      item.shift === "NIGHT" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      {item.shift === "MORNING" ? "Sáng" : item.shift === "AFTERNOON" ? "Chiều" : "Đêm"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-emerald-500" />
                      <p className="text-sm font-bold text-slate-700">{item.sectionName || item.sectionId}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-slate-500 italic max-w-xs truncate">{item.task}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ScheduleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchSchedules}
        schedule={selectedSchedule}
      />
    </div>
  );
}
