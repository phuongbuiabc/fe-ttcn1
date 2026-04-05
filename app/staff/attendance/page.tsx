"use client";

import React, { useState } from "react";
import { 
  Fingerprint, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Search, 
  ChevronDown, 
  BarChart3, 
  ArrowRight,
  Calendar,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const attendanceHistory = [
  { day: "Thứ Hai, 23/10", clockIn: "07:58", clockOut: "17:05", total: "8h 07m", status: "Đúng giờ" },
  { day: "Thứ Sáu, 20/10", clockIn: "08:15", clockOut: "17:00", total: "7h 45m", status: "Trễ 15p" },
  { day: "Thứ Năm, 19/10", clockIn: "07:45", clockOut: "17:15", total: "8h 30m", status: "Đúng giờ" },
];

export default function AttendancePage() {
  const [status, setStatus] = useState("checked-in");

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <nav className="flex text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Nhân sự</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-emerald-600">Chấm công</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Chấm công</h1>
      </div>

      {/* Dashboard Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border-l-4 border-emerald-500 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Giờ vào hôm nay</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">07:55</h3>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 size={14} />
            <span className="text-xs font-bold">Vào ca sớm 5 phút</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border-l-4 border-slate-200 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Giờ ra hôm nay</p>
            <h3 className="text-3xl font-black text-slate-300 mt-2">--:--</h3>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={14} />
            <span className="text-xs font-bold">Chưa kết thúc ca</span>
          </div>
        </div>

        <div className="bg-emerald-50/50 p-6 rounded-[2rem] border-l-4 border-emerald-600 shadow-sm flex flex-col items-center justify-center">
          <p className="text-[10px] uppercase tracking-widest text-emerald-800/60 font-bold mb-3">Trạng thái hiện tại</p>
          <div className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
            Đã chấm công vào
          </div>
          <p className="text-[10px] text-slate-400 mt-4 italic">Cập nhật lúc: 07:55 AM</p>
        </div>

        <div className="flex flex-col gap-3">
          <button className="flex-1 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all group">
            <Fingerprint size={24} className="group-active:scale-90 transition-transform" />
            Chấm công vào
          </button>
          <button className="flex-1 bg-slate-100 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-50 transition-all group">
            <LogOut size={24} className="group-active:scale-90 transition-transform" />
            Chấm công ra
          </button>
        </div>
      </section>

      {/* History Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-headline">Lịch sử chấm công</h2>
            <p className="text-sm text-slate-500 font-medium">Chi tiết các lượt check-in/out trong tuần này</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-sm cursor-pointer">
                <option>Tháng 10, 2023</option>
                <option>Tháng 09, 2023</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl flex items-center px-4 py-2.5 shadow-sm group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <Search className="text-slate-400 group-focus-within:text-emerald-600" size={16} />
              <input className="bg-transparent border-none focus:ring-0 text-sm w-32 ml-2 font-medium text-slate-700" placeholder="Tìm theo ngày..." type="text"/>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Ngày</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Giờ vào</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Giờ ra</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Tổng giờ</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendanceHistory.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-bold text-slate-900">{item.day}</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600">{item.clockIn}</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600">{item.clockOut}</td>
                  <td className="px-8 py-6 text-sm font-black text-emerald-600">{item.total}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      item.status === "Đúng giờ" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Monthly Summary */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-emerald-600" size={24} />
          <h2 className="text-xl font-bold text-slate-900 font-headline">Tổng hợp chuyên cần Tháng 10</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-4 gap-4 pb-6 border-b border-slate-50">
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Thống kê tháng</div>
              <div className="text-center">
                <div className="text-lg font-black text-slate-900">22</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Ngày công</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-red-500">02</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Đi trễ</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-emerald-600">176h</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Tổng giờ làm</div>
              </div>
            </div>

            <div className="space-y-4">
              {[23, 22].map((day) => (
                <div key={day} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-3 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-sm shadow-sm">
                      {day}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Ca hành chính</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sáng - Chiều</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-600">8.0h</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Thực tế</div>
                    </div>
                    <CheckCircle2 className="text-emerald-500" size={20} />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-4 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2 group">
              Xem tất cả báo cáo
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-[#006c49] text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold leading-tight font-headline">Chỉ số<br/>Chuyên cần</h3>
              <p className="text-emerald-200/60 text-xs mt-2 font-medium">Dựa trên 30 ngày gần nhất</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center py-8">
              <div className="text-6xl font-black font-headline tracking-tighter">94%</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-300 mt-3 font-bold">Hạng: Xuất sắc</div>
            </div>

            <div className="relative z-10">
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  className="bg-white h-full rounded-full" 
                />
              </div>
              <p className="text-[10px] mt-4 text-emerald-200/80 font-medium">Bạn đã hoàn thành 94% mục tiêu giờ làm</p>
            </div>

            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
