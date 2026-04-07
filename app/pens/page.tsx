"use client";

import React, { useState } from "react";
import { 
  Warehouse, 
  ArrowLeftRight, 
  TrendingUp, 
  CheckCircle, 
  Wrench, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Utensils, 
  Wind, 
  Eye, 
  MapPin, 
  ShieldCheck,
  PlusCircle,
  Settings,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// --- Mock Data ---

const stats = [
  { label: "Số lượng chuồng sử dụng", value: "18", total: "24", sub: "+2 chuồng so với tháng trước", icon: Warehouse, color: "emerald" },
  { label: "Số chuồng Hoạt động", value: "16", sub: "Hệ thống vận hành ổn định", icon: CheckCircle, color: "emerald" },
  { label: "Số chuồng đang bảo trì", value: "2", sub: "Đang kiểm tra định kỳ", icon: Wrench, color: "amber" },
];

const barns = [
  { id: "A1", name: "Chuồng A1", sector: "Khu lợn con", count: 62, piglets: 45, area: "120 m2", density: "0.52 con/m2", status: "Đang sử dụng", statusColor: "emerald" },
  { id: "A2", name: "Chuồng A2", sector: "Khu vỗ béo", count: 92, piglets: 0, area: "150 m2", density: "0.61 con/m2", status: "Đang sử dụng", statusColor: "emerald" },
  { id: "A3", name: "Chuồng A3", sector: "Khu sinh sản", count: 0, piglets: 0, area: "120 m2", density: "Trống", status: "Trống", statusColor: "amber" },
  { id: "A4", name: "Chuồng A4", sector: "Khu cách ly", count: 12, piglets: 0, area: "80 m2", density: "0.15 con/m2", status: "Bảo trì", statusColor: "rose" },
];

const pigsInBarn = [
  { id: "#LT1024", breed: "Landrace x Yorkshire", type: "Thịt", date: "12/10/2023", weight: "24.5 kg", status: "Khỏe mạnh" },
  { id: "#LT1025", breed: "Duroc lai", type: "Thịt", date: "12/10/2023", weight: "22.8 kg", status: "Khỏe mạnh" },
];

const littersInBarn = [
  { id: "#DAN-001", motherId: "#ME-992", date: "01/01/2024", count: 12, avgWeight: "2.1 kg", status: "Ổn định" },
  { id: "#DAN-002", motherId: "#ME-845", date: "05/01/2024", count: 14, avgWeight: "1.9 kg", status: "Theo dõi sát" },
  { id: "#DAN-003", motherId: "#ME-712", date: "10/01/2024", count: 19, avgWeight: "2.3 kg", status: "Phát triển tốt" },
];

export default function BarnManagementPage() {
  const [expandedBarn, setExpandedBarn] = useState<string | null>("A1");

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">
            <span>ĐƠN VỊ CHĂN NUÔI</span>
            <span className="text-emerald-300">/</span>
            <span>CƠ SỞ PHÍA ĐÔNG NAM</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Chuồng trại</h1>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#006c49] to-[#10b981] text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
          <ArrowLeftRight size={18} /> Điều chuyển lợn
        </button>
      </div>

      {/* Stats Bento Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={cn(
            "bg-white p-6 rounded-2xl relative overflow-hidden group border border-slate-100 shadow-sm",
            stat.color === "amber" ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-emerald-600"
          )}>
            <div className="relative z-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">{stat.label}</span>
              <div className="text-4xl font-headline font-extrabold text-slate-900">
                {stat.value}
                {stat.total && <span className="text-xl text-slate-400 font-medium ml-1">/{stat.total}</span>}
              </div>
              <div className={cn(
                "mt-2 text-xs font-medium flex items-center gap-1",
                stat.color === "amber" ? "text-amber-600" : "text-emerald-600"
              )}>
                {stat.color === "amber" ? <Wrench size={12} /> : <TrendingUp size={12} />}
                {stat.sub}
              </div>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-5 group-hover:scale-110 transition-transform">
              <stat.icon size={96} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full md:w-64">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Lọc theo phân khu</label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all">
              <option value="all">Tất cả phân khu</option>
              <option value="isolation">Khu cách ly</option>
              <option value="farrowing">Khu đẻ</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" size={18} />
          </div>
        </div>
        <div className="flex-1 min-w-[280px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tìm kiếm</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên chuồng..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex items-center h-[42px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">Đang hiển thị: 4 chuồng</span>
        </div>
      </div>

      {/* Barn List */}
      <div className="space-y-4">
        {barns.map((barn) => (
          <div key={barn.id} className={cn(
            "rounded-2xl overflow-hidden transition-all duration-300",
            expandedBarn === barn.id 
              ? "border-2 border-emerald-600 ring-4 ring-emerald-600/5 shadow-xl" 
              : "bg-white border border-slate-100 hover:shadow-md"
          )}>
            {/* Horizontal Card Header */}
            <div 
              onClick={() => setExpandedBarn(expandedBarn === barn.id ? null : barn.id)}
              className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="flex-shrink-0 min-w-[120px]">
                <h3 className={cn("text-xl font-bold", expandedBarn === barn.id ? "text-emerald-900" : "text-slate-900")}>{barn.name}</h3>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">{barn.sector}</p>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-0.5">Số lượng lợn</p>
                  <p className="text-sm font-extrabold text-slate-800">{barn.count} con</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-0.5">Lợn con</p>
                  <p className="text-sm font-extrabold text-slate-800">{barn.piglets} con</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-0.5">Diện tích</p>
                  <p className="text-sm font-extrabold text-slate-800">{barn.area}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-0.5">Mật độ</p>
                  <p className="text-sm font-extrabold text-slate-800">{barn.density}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex">
                    <span className={cn(
                      "px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider",
                      barn.statusColor === "emerald" ? "bg-emerald-100 text-emerald-700" : 
                      barn.statusColor === "amber" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                    )}>{barn.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-lg transition-all",
                  expandedBarn === barn.id ? "bg-emerald-600 text-white shadow-sm" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                )}>
                  {expandedBarn === barn.id ? <ChevronUp size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Detail Expanded Panel */}
            <AnimatePresence>
              {expandedBarn === barn.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-white border-t border-slate-50"
                >
                  <div className="grid grid-cols-12">
                    {/* Header of expansion */}
                    <div className="col-span-12 bg-emerald-50/50 px-8 py-4 flex justify-between items-center border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <Info className="text-emerald-600" size={20} />
                        <h2 className="font-headline font-extrabold text-emerald-900">Chi tiết {barn.name} - Trạng thái Hoạt động</h2>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 text-emerald-700 font-bold text-sm bg-white rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100">Cập nhật thiết bị</button>
                        <button className="px-4 py-2 text-white font-bold text-sm bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">Chỉnh sửa thông tin</button>
                      </div>
                    </div>

                    {/* Left Column: Information */}
                    <div className="col-span-12 lg:col-span-4 p-8 border-r border-slate-100 space-y-10">
                      <div>
                        <h3 className="text-[11px] uppercase tracking-[0.2em] text-emerald-600 font-black mb-6">Thông tin chuồng</h3>
                        <div className="space-y-4">
                          {[
                            { label: "Mã chuồng", value: `CH-${barn.id}-2024` },
                            { label: "Tên chuồng", value: `Chuồng nuôi ${barn.sector.toLowerCase()} 1` },
                            { label: "Loại chuồng", value: "Chuồng kín (AC)" },
                            { label: "Phân khu", value: barn.sector, highlight: true },
                            { label: "Trạng thái", value: barn.status, dot: true }
                          ].map((info, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-2">
                              <span className="text-sm text-slate-400">{info.label}</span>
                              <div className="flex items-center gap-2">
                                {info.dot && <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />}
                                <span className={cn("text-sm font-bold", info.highlight ? "text-emerald-700" : info.dot ? "text-emerald-600" : "text-slate-900")}>
                                  {info.value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[11px] uppercase tracking-[0.2em] text-emerald-600 font-black mb-6">Danh mục vật tư</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 border border-slate-100">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                              <Utensils size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">Máng ăn tự động</p>
                              <p className="text-[10px] text-slate-400 font-medium">SL: 08 cái • Bảo trì: 20/12/2023</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 border border-slate-100">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                              <Wind size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">Hệ thống làm mát</p>
                              <p className="text-[10px] text-slate-400 font-medium">SL: 2 cụm • Vận hành: 100%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Tables */}
                    <div className="col-span-12 lg:col-span-8 p-8 flex flex-col gap-10">
                      {/* General Pig List */}
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[11px] uppercase tracking-[0.2em] text-emerald-600 font-black">Danh sách lợn trong chuồng</h3>
                          <div className="text-xs font-bold text-slate-400 uppercase">Tổng số: {barn.count} con</div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                                <th className="pb-4 font-semibold">Số tai</th>
                                <th className="pb-4 font-semibold">Giống</th>
                                <th className="pb-4 font-semibold">Loại</th>
                                <th className="pb-4 font-semibold text-center">Ngày nhập</th>
                                <th className="pb-4 font-semibold text-right">Cân nặng</th>
                                <th className="pb-4 font-semibold text-center">Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {pigsInBarn.map((pig, i) => (
                                <tr key={i} className="group hover:bg-emerald-50/30 transition-colors">
                                  <td className="py-4 font-bold text-slate-800">{pig.id}</td>
                                  <td className="py-4 text-sm text-slate-600">{pig.breed}</td>
                                  <td className="py-4 text-sm text-slate-600">{pig.type}</td>
                                  <td className="py-4 text-sm text-slate-400 text-center">{pig.date}</td>
                                  <td className="py-4 text-sm font-bold text-emerald-700 text-right">{pig.weight}</td>
                                  <td className="py-4 text-center">
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">{pig.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-6 pt-6 flex justify-between items-center border-t border-slate-50">
                          <p className="text-xs text-slate-400 italic">Hiển thị 2 trên {barn.count} bản ghi</p>
                          <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors border border-slate-100"><ChevronLeft size={16} /></button>
                            <button className="w-8 h-8 rounded-lg bg-emerald-600 text-white text-xs font-bold">1</button>
                            <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 hover:text-emerald-600 transition-colors text-xs font-bold border border-slate-100">2</button>
                            <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors border border-slate-100"><ChevronRight size={16} /></button>
                          </div>
                        </div>
                      </div>

                      {/* Piglet Litter List */}
                      <div className="border-t border-slate-100 pt-8">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[11px] uppercase tracking-[0.2em] text-emerald-600 font-black">Danh sách Đàn lợn con trong chuồng</h3>
                          <div className="text-xs font-bold text-slate-400 uppercase">Tổng số: {barn.piglets} con</div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                                <th className="pb-4 font-semibold">Mã đàn</th>
                                <th className="pb-4 font-semibold">Lợn mẹ</th>
                                <th className="pb-4 font-semibold text-center">Ngày đẻ</th>
                                <th className="pb-4 font-semibold text-center">Số lượng con</th>
                                <th className="pb-4 font-semibold text-right">Cân nặng TB</th>
                                <th className="pb-4 font-semibold text-center">Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {littersInBarn.map((litter, i) => (
                                <tr key={i} className="group hover:bg-emerald-50/30 transition-colors">
                                  <td className="py-4 font-bold text-slate-800">{litter.id}</td>
                                  <td className="py-4 text-sm text-emerald-700 font-medium">{litter.motherId}</td>
                                  <td className="py-4 text-sm text-slate-400 text-center">{litter.date}</td>
                                  <td className="py-4 text-sm font-bold text-slate-900 text-center">{litter.count}</td>
                                  <td className="py-4 text-sm font-bold text-emerald-700 text-right">{litter.avgWeight}</td>
                                  <td className="py-4 text-center">
                                    <span className={cn(
                                      "px-2 py-1 text-[10px] font-bold rounded-full",
                                      litter.status === "Theo dõi sát" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                    )}>{litter.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Empty/Add State */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-5 flex items-center gap-6 cursor-pointer hover:bg-slate-100 transition-colors group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm shrink-0">
            <PlusCircle className="group-hover:scale-110 transition-transform" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-600">Thiết lập chuồng mới</h3>
            <p className="text-xs text-slate-400">Mở rộng quy mô hoạt động bằng cách xác định khu vực chuồng mới.</p>
          </div>
          <button className="px-8 py-3 bg-white text-slate-600 text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-slate-50 border border-slate-200 transition-colors">Cấu hình</button>
        </div>
      </div>

      {/* Facility Map Section */}
      <div className="bg-emerald-50/30 rounded-2xl p-8 border border-emerald-100/50">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-1/3">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Sơ đồ cơ sở chăn nuôi</h3>
            <p className="text-sm text-emerald-800/70 mb-6 leading-relaxed">
              Hệ thống chuồng trại được phân chia theo quy trình vòng đời của đàn lợn. Khu A hiện đang là trọng điểm giám sát với các đơn vị nuôi lợn con ưu tiên cao.
            </p>
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-emerald-100 shadow-sm">
              <ShieldCheck className="text-emerald-600" size={32} />
              <div>
                <p className="text-xs font-bold text-emerald-900 uppercase">An ninh sinh học</p>
                <p className="text-[11px] text-emerald-700">Tất cả các điểm truy cập được giám sát 24/7.</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-2/3 h-64 bg-emerald-100/50 rounded-2xl relative flex items-center justify-center overflow-hidden border border-emerald-200">
            <Image 
              alt="Facility map" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply" 
              src="https://picsum.photos/seed/farm-map/1200/600"
              fill
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10 flex flex-col items-center">
              <MapPin className="text-emerald-600 animate-bounce drop-shadow-lg" size={48} />
              <span className="mt-2 text-xs font-bold text-emerald-900 bg-white px-4 py-1.5 rounded-full shadow-md border border-emerald-100">Khu A đang chọn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
