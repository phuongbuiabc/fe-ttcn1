"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  Stethoscope, 
  Utensils, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Pill, 
  History, 
  Eye, 
  MoreVertical, 
  Skull, 
  CheckCircle, 
  PlusCircle, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  X,
  Printer,
  Calendar,
  User,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const kpis = [
  { label: "Số lợn bất thường", value: "12", color: "rose", icon: AlertTriangle, progress: 75 },
  { label: "Số lượng bệnh", value: "45", color: "emerald", icon: Stethoscope, progress: 40 },
  { label: "Số lượng bỏ ăn", value: "08", color: "emerald", icon: Utensils, progress: 25 },
];

const barns = [
  { id: "A-01", name: "Chuồng A-01", sector: "Khu sinh sản", pigs: 96, litters: 42 },
  { id: "A-02", name: "Chuồng A-02", sector: "Khu sinh sản", pigs: 82, litters: 38 },
  { id: "B-01", name: "Chuồng B-01", sector: "Khu vỗ béo", pigs: 120, litters: 0 },
  { id: "B-02", name: "Chuồng B-02", sector: "Khu vỗ béo", pigs: 115, litters: 0 },
];

const pigsInBarn = [
  { id: "#LD-9821", date: "20/05/2026", breed: "Landrace", back: "28 cm", chest: "112 cm", weight: "125 kg", status: "Khỏe mạnh", statusColor: "emerald" },
  { id: "#LD-9822", date: "20/05/2026", breed: "Yorkshire", back: "26 cm", chest: "108 cm", weight: "118 kg", status: "Theo dõi", statusColor: "amber" },
];

const activeTreatments = [
  { id: "#LD-9901", breed: "Duroc", type: "Nái", weight: "105 kg", disease: "Sốt xuất huyết heo (ASF)", date: "21/05/2026", duration: "14 ngày", expected: "04/06", color: "rose" },
  { id: "#LD-9844", breed: "Yorkshire", type: "Thịt", weight: "92 kg", disease: "Hội chứng rối loạn hô hấp (PRRS)", date: "18/05/2026", duration: "21 ngày", expected: "08/06", color: "amber" },
];

const pigVaccinations = [
  { id: "#LD-9821", date: "15/05/2026", vaccine: "FMD-Vac", dose: "2ml", staff: "Nguyễn An" },
  { id: "#LD-9901", date: "10/05/2026", vaccine: "PRRS-Live", dose: "1ml", staff: "Trần Bình" },
];

const litterVaccinations = [
  { id: "#PIG-004", date: "18/05/2026", vaccine: "Circo-Vac", dose: "0.5ml", count: 12, staff: "Lê Văn C" },
  { id: "#PIG-009", date: "12/05/2026", vaccine: "Iron-Dextran", dose: "1ml", count: 10, staff: "Nguyễn An" },
];

const treatmentProtocol = [
  { date: "21/05/2026", drug: "ENRO-10X", dose: "10ml", status: "Xong" },
  { date: "22/05/2026", drug: "VIT-C-GLU", dose: "5ml", status: "Xong" },
  { date: "23/05/2026", drug: "AMOX-LA", dose: "8ml", status: "Chờ" },
];

const medicalHistory = [
  { start: "12/02/2026", end: "15/02/2026", diagnosis: "Tiêu chảy cấp" },
  { start: "05/11/2025", end: "15/11/2025", diagnosis: "Viêm phổi nhẹ" },
];

export default function HealthManagementPage() {
  const [isMonitoringOpen, setIsMonitoringOpen] = useState(true);
  const [selectedBarn, setSelectedBarn] = useState("A-01");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null);

  const openModal = (treatment: any) => {
    setSelectedTreatment(treatment);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Lịch tiêm phòng & Sức khỏe</h1>
          <p className="text-slate-500 text-sm mt-1">Giám sát tình trạng sức khỏe và quản lý liệu trình điều trị toàn đàn.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-all active:scale-95">
            <Calendar size={16} /> Lịch tiêm
          </button>
          <button className="px-6 py-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
            <PlusCircle size={18} /> Lập hồ sơ mới
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={cn(
            "bg-white p-6 rounded-2xl relative overflow-hidden shadow-sm border border-slate-100",
            kpi.color === "rose" ? "border-l-4 border-l-rose-500" : "border-l-4 border-l-emerald-600"
          )}>
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <kpi.icon size={64} className={kpi.color === "rose" ? "text-rose-500" : "text-emerald-600"} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className={cn(
                "text-4xl font-headline font-black",
                kpi.color === "rose" ? "text-rose-600" : "text-slate-900"
              )}>{kpi.value}</h3>
            </div>
            <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-1000", kpi.color === "rose" ? "bg-rose-500" : "bg-emerald-600")} 
                style={{ width: `${kpi.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Unified Monitoring Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <button 
          onClick={() => setIsMonitoringOpen(!isMonitoringOpen)}
          className="flex items-center justify-between w-full px-6 py-5 hover:bg-slate-50 transition-colors group"
        >
          <h2 className="text-xl font-headline font-extrabold text-slate-900">Theo dõi</h2>
          <ChevronDown className={cn("text-emerald-600 transition-transform duration-300", !isMonitoringOpen && "-rotate-90")} size={24} />
        </button>
        
        <AnimatePresence>
          {isMonitoringOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-50"
            >
              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                {/* Left Side: Barn List */}
                <section className="lg:w-[30%] p-6 space-y-4">
                  <div className="flex items-center justify-between h-10">
                    <h4 className="font-headline font-bold text-slate-900">Chuồng</h4>
                    <div className="relative">
                      <select className="appearance-none bg-slate-50 border-none rounded-full px-3 py-1.5 pr-8 text-[10px] font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer">
                        <option>Tất cả Khu chuồng</option>
                        <option>Khu A - Sinh sản</option>
                        <option>Khu B - Vỗ béo</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-50">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chuồng</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Lợn</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Đàn con</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {barns.map((barn) => (
                          <tr 
                            key={barn.id}
                            onClick={() => setSelectedBarn(barn.id)}
                            className={cn(
                              "hover:bg-emerald-50/30 transition-colors cursor-pointer group",
                              selectedBarn === barn.id && "bg-emerald-50/50"
                            )}
                          >
                            <td className="px-4 py-4">
                              <p className={cn("text-sm font-bold", selectedBarn === barn.id ? "text-emerald-700" : "text-slate-900")}>{barn.name}</p>
                              <p className="text-[10px] text-slate-400">{barn.sector}</p>
                            </td>
                            <td className="px-4 py-4 text-sm font-semibold text-right text-slate-600">{barn.pigs}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-right text-slate-600">{barn.litters}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Right Side: Pig Detail List */}
                <section className="lg:w-[70%] p-6 space-y-4">
                  <div className="flex items-center justify-between h-10">
                    <h4 className="font-headline font-bold text-slate-900">Danh sách lợn</h4>
                    <div className="flex bg-slate-100 p-1 rounded-full">
                      <button className="px-6 py-1.5 text-[10px] font-bold bg-white text-emerald-700 rounded-full shadow-sm">Lợn</button>
                      <button className="px-6 py-1.5 text-[10px] font-medium text-slate-500 hover:text-emerald-700 transition-colors">Đàn con</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-50">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-6 py-3 w-12"><input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4" /></th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Số tai</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày đo</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Giống</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lưng</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngực</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trọng lượng</th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {pigsInBarn.map((pig, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4"><input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4" /></td>
                            <td className="px-4 py-4 font-bold text-sm text-slate-900">{pig.id}</td>
                            <td className="px-4 py-4 text-sm text-slate-500">{pig.date}</td>
                            <td className="px-4 py-4 text-sm text-slate-500">{pig.breed}</td>
                            <td className="px-4 py-4 text-sm text-slate-600">{pig.back}</td>
                            <td className="px-4 py-4 text-sm text-slate-600">{pig.chest}</td>
                            <td className="px-4 py-4 text-sm font-bold text-slate-900">{pig.weight}</td>
                            <td className="px-4 py-4">
                              <span className={cn(
                                "px-3 py-0.5 text-[9px] font-bold uppercase rounded-full",
                                pig.statusColor === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                              )}>{pig.status}</span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button className="text-slate-400 hover:text-emerald-600 transition-colors"><MoreVertical size={18} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-slate-50 gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[11px] text-slate-400 font-medium mr-2">1-10 của 45 lợn (Chuồng {selectedBarn})</p>
                      <button className="px-4 py-1.5 text-[11px] font-bold text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">Cập nhật</button>
                      <button className="px-4 py-1.5 text-[11px] font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 shadow-sm transition-all">Chuyển chuồng</button>
                      <button className="px-4 py-1.5 text-[11px] font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5">
                        <PlusCircle size={14} /> Điều trị
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 disabled:opacity-30" disabled><ChevronLeft size={16} /></button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pigs Under Treatment Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-headline font-extrabold text-slate-900">Danh sách lợn đang điều trị</h2>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-full hover:bg-slate-100 transition-colors border border-slate-100">Tải báo cáo</button>
            <button className="px-4 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-full shadow-sm hover:bg-emerald-700 transition-colors">Lập hồ sơ mới</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 w-12"><input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4" /></th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Số tai</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Giống</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loại</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trọng lượng</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bệnh điều trị</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày bệnh</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thời gian dự kiến</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeTreatments.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4"><input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4" /></td>
                  <td className="px-4 py-4 font-bold text-sm text-slate-900">{item.id}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{item.breed}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{item.type}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">{item.weight}</td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "px-3 py-1 text-[11px] font-bold rounded-full",
                      item.color === "rose" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                    )}>{item.disease}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">{item.date}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-emerald-600">{item.duration} (Dự kiến {item.expected})</td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={() => openModal(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-50 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[11px] font-bold text-slate-400">Đã chọn: 2 lợn</p>
            <button className="px-5 py-2 text-[11px] font-bold text-white bg-rose-500 rounded-full hover:bg-rose-600 shadow-sm transition-all flex items-center gap-1.5">
              <Skull size={14} /> Đề xuất loại
            </button>
            <button className="px-5 py-2 text-[11px] font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5">
              <CheckCircle size={14} /> Kết thúc điều trị
            </button>
          </div>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 disabled:opacity-30" disabled><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Vaccination History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pig Vaccination Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-headline font-extrabold text-slate-900">Lịch sử tiêm phòng Lợn</h2>
            <button className="p-1.5 bg-emerald-600 text-white rounded-full shadow-sm hover:bg-emerald-700 transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo số tai, thuốc..." 
                className="w-full pl-9 pr-4 py-2 bg-white rounded-full border border-slate-100 text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/30">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Số tai</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày tiêm</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tên thuốc</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Liều</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhân viên</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pigVaccinations.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-bold text-sm text-slate-900">{v.id}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">{v.date}</td>
                    <td className="px-4 py-4 text-sm font-medium text-emerald-700">{v.vaccine}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{v.dose}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">{v.staff}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-slate-400">
                        <button className="p-1 hover:text-emerald-600 transition-colors"><Edit size={14} /></button>
                        <button className="p-1 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-50 flex justify-between items-center">
            <p className="text-[10px] text-slate-400 font-bold">2/24 bản ghi</p>
            <div className="flex gap-1">
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400"><ChevronLeft size={14} /></button>
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">1</button>
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>

        {/* Litter Vaccination Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-headline font-extrabold text-slate-900">Lịch sử tiêm phòng Lợn con</h2>
            <button className="p-1.5 bg-emerald-600 text-white rounded-full shadow-sm hover:bg-emerald-700 transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm theo mã đàn, thuốc..." 
                className="w-full pl-9 pr-4 py-2 bg-white rounded-full border border-slate-100 text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/30">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã Đàn</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày tiêm</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tên thuốc</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Liều</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">SL</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhân viên</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {litterVaccinations.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-bold text-sm text-slate-900">{v.id}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">{v.date}</td>
                    <td className="px-4 py-4 text-sm font-medium text-emerald-700">{v.vaccine}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{v.dose}</td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-900">{v.count}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">{v.staff}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-slate-400">
                        <button className="p-1 hover:text-emerald-600 transition-colors"><Edit size={14} /></button>
                        <button className="p-1 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-50 flex justify-between items-center">
            <p className="text-[10px] text-slate-400 font-bold">2/15 đàn</p>
            <div className="flex gap-1">
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400"><ChevronLeft size={14} /></button>
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">1</button>
              <button className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-600"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Detail Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Stethoscope size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-black text-emerald-900">Hồ sơ điều trị chi tiết</h3>
                    <p className="text-slate-500 text-sm">
                      Mã lợn: <span className="font-bold text-slate-900">{selectedTreatment?.id}</span> | Giống: {selectedTreatment?.breed} | Loại: {selectedTreatment?.type}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Treatment Protocol */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                      <Pill size={14} className="text-emerald-600" /> Liệu trình điều trị
                    </h4>
                    <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/30">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                          <tr>
                            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Ngày</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Thuốc</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Liều</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase text-center">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {treatmentProtocol.map((p, i) => (
                            <tr key={i} className="hover:bg-white transition-colors">
                              <td className="px-4 py-3 text-xs text-slate-500">{p.date}</td>
                              <td className="px-4 py-3 text-xs font-bold text-emerald-700">{p.drug}</td>
                              <td className="px-4 py-3 text-xs text-slate-600 text-right">{p.dose}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={cn(
                                  "inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold rounded-full",
                                  p.status === "Xong" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                )}>
                                  {p.status === "Xong" && <CheckCircle size={10} />}
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
                      <History size={14} className="text-emerald-600" /> Lịch sử bệnh
                    </h4>
                    <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/30">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                          <tr>
                            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Ngày bắt đầu</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase text-right">Ngày khỏi</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Chẩn đoán</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {medicalHistory.map((h, i) => (
                            <tr key={i} className="hover:bg-white transition-colors">
                              <td className="px-4 py-3 text-xs text-slate-500">{h.start}</td>
                              <td className="px-4 py-3 text-xs text-slate-500 text-right">{h.end}</td>
                              <td className="px-4 py-3 text-xs font-bold text-emerald-800">{h.diagnosis}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Additional Stats / Notes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Cân nặng hiện tại</p>
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-emerald-600" />
                      <span className="text-xl font-black text-slate-900">{selectedTreatment?.weight}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Người phụ trách</p>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-emerald-600" />
                      <span className="text-sm font-bold text-slate-900">BS. Nguyễn Văn A</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mức độ ưu tiên</p>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-rose-500" />
                      <span className="text-sm font-bold text-rose-600">Cao</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0 z-10">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Đóng
                </button>
                <button className="px-8 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                  <Printer size={18} /> In hồ sơ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
