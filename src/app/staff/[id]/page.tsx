"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Edit2, 
  Download, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  PlusCircle,
  ClipboardList
} from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

const staffData = {
  "EMP-2041": {
    id: "EMP-2041",
    name: "Phạm Văn Nam",
    role: "Kỹ thuật viên",
    category: "Thú y",
    phone: "090 123 4567",
    email: "nam.pv@agriintel.vn",
    shift: "Ca Sáng (06:00 - 14:00)",
    area: "Khu A - Bò Sữa",
    status: "Đang làm",
    performance: 80,
    attendance: 98.5,
    leaveLeft: 14,
    overtime: 12.5,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGNQo2u1DZ_xoL5qTsa0t0k-jFOFC-sIpSiOuLeHZAcOw-6ekYhq0jSk2qjybEJYKHDZ-MURjb4xL9suwyXklDbKyqwfS-EA5x5zekjF-L_FIIHaF0lPy1Vvj9_tdXnuT8Ffw4cGmfPQD9aNONE8ax2vPARK3kPkuqUlDsqem2lzyHRog3yblqW8GCBIOhRLocju2ISZqqsitTSg6zCK5jg_0urqjb2pudfIYJ48PfNE0nrsNaBgI8ejUzk9aaaZG28kW6btmHQyDN"
  }
};

const scheduleData = [
  { day: "Tứ, 23/10", shift: "Sáng (06:00)", note: "Kiểm tra thú y định kỳ", status: "Đã duyệt" },
  { day: "Năm, 24/10", shift: "Chiều (14:00)", note: "-", status: "Đã duyệt" },
  { day: "Sáu, 25/10", shift: "Tối (22:00)", note: "Trực cấp cứu", status: "Chờ duyệt" }
];

const barnAssignments = [
  { date: "23/10/2024", area: "Khu A (Vắt sữa)", barn: "BARN-A04", task: "Vệ sinh và kiểm soát máy vắt" },
  { date: "24/10/2024", area: "Khu B (Sinh sản)", barn: "BARN-B01", task: "Theo dõi bê con mới sinh" }
];

export default function StaffDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const staff = staffData[id as keyof typeof staffData] || staffData["EMP-2041"];
  const [activeTab, setActiveTab] = useState("Thông tin");

  const tabs = ["Thông tin", "Chấm công", "Nghỉ phép", "Lịch làm việc", "Phân công chuồng"];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link 
        href="/staff" 
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Quay lại danh sách
      </Link>

      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32 rounded-[2.5rem] overflow-hidden ring-4 ring-white shadow-xl">
            <Image 
              src={staff.avatar} 
              alt={staff.name} 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-headline">{staff.name}</h1>
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full ring-1 ring-emerald-100">
                {staff.status}
              </span>
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              Mã NV: <span className="text-slate-900 font-bold">{staff.id}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-emerald-600 font-bold">{staff.role}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Edit2 size={18} />
            Chỉnh sửa
          </button>
          <button className="px-6 py-3 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-8 py-4 text-sm font-bold transition-all relative whitespace-nowrap",
              activeTab === tab ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {activeTab === "Thông tin" ? (
          <>
            {/* Left Column: Info Cards */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Contact Info */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600" />
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block">Thông tin liên lạc</label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Điện thoại</p>
                      <p className="text-sm font-bold text-slate-900">{staff.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                      <p className="text-sm font-bold text-slate-900">{staff.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Info */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block">Vị trí & Ca trực</label>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-500">Chức vụ</span>
                    <span className="text-sm font-bold text-slate-900">{staff.role}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-500">Ca chính</span>
                    <span className="text-sm font-bold text-slate-900">{staff.shift}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-slate-500">Khu vực</span>
                    <span className="text-sm font-bold text-slate-900">{staff.area}</span>
                  </div>
                </div>
              </div>

              {/* Performance Gauge */}
              <div className="bg-gradient-to-br from-[#006c49] to-[#10b981] p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp size={160} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-xl leading-tight">Chỉ số Hiệu suất<br/>Tháng 10</h3>
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" fill="transparent" r="44" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                        <circle 
                          cx="48" cy="48" fill="transparent" r="44" stroke="white" 
                          strokeDasharray="276" strokeDashoffset={276 - (276 * staff.performance) / 100} 
                          strokeWidth="8" strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">{staff.performance}%</div>
                    </div>
                    <p className="text-xs font-medium opacity-90 leading-relaxed max-w-[140px]">
                      Vượt 12% so với định mức chăm sóc khu vực Barn 04.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Tables */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Schedule Section */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-900 font-headline">Lịch làm việc Tuần này</h3>
                  <button className="text-emerald-600 text-sm font-bold flex items-center gap-2 hover:underline">
                    <PlusCircle size={18} />
                    Tạo lịch
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/30">
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ngày</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ca trực</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ghi chú</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {scheduleData.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 text-sm font-bold text-slate-900">{item.day}</td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                              item.shift.includes("Sáng") ? "bg-amber-50 text-amber-600" :
                              item.shift.includes("Chiều") ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                            )}>
                              {item.shift}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm text-slate-500 italic">{item.note}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                item.status === "Đã duyệt" ? "bg-emerald-500" : "bg-slate-300"
                              )} />
                              <span className="text-xs font-bold text-slate-700">{item.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Barn Assignment Section */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-900 font-headline">Phân công Chuồng trại</h3>
                  <button className="text-emerald-600 text-sm font-bold flex items-center gap-2 hover:underline">
                    <ClipboardList size={18} />
                    Phân công
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/30">
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ngày thực hiện</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Khu vực</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Chuồng cụ thể</th>
                        <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Nhiệm vụ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {barnAssignments.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 text-sm font-bold text-slate-900">{item.date}</td>
                          <td className="px-8 py-6 text-sm font-medium text-slate-600">{item.area}</td>
                          <td className="px-8 py-6">
                            <span className="font-mono text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold">
                              {item.barn}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-sm text-slate-500">{item.task}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Stats Bento Grid */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="relative z-10">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-800/60">Tỉ lệ chuyên cần</label>
                  <p className="text-4xl font-black text-emerald-900 mt-2">{staff.attendance}%</p>
                  <div className="mt-6 h-2 w-full bg-emerald-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${staff.attendance}%` }}
                      className="h-full bg-emerald-600" 
                    />
                  </div>
                </div>
                <CheckCircle2 size={120} className="absolute -bottom-4 -right-4 text-emerald-100 group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="bg-amber-50 p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="relative z-10">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-amber-800/60">Ngày nghỉ còn lại</label>
                  <p className="text-4xl font-black text-amber-900 mt-2">{staff.leaveLeft}</p>
                  <p className="text-xs text-amber-700 mt-2 font-bold">Hết hạn vào 31/12/2024</p>
                </div>
                <Calendar size={120} className="absolute -bottom-4 -right-4 text-amber-100 group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="bg-indigo-50 p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="relative z-10">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-800/60">Số giờ tăng ca</label>
                  <p className="text-4xl font-black text-indigo-900 mt-2">{staff.overtime}h</p>
                  <p className="text-xs text-indigo-700 mt-2 font-bold">Tính từ đầu tháng</p>
                </div>
                <Clock size={120} className="absolute -bottom-4 -right-4 text-indigo-100 group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
          </>
        ) : activeTab === "Chấm công" ? (
          <div className="col-span-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Giờ vào TB</p>
                <p className="text-2xl font-black text-slate-900 mt-1">07:52 AM</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Giờ ra TB</p>
                <p className="text-2xl font-black text-slate-900 mt-1">17:08 PM</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Tổng giờ công</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">176h</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Số lần đi trễ</p>
                <p className="text-2xl font-black text-red-500 mt-1">02</p>
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Lịch sử chấm công tháng này</h3>
                <button className="text-sm font-bold text-emerald-600 hover:underline">Xuất file Excel</button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/30">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ngày</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Giờ vào</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Giờ ra</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 text-sm font-bold text-slate-900">2{i}/10/2023</td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600">07:5{i} AM</td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600">05:0{i} PM</td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-lg">Đúng giờ</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "Nghỉ phép" ? (
          <div className="col-span-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                <p className="text-[10px] font-bold uppercase text-emerald-800/60 tracking-widest">Phép năm còn lại</p>
                <p className="text-4xl font-black text-emerald-900 mt-2">12 Ngày</p>
              </div>
              <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                <p className="text-[10px] font-bold uppercase text-blue-800/60 tracking-widest">Đã nghỉ (Năm nay)</p>
                <p className="text-4xl font-black text-blue-900 mt-2">04 Ngày</p>
              </div>
              <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
                <p className="text-[10px] font-bold uppercase text-amber-800/60 tracking-widest">Đơn đang chờ duyệt</p>
                <p className="text-4xl font-black text-amber-900 mt-2">01 Đơn</p>
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Lịch sử nghỉ phép</h3>
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/20">Tạo đơn mới</button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/30">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Thời gian</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Loại nghỉ</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Lý do</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-slate-900">15/06 - 17/06</td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-600">Nghỉ phép năm</td>
                    <td className="px-8 py-6 text-sm text-slate-500 italic">Du lịch gia đình</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded-lg">Chờ duyệt</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="col-span-12 py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Đang cập nhật nội dung cho {activeTab}...</p>
          </div>
        )}
      </div>
    </div>
  );
}
