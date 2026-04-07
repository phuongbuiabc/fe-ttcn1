"use client";

import React, { useState } from "react";
import { 
  Search as SearchIcon, 
  Bell, 
  AlertTriangle, 
  PlusCircle, 
  CheckCircle2, 
  Baby, 
  MoreVertical, 
  ChevronRight as ChevronRightIcon, 
  BarChart3,
  Info as InfoIcon,
  Activity,
  PawPrint,
  X,
  Edit,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

// --- Types ---

interface SummaryStat {
  label: string;
  value: string;
  subValue: string;
  type: string;
  color: string;
}

interface SowRecord {
  id: string;
  breed: string;
  pen: string;
  status: string;
  statusColor: string;
  matingDate: string;
  days: number;
  progress: number;
}

interface PerformanceData {
  name: string;
  value: number;
}

const summaryStats: SummaryStat[] = [
  { label: "Tổng số nái", value: "412", subValue: "85%", type: "progress", color: "emerald" },
  { label: "Đang mang thai", value: "284", subValue: "+12 so với tháng trước", type: "text", color: "slate" },
  { label: "Sắp đẻ (7 ngày)", value: "18", subValue: "Cần chú ý", type: "alert", color: "rose" },
  { label: "Số lứa đẻ tháng này", value: "42", subValue: "+40", type: "avatars", color: "slate" },
  { label: "Tỉ lệ đậu thai", value: "92.4%", subValue: "Mục tiêu: 95%", type: "chart", color: "emerald" },
];

const sowData: SowRecord[] = [
  { id: "SOW-104", breed: "Yorkshire", pen: "B-04", status: "Sắp đẻ", statusColor: "rose", matingDate: "12/08/2023", days: 114, progress: 98 },
  { id: "SOW-092", breed: "Landrace", pen: "A-12", status: "Đang mang thai", statusColor: "emerald", matingDate: "25/08/2023", days: 102, progress: 88 },
  { id: "SOW-156", breed: "Duroc", pen: "C-02", status: "Chưa phối", statusColor: "slate", matingDate: "--/--/----", days: 0, progress: 0 },
  { id: "SOW-201", breed: "Yorkshire", pen: "B-01", status: "Đang mang thai", statusColor: "emerald", matingDate: "05/09/2023", days: 92, progress: 80 },
  { id: "SOW-088", breed: "Landrace", pen: "A-05", status: "Sắp đẻ", statusColor: "rose", matingDate: "10/08/2023", days: 116, progress: 100 },
];

const performanceData: PerformanceData[] = [
  { name: "Tháng 6", value: 45 },
  { name: "Tháng 7", value: 60 },
  { name: "Tháng 8", value: 75 },
  { name: "Tháng 9", value: 40 },
  { name: "Tháng 10", value: 95 },
  { name: "Hiện tại", value: 80 },
];

export default function ReproductionManagementPage() {
  const [selectedSowId, setSelectedSowId] = useState("SOW-092");
  const [records, setRecords] = useState<SowRecord[]>(sowData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SowRecord | null>(null);
  
  const [isPregnancyModalOpen, setIsPregnancyModalOpen] = useState(false);
  const [isFarrowingModalOpen, setIsFarrowingModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<SowRecord>>({
    id: "",
    breed: "Yorkshire",
    pen: "",
    status: "Chưa phối",
    statusColor: "slate",
    matingDate: "--/--/----",
    days: 0,
    progress: 0
  });

  // Filtered records
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         record.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "Tất cả" || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const selectedSow = records.find(s => s.id === selectedSowId) || records[0];

  const openAddModal = () => {
    setEditingRecord(null);
    setFormData({
      id: `SOW-${Math.floor(100 + Math.random() * 900)}`,
      breed: "Yorkshire",
      pen: "",
      status: "Chưa phối",
      statusColor: "slate",
      matingDate: "--/--/----",
      days: 0,
      progress: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record: SowRecord) => {
    setEditingRecord(record);
    setFormData(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bản ghi này không?")) {
      const newRecords = records.filter(r => r.id !== id);
      setRecords(newRecords);
      if (selectedSowId === id && newRecords.length > 0) {
        setSelectedSowId(newRecords[0].id);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const statusColor = formData.status === "Sắp đẻ" ? "rose" : 
                       formData.status === "Đang mang thai" ? "emerald" : "slate";
    
    const newRecord = { ...formData, statusColor } as SowRecord;

    if (editingRecord) {
      setRecords(records.map(r => r.id === editingRecord.id ? newRecord : r));
    } else {
      setRecords([newRecord, ...records]);
      setSelectedSowId(newRecord.id);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Smart Alerts */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm"
      >
        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
          <AlertTriangle size={20} fill="currentColor" className="opacity-20" />
          <AlertTriangle size={20} className="absolute" />
        </div>
        <div className="flex-1">
          <p className="font-headline font-bold text-sm text-rose-900">Cảnh báo: 4 nái quá hạn đẻ</p>
          <p className="text-xs text-rose-700/80">Các nái SOW-092, SOW-104 đã vượt quá 116 ngày mang thai. Cần kiểm tra ngay.</p>
        </div>
        <button className="bg-white px-4 py-1.5 rounded-full text-xs font-bold text-rose-600 border border-rose-100 hover:bg-rose-50 transition-colors">
          Xem chi tiết
        </button>
      </motion.div>

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Sinh sản</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi chu kỳ phối giống, thai kỳ và lứa đẻ của đàn nái.</p>
        </div>
        <div className="relative w-full md:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm ID nái, giống..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>
      </div>

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {summaryStats.map((stat, idx) => (
          <div key={idx} className={cn(
            "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden",
            stat.color === "rose" && "border-l-4 border-l-rose-500",
            stat.color === "emerald" && idx === 0 && "border-l-4 border-l-emerald-600",
            idx === 4 && "bg-emerald-900 text-white border-none"
          )}>
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-wider mb-2",
              idx === 4 ? "text-emerald-100/60" : "text-slate-400"
            )}>{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className={cn(
                "text-3xl font-headline font-black",
                stat.color === "rose" ? "text-rose-600" : (idx === 4 ? "text-white" : "text-slate-900")
              )}>{stat.value}</h3>
              {stat.type === "alert" && <AlertTriangle size={14} className="text-rose-500 animate-pulse" />}
            </div>
            
            {stat.type === "progress" && (
              <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: stat.subValue }}></div>
              </div>
            )}
            
            {stat.type === "text" && (
              <p className="text-[10px] text-slate-400 mt-2 font-medium">{stat.subValue}</p>
            )}

            {stat.type === "avatars" && (
              <div className="mt-3 flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                    <Image 
                      src={`https://picsum.photos/seed/pig${i}/32/32`} 
                      alt="avatar" 
                      fill
                      className="object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-700">
                  {stat.subValue}
                </div>
              </div>
            )}

            {stat.type === "chart" && (
              <div className="absolute right-0 bottom-0 opacity-20 p-2">
                <BarChart3 size={48} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Data Table */}
        <section className="lg:w-3/5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 flex flex-wrap gap-4 items-center justify-between border-b border-slate-50">
              <h3 className="text-xl font-headline font-extrabold text-slate-900">Danh sách Đàn nái</h3>
              <div className="flex gap-3">
                <div className="relative">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-slate-50 border-none rounded-full px-4 py-1.5 pr-10 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                  >
                    <option value="Tất cả">Trạng thái: Tất cả</option>
                    <option value="Đang mang thai">Đang mang thai</option>
                    <option value="Sắp đẻ">Sắp đẻ</option>
                    <option value="Chưa phối">Chưa phối</option>
                  </select>
                  <ChevronRightIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" size={14} />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">ID Nái</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ô/Chuồng</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ngày phối</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Số ngày mang thai</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRecords.map((sow) => (
                    <tr 
                      key={sow.id}
                      onClick={() => setSelectedSowId(sow.id)}
                      className={cn(
                        "hover:bg-emerald-50/30 transition-all cursor-pointer border-l-4 border-transparent",
                        selectedSowId === sow.id ? "bg-emerald-50/50 border-emerald-600" : "hover:border-emerald-600/30"
                      )}
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900 text-sm">{sow.id}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Giống: {sow.breed}</div>
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-600 text-sm">{sow.pen}</td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                          sow.statusColor === "rose" ? "bg-rose-100 text-rose-700" : 
                          sow.statusColor === "emerald" ? "bg-emerald-100 text-emerald-700" : 
                          "bg-slate-100 text-slate-500"
                        )}>
                          {sow.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs font-medium text-slate-500">{sow.matingDate}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900 text-xs whitespace-nowrap">{sow.days} ngày</span>
                          <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full transition-all duration-500", sow.statusColor === "rose" ? "bg-rose-500" : "bg-emerald-600")} 
                              style={{ width: `${sow.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditModal(sow); }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(sow.id); }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          {selectedSowId === sow.id ? (
                            <ChevronRightIcon className="text-emerald-600" size={18} />
                          ) : (
                            <ChevronRightIcon className="text-slate-200" size={18} />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sidebar Detail View */}
        <section className="lg:w-2/5 space-y-6">
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white py-4 rounded-full font-bold shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <PlusCircle size={20} />
              Thêm Bản ghi Phối giống
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsPregnancyModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-white text-slate-700 py-3 rounded-2xl font-bold text-xs border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <CheckCircle2 size={16} className="text-emerald-600" />
                Ghi nhận Kết quả Thai
              </button>
              <button 
                onClick={() => setIsFarrowingModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-white text-slate-700 py-3 rounded-2xl font-bold text-xs border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Baby size={16} className="text-emerald-600" />
                Ghi nhận Đẻ
              </button>
            </div>
          </div>

          <motion.div 
            key={selectedSowId}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-3xl p-8 relative overflow-hidden shadow-sm border border-slate-100"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h4 className="text-3xl font-headline font-black text-slate-900 tracking-tight">{selectedSow.id}</h4>
                  <p className="text-sm font-bold text-slate-400 mt-1">Lứa thứ: 4 | Ô: {selectedSow.pen}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
                  <PawPrint size={24} />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Thông tin Thai kỳ Hiện tại</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Dự kiến ngày đẻ</p>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">18/12/2023</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Số ngày mang thai</p>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedSow.days} / 114</p>
                    </div>
                    <div className="col-span-2">
                      <div className="w-full h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", selectedSow.statusColor === "rose" ? "bg-rose-500" : "bg-emerald-600")} 
                          style={{ width: `${selectedSow.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Kết quả lứa đẻ trước (Lứa 3)</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                      <p className="text-2xl font-headline font-black text-emerald-700">14</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Tổng</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                      <p className="text-2xl font-headline font-black text-emerald-700">12</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Sống</p>
                    </div>
                    <div className="text-center p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                      <p className="text-2xl font-headline font-black text-rose-600">02</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Chết</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Lịch sử sinh sản</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-slate-50 text-sm">
                      <span className="text-slate-500 font-medium">Lứa 2 - 12/03/2023</span>
                      <span className="font-bold text-slate-900">11 con sống</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-50 text-sm">
                      <span className="text-slate-500 font-medium">Lứa 1 - 05/10/2022</span>
                      <span className="font-bold text-slate-900">09 con sống</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Insights Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Hiệu suất Đàn nái 6 tháng</p>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {performanceData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 4 ? "#059669" : "#d1fae5"} 
                        className="hover:fill-emerald-600 transition-colors cursor-pointer"
                      />
                    ))}
                  </Bar>
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as PerformanceData;
                        return (
                          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-xl">
                            {data.value}% hiệu suất
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <span>Tháng 6</span>
              <span className="text-emerald-600">Hiện tại</span>
            </div>
          </div>
        </section>
      </div>
      {/* Pregnancy Check Modal */}
      <AnimatePresence>
        {isPregnancyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-headline font-black text-emerald-900">Ghi nhận Kết quả Thai</h3>
                <button onClick={() => setIsPregnancyModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">ID Nái</label>
                  <p className="font-bold text-slate-900">{selectedSow.id}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Kết quả kiểm tra</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 px-4 bg-emerald-50 text-emerald-700 border-2 border-emerald-500 rounded-xl font-bold text-sm">Đậu thai</button>
                    <button className="py-3 px-4 bg-slate-50 text-slate-600 border-2 border-transparent rounded-xl font-bold text-sm hover:bg-slate-100">Trượt thai</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ghi chú</label>
                  <textarea className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none min-h-[100px]" placeholder="Nhập ghi chú kiểm tra..."></textarea>
                </div>
                <button 
                  onClick={() => setIsPregnancyModalOpen(false)}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                >
                  Xác nhận kết quả
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Farrowing Modal */}
      <AnimatePresence>
        {isFarrowingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-headline font-black text-emerald-900">Ghi nhận Đẻ</h3>
                <button onClick={() => setIsFarrowingModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số con sống</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số con chết</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Trọng lượng trung bình (kg)</label>
                  <input type="number" step="0.1" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="1.2" />
                </div>
                <button 
                  onClick={() => setIsFarrowingModalOpen(false)}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                >
                  Hoàn tất ghi nhận
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="text-2xl font-headline font-black text-emerald-900">
                  {editingRecord ? "Sửa bản ghi phối giống" : "Thêm bản ghi phối giống mới"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">ID Nái</label>
                    <input 
                      type="text" 
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({...formData, id: e.target.value})}
                      placeholder="SOW-XXX"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Giống</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.breed}
                      onChange={(e) => setFormData({...formData, breed: e.target.value as any})}
                    >
                      <option>Yorkshire</option>
                      <option>Landrace</option>
                      <option>Duroc</option>
                      <option>Pietrain</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ô/Chuồng</label>
                    <input 
                      type="text" 
                      required
                      value={formData.pen}
                      onChange={(e) => setFormData({...formData, pen: e.target.value})}
                      placeholder="Ví dụ: B-04"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Trạng thái</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option>Chưa phối</option>
                      <option>Đang mang thai</option>
                      <option>Sắp đẻ</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ngày phối</label>
                    <input 
                      type="text" 
                      required
                      value={formData.matingDate}
                      onChange={(e) => setFormData({...formData, matingDate: e.target.value})}
                      placeholder="DD/MM/YYYY"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số ngày mang thai</label>
                    <input 
                      type="number" 
                      required
                      value={formData.days}
                      onChange={(e) => {
                        const days = parseInt(e.target.value);
                        setFormData({...formData, days, progress: Math.min(100, Math.round((days / 114) * 100))});
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
