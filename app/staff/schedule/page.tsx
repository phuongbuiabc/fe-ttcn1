"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar as CalendarIcon, 
  LayoutGrid, 
  List, 
  AlertTriangle, 
  MoreVertical,
  ChevronRight,
  Zap,
  MapPin,
  Clock,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const scheduleItems = [
  {
    date: "24/10/2023",
    day: "Thứ Ba",
    name: "Nguyễn Văn An",
    role: "Kỹ thuật viên",
    shift: "Ca Sáng",
    area: "Khu A / Chuồng 04",
    note: "Kiểm tra sức khỏe đàn bê sơ sinh.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDL8c1W25-6XZMX2fYA7OvVQGBpcy6PtDUUteEbC-HDP_e2NMi7ndT7cUcY6w5OY6mZTMXIOF51j53HnXDoh3ROxZwuYcuuHMWK7zy5eiS6XdtqnqicRx3sfom1d_XqcOEE09hLF0PRWi8pumphRnjHZOHi2CfGscXUSNZfosfKWu8Bbm5tYr_VeLIP4FvN-r2kQe5YeqUJwXXgdCFWwJn1utNQNsuF-h8mG3lfQLLS_Dtrd-wLF6mx6ZLWgGBoCREFWj6xDJp9Wpz3",
    status: "normal"
  },
  {
    date: "24/10/2023",
    day: "Thứ Ba",
    name: "Lê Thị Mai",
    role: "Quản kho",
    shift: "Ca Chiều",
    area: "Khu C / Kho 01",
    note: "Trùng lịch trực tại Khu B",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpJ6-TabenEt6-WZjaJMYLbzMmnIviehuNRMG79Nk-UFTAjXvgRYamqRIU9suMfEOQ5nAwFXnNMPaJQelD6TXKgbVrx5jmupyPuVY2QFv_ifYX02b3Im7c51cvUUpnIhs3G6zSxVw10uoGrbyQ1HJUDEQN98LnYrniqnEUbwIqNzwyd3aN2Y-egWl_oGr3pLEepME3Zdcb9peVQ60kxuJZsmRtRvpg7drfjzUw3o5K2uQ9IZzRixXYNPQrjTD2NODbxe8RVogLZqaD",
    status: "warning"
  },
  {
    date: "25/10/2023",
    day: "Thứ Tư",
    name: "Trần Minh Hoàng",
    role: "Bác sĩ thú y",
    shift: "Ca Sáng",
    area: "Khu A / Chuồng 12",
    note: "Tiêm vaccine định kỳ cho đàn nái.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGhFL7zJy-E4jieXYYztWGZ0PD8rImanB_qGT_7DLvLYyHt21dtyixTLz4Q713aM26FxoLXYKSkyUCx4jEUrnjmBAEQbCW2kKV3z5bRAjphCWN3hYEchC-8SE2gYiFMwAN9gnW8aHUY6etfpAuxTmc62eEOb9nlONu6zIh1WYyRHzPk46aStyIKQ9HLOb3DewY97Q1q72lsxWGZrY4fTcDNWJoA62zpBj9hatFuD5HDMqZWk3wgosBNfSVdrngG4lCgjkkH6_iHWET",
    status: "normal"
  },
  {
    date: "25/10/2023",
    day: "Thứ Tư",
    name: "Phạm Quốc Cường",
    role: "Bảo vệ",
    shift: "Ca Đêm",
    area: "Toàn trang trại",
    note: "Tuần tra vòng ngoài và trạm điện.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3HfDe2ypumLgfgyPYOG7Ru2N8zxWcO7ggeOa7s75gcXpucmvUoTV-GK2k96rkE9S8RVuB4Anqgp0zBUuyw-e77KpC5C3o70Ujjc5IRJHBuOzALh_dsLY3Rid0xiHhqEJmBwbRzTQOqjvg_UbZCbwOabH317vhq1PY2Wq3xkPl6fhxai-c5Iq-bvbIwf7OoKhvPULzTmgx84ZCCf3DjoWgTtcVpEXRqSCDAZaqjYwkvyQr_qS_AK6HYCq7WuL4d_Xboqr-2Ep1vIyb",
    status: "normal"
  }
];

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">
            <span className="hover:text-emerald-600 cursor-pointer transition-colors">Cơ sở dữ liệu</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-emerald-600">Nhân sự</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Lịch làm việc toàn trang trại</h1>
          <p className="text-slate-500 mt-1 font-medium">Quản lý lịch trình vận hành hệ thống AgriIntel.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-emerald-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Zap size={18} />
            Phân công nhanh
          </button>
          <button className="px-6 py-3 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
            <Plus size={18} />
            Tạo lịch
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setViewMode("calendar")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              viewMode === "calendar" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <LayoutGrid size={18} />
            Calendar View
          </button>
          <button 
            onClick={() => setViewMode("table")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              viewMode === "table" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <List size={18} />
            Table View
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên, khu vực..." 
              className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-slate-700 font-medium"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all">
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
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Khu & Chuồng</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ghi chú</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {scheduleItems.map((item, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "hover:bg-slate-50/50 transition-colors group",
                    item.status === "warning" && "bg-red-50/30 border-l-4 border-red-500"
                  )}
                >
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-900">{item.date}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{item.day}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-100">
                        <Image 
                          src={item.avatar} 
                          alt={item.name} 
                          fill 
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{item.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      item.shift.includes("Sáng") ? "bg-amber-50 text-amber-600" :
                      item.shift.includes("Chiều") ? "bg-blue-50 text-blue-600" : 
                      item.shift.includes("Đêm") ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      {item.shift}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-emerald-500" />
                      <p className="text-sm font-bold text-slate-700">{item.area}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {item.status === "warning" ? (
                      <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
                        <AlertTriangle size={14} />
                        {item.note}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">{item.note}</p>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nhân sự trực hôm nay</label>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-black text-emerald-600">24</h3>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 mb-1">
              <TrendingUp size={14} /> 100%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Số ca làm việc</label>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-black text-slate-900">42</h3>
            <p className="text-slate-400 text-xs font-bold mb-1">Ca/Tuần</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cảnh báo trùng lịch</label>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-black text-red-500">02</h3>
            <span className="text-red-400 text-xs font-bold mb-1">Cần xử lý</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm border-l-4 border-emerald-500">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tỷ lệ lấp đầy ca</label>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-black text-slate-900">94%</h3>
            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className="bg-emerald-500 h-full w-[94%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
