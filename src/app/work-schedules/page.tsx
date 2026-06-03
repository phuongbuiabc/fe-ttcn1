"use client";

import React from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { scheduleService } from "@/modules/schedule/api/schedule.service";
import { staffService } from "@/modules/staff/api/staff.service";
import { areaService } from "@/modules/area/api/area.service";
import { WorkSchedule } from "@/shared/types";
import { WorkScheduleTable } from "@/modules/schedule/ui/WorkScheduleTable";
import { WorkScheduleFormModal } from "@/modules/schedule/ui/WorkScheduleFormModal";
import { WorkScheduleDetailModal } from "@/modules/schedule/ui/WorkScheduleDetailModal";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function WorkSchedulePage() {
  const [schedules, setSchedules] = React.useState<WorkSchedule[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState<WorkSchedule | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeShift, setActiveShift] = React.useState("ALL");

  const { user } = useAuth();
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await staffService.getMe();
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMe();
  }, [user]);

  const isFarmManager = user?.role === 'ADMIN' || user?.role === 'OWNER' || profile?.position === "Quản lý trang trại" || profile?.position === "Quản trị viên" || profile?.position?.toLowerCase().includes("admin");

  // Detail modal state
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedScheduleForDetail, setSelectedScheduleForDetail] = React.useState<WorkSchedule | null>(null);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedScheduleForDelete, setSelectedScheduleForDelete] = React.useState<WorkSchedule | null>(null);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const [res, empRes, areaRes] = await Promise.all([
        scheduleService.getSchedules(),
        staffService.getEmployees(),
        areaService.getAll()
      ]);

      const rawData = (res as any).data || res;
      const scheduleList = Array.isArray(rawData) ? rawData : [];

      const mappedData = scheduleList.map((s: any) => ({
        ...s,
        employeeName: s.employeeName || (empRes.success ? empRes.data.find(e => e.id === s.employeeId)?.lastName + " " + empRes.data.find(e => e.id === s.employeeId)?.firstName : "N/A"),
        areaName: s.areaName || (areaRes.success ? areaRes.data.find(a => a.id === s.areaId)?.name : "N/A")
      }));

      setSchedules(mappedData);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSchedules();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (selectedSchedule) {
        await scheduleService.updateSchedule(selectedSchedule.id, data);
      } else {
        await scheduleService.createSchedule(data);
      }
      setIsFormOpen(false);
      fetchSchedules();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedScheduleForDelete) {
      try {
        await scheduleService.deleteSchedule(selectedScheduleForDelete.id);
        setIsDeleteOpen(false);
        fetchSchedules();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const filtered = schedules.filter(s => {
    const matchesSearch = s.workName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift = activeShift === "ALL" || s.shift === activeShift;
    return matchesSearch && matchesShift;
  });

  return (
    <div className="space-y-6 pb-20 bg-[#fbfcfd] min-h-screen -m-6 p-6">
      {/* Synchronized Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-headline uppercase">Kế hoạch Phân ca</h1>
        </div>
        {isFarmManager && (
          <button 
            onClick={() => { setSelectedSchedule(null); setIsFormOpen(true); }}
            className="px-8 py-3 bg-[#00a67d] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-2 hover:bg-[#008f6b] active:scale-95 transition-all"
          >
            <Plus size={18} /> Tạo lịch trực mới
          </button>
        )}
      </div>

      {/* Synchronized Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          {["ALL", "MORNING", "AFTERNOON", "NIGHT"].map((shift) => (
            <button
              key={shift}
              onClick={() => setActiveShift(shift)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeShift === shift 
                  ? "bg-[#e2f7f1] text-[#00a67d]" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {shift === "ALL" ? "Tất cả" : shift === "MORNING" ? "Ca Sáng" : shift === "AFTERNOON" ? "Ca Chiều" : "Ca Đêm"}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" placeholder="Tìm tên nhân viên, nhiệm vụ..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm overflow-hidden">
        <WorkScheduleTable 
          schedules={filtered} 
          loading={loading}
          onEdit={(s) => { setSelectedSchedule(s); setIsFormOpen(true); }}
          onDelete={(s) => { setSelectedScheduleForDelete(s); setIsDeleteOpen(true); }}
          onView={(s) => { setSelectedScheduleForDetail(s); setIsDetailOpen(true); }} 
          isFarmManager={isFarmManager}
        />
      </div>

      <WorkScheduleFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        editingSchedule={selectedSchedule}
      />

      <WorkScheduleDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        schedule={selectedScheduleForDetail}
      />

      <ConfirmModal
        isOpen={isDeleteOpen && !!selectedScheduleForDelete}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa?"
        description={`Lịch trực của nhân viên ${selectedScheduleForDelete?.employeeName || ""} vào ngày ${selectedScheduleForDelete?.workDate || ""} sẽ bị gỡ khỏi hệ thống.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        type="danger"
      />
    </div>
  );
}
