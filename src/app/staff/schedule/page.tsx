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
  Trash2,
  X,
  Eye,
  GraduationCap,
  Mail,
  Phone,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { scheduleService } from "@/entities/staff/api/schedule.service";

// --- Mock Data ---
const mockEmployees: any[] = [
  {
    id: "m-001", employee_id: "NV001", full_name: "Nguyễn Quang Minh", gender: "Nam", birth_date: "1992-05-15",
    address: "Ba Đình, Hà Nội", phone: "0912.345.678", email: "minh.nq@mdfarm.vn",
    position: "Quản lý Kỹ thuật", qualification: "Thạc sĩ Chăn nuôi"
  },
  {
    id: "m-002", employee_id: "NV002", full_name: "Trần Thị Hường", gender: "Nữ", birth_date: "1995-08-22",
    address: "Từ Sơn, Bắc Ninh", phone: "0988.777.666", email: "huong.tt@mdfarm.vn",
    position: "Bác sĩ Thú y", qualification: "Bác sĩ Thú y"
  },
  {
    id: "m-003", employee_id: "NV003", full_name: "Lê Văn Hải", gender: "Nam", birth_date: "1990-11-02",
    address: "Thanh Hóa", phone: "0977.123.456", email: "hai.lv@mdfarm.vn",
    position: "Kỹ thuật Chăn nuôi", qualification: "Đại học Nông nghiệp"
  }
];

const mockSchedules: any[] = [
  {
    id: "sch-001", employee_id: "NV001", full_name: "Nguyễn Quang Minh", work_date: "2026-05-20",
    shift: "MORNING", task: "Kiểm tra hệ thống thông gió và máng ăn", section_name: "Khu Lợn Con"
  },
  {
    id: "sch-002", employee_id: "NV002", full_name: "Trần Thị Hường", work_date: "2026-05-20",
    shift: "MORNING", task: "Tiêm vaccine định kỳ đợt 2 cho đàn lợn con", section_name: "Khu Sinh Sản"
  },
  {
    id: "sch-003", employee_id: "NV003", full_name: "Lê Văn Hải", work_date: "2026-05-20",
    shift: "AFTERNOON", task: "Vệ sinh chuồng trại và khử trùng lối đi", section_name: "Khu Vỗ Béo"
  }
];

export default function SchedulePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeShift, setActiveShift] = useState("Tất cả");
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setSchedules(mockSchedules);
      setLoading(false);
    }, 600);
  }, []);

  const getStaffDetail = (id: string) => mockEmployees.find(e => e.employee_id === id);

  const filteredSchedules = schedules.filter(item => {
    const matchesSearch = 
      item.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.task.toLowerCase().includes(searchTerm.toLowerCase());
    
    const shiftMap: Record<string, string> = { "Ca Sáng": "MORNING", "Ca Chiều": "AFTERNOON", "Ca Đêm": "NIGHT" };
    return matchesSearch && (activeShift === "Tất cả" || item.shift === shiftMap[activeShift]);
  });

  return (
    <div className="space-y-6 bg-[#fbfcfd] min-h-screen -m-8 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>ĐIỀU PHỐI VẬN HÀNH</span>
            <span>/</span>
            <span className="text-slate-500">LỊCH TRỰC NHÂN SỰ</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-headline">Kế hoạch Phân ca</h1>
        </div>
        <button className="px-8 py-3 bg-[#00a67d] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-2 active:scale-95 transition-all">
          <Plus size={18} /> Tạo lịch trực mới
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex gap-2 lg:w-auto w-full overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {["Tất cả", "Ca Sáng", "Ca Chiều", "Ca Đêm"].map((s) => (
            <button key={s} onClick={() => setActiveShift(s)} className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap", activeShift === s ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "text-slate-500 hover:bg-slate-50")}>{s}</button>
          ))}
        </div>
        <div className="relative flex-1 lg:max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Tìm tên nhân viên, nhiệm vụ..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
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
              <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-black uppercase tracking-widest">Đang tải lịch trực...</td></tr>
            ) : filteredSchedules.map((item, i) => (
              <motion.tr 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                key={item.id} onClick={() => { setSelectedSchedule(item); setIsDetailModalOpen(true); }}
                className="hover:bg-slate-50/50 cursor-pointer group transition-all"
              >
                <td className="px-8 py-5 text-slate-900 font-bold flex items-center gap-3"><Calendar size={18} className="text-slate-300" />{item.work_date}</td>
                <td className="px-8 py-5">
                  <p className="text-sm font-bold text-slate-800 leading-none">{item.full_name}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">ID: {item.employee_id}</p>
                </td>
                <td className="px-8 py-5">
                  <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", item.shift === "MORNING" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600")}>
                    {item.shift === "MORNING" ? "Ca Sáng" : "Ca Chiều"}
                  </span>
                </td>
                <td className="px-8 py-5 text-slate-500 font-medium text-xs max-w-xs truncate overflow-hidden">{item.task}</td>
                <td className="px-8 py-5 text-right"><Eye size={18} className="text-slate-400 transition-all ml-auto hover:text-[#00a67d]" /></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[1.75rem] shadow-2xl overflow-hidden p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#e2f7f1] text-[#00a67d] rounded-3xl flex items-center justify-center shadow-inner"><Clock size={32} /></div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Chi tiết kế hoạch vận hành</h2>
                  </div>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100"><X /></button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-slate-50">
                <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Thời gian trực</p><div className="flex items-center gap-2 text-sm font-bold text-slate-800"><Calendar size={16} className="text-[#00a67d]" />{selectedSchedule.work_date}</div></div>
                <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ca thực hiện</p><div className="flex items-center gap-2 text-sm font-bold text-slate-800"><Clock size={16} className="text-blue-500" />{selectedSchedule.shift === "MORNING" ? "Ca Sáng" : "Ca Chiều"}</div></div>
                <div className="col-span-2 space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Địa điểm & Nhiệm vụ</p><div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-start gap-4"><MapPin size={20} className="text-rose-500 mt-1" /><div><p className="text-sm font-bold text-slate-800">{selectedSchedule.section_name}</p><p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">{selectedSchedule.task}</p></div></div></div>
              </div>

              {/* Staff Detail */}
              {getStaffDetail(selectedSchedule.employee_id) && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Nhân lực phụ trách</h4>
                  <div className="p-6 bg-[#fbfcfd] rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
                    <div className="w-20 h-20 bg-[#e2f7f1] text-[#00a67d] rounded-[1.5rem] flex items-center justify-center text-3xl font-black">{selectedSchedule.full_name.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xl font-extrabold text-slate-800 tracking-tight">{selectedSchedule.full_name}</p>
                          <p className="text-xs font-bold text-[#00a67d] uppercase tracking-widest mt-0.5">{getStaffDetail(selectedSchedule.employee_id).position}</p>
                        </div>
                        <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ID: {selectedSchedule.employee_id}</p></div>
                      </div>
                      <div className="mt-4 flex gap-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-100"><GraduationCap size={15} className="text-[#00a67d]" /> {getStaffDetail(selectedSchedule.employee_id).qualification}</div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-100"><Phone size={14} className="text-[#00a67d]" /> {getStaffDetail(selectedSchedule.employee_id).phone}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={() => setIsDetailModalOpen(false)} className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10">Đóng hồ sơ ca trực</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

