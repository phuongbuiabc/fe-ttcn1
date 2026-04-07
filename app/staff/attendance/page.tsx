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
  AlertCircle,
  Users,
  UserMinus,
  UserCheck,
  Filter,
  MoreVertical,
  FileText,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import AttendanceModal from "@/components/AttendanceModal";
import Image from "next/image";

const attendanceHistory = [
  { day: "Thứ Hai, 23/10", clockIn: "07:58", clockOut: "17:05", total: "8h 07m", status: "Đúng giờ" },
  { day: "Thứ Sáu, 20/10", clockIn: "08:15", clockOut: "17:00", total: "7h 45m", status: "Trễ 15p" },
  { day: "Thứ Năm, 19/10", clockIn: "07:45", clockOut: "17:15", total: "8h 30m", status: "Đúng giờ" },
];

const staffAttendance = [
  {
    id: "STF-001",
    name: "Nguyễn Văn An",
    role: "Kỹ thuật viên",
    shift: "Ca Sáng",
    clockIn: "07:55",
    clockOut: "16:05",
    status: "Đúng giờ",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDL8c1W25-6XZMX2fYA7OvVQGBpcy6PtDUUteEbC-HDP_e2NMi7ndT7cUcY6w5OY6mZTMXIOF51j53HnXDoh3ROxZwuYcuuHMWK7zy5eiS6XdtqnqicRx3sfom1d_XqcOEE09hLF0PRWi8pumphRnjHZOHi2CfGscXUSNZfosfKWu8Bbm5tYr_VeLIP4FvN-r2kQe5YeqUJwXXgdCFWwJn1utNQNsuF-h8mG3lfQLLS_Dtrd-wLF6mx6ZLWgGBoCREFWj6xDJp9Wpz3"
  },
  {
    id: "STF-002",
    name: "Lê Thị Mai",
    role: "Quản kho",
    shift: "Ca Sáng",
    clockIn: "08:15",
    clockOut: "--:--",
    status: "Đi trễ",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpJ6-TabenEt6-WZjaJMYLbzMmnIviehuNRMG79Nk-UFTAjXvgRYamqRIU9suMfEOQ5nAwFXnNMPaJQelD6TXKgbVrx5jmupyPuVY2QFv_ifYX02b3Im7c51cvUUpnIhs3G6zSxVw10uoGrbyQ1HJUDEQN98LnYrniqnEUbwIqNzwyd3aN2Y-egWl_oGr3pLEepME3Zdcb9peVQ60kxuJZsmRtRvpg7drfjzUw3o5K2uQ9IZzRixXYNPQrjTD2NODbxe8RVogLZqaD"
  },
  {
    id: "STF-003",
    name: "Trần Minh Hoàng",
    role: "Bác sĩ thú y",
    shift: "Ca Chiều",
    clockIn: "--:--",
    clockOut: "--:--",
    status: "Vắng mặt",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGhFL7zJy-E4jieXYYztWGZ0PD8rImanB_qGT_7DLvLYyHt21dtyixTLz4Q713aM26FxoLXYKSkyUCx4jEUrnjmBAEQbCW2kKV3z5bRAjphCWN3hYEchC-8SE2gYiFMwAN9gnW8aHUY6etfpAuxTmc62eEOb9nlONu6zIh1WYyRHzPk46aStyIKQ9HLOb3DewY97Q1q72lsxWGZrY4fTcDNWJoA62zpBj9hatFuD5HDMqZWk3wgosBNfSVdrngG4lCgjkkH6_iHWET"
  },
  {
    id: "STF-004",
    name: "Phạm Quốc Cường",
    role: "Bảo vệ",
    shift: "Ca Đêm",
    clockIn: "21:50",
    clockOut: "06:05",
    status: "Đúng giờ",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3HfDe2ypumLgfgyPYOG7Ru2N8zxWcO7ggeOa7s75gcXpucmvUoTV-GK2k96rkE9S8RVuB4Anqgp0zBUuyw-e77KpC5C3o70Ujjc5IRJHBuOzALh_dsLY3Rid0xiHhqEJmBwbRzTQOqjvg_UbZCbwOabH317vhq1PY2Wq3xkPl6fhxai-c5Iq-bvbIwf7OoKhvPULzTmgx84ZCCf3DjoWgTtcVpEXRqSCDAZaqjYwkvyQr_qS_AK6HYCq7WuL4d_Xboqr-2Ep1vIyb"
  }
];

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (attendance: any) => {
    setSelectedAttendance(attendance);
    setIsModalOpen(true);
  };

  const filteredAttendance = staffAttendance.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Tất cả trạng thái" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Chấm công</h1>
          <p className="text-slate-500 mt-1 font-medium">Theo dõi thời gian làm việc và chuyên cần của đội ngũ MDFARM.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
            <Download size={18} />
            Xuất báo cáo
          </button>
          <button className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2">
            <Fingerprint size={18} />
            Chấm công vào
          </button>
          <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2">
            <LogOut size={18} />
            Chấm công ra
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Tổng nhân sự</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">48</h3>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Users size={14} />
            <span className="text-xs font-bold">Đang trong danh sách</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] border-l-4 border-emerald-500">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Có mặt hôm nay</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-2">42</h3>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <UserCheck size={14} />
            <span className="text-xs font-bold">87.5% tỷ lệ có mặt</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] border-l-4 border-amber-500">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Đi trễ</p>
            <h3 className="text-3xl font-black text-amber-600 mt-2">04</h3>
          </div>
          <div className="flex items-center gap-2 text-amber-600">
            <Clock size={14} />
            <span className="text-xs font-bold">Cần nhắc nhở</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px] border-l-4 border-red-500">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Vắng mặt</p>
            <h3 className="text-3xl font-black text-red-600 mt-2">02</h3>
          </div>
          <div className="flex items-center gap-2 text-red-600">
            <UserMinus size={14} />
            <span className="text-xs font-bold">Chưa có lý do</span>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-grow">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên, ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-slate-700 font-medium"
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-50 border-none rounded-xl pl-4 pr-10 py-3 text-xs font-bold text-slate-600 outline-none ring-1 ring-slate-200 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              <option>Tất cả trạng thái</option>
              <option>Đúng giờ</option>
              <option>Đi trễ</option>
              <option>Vắng mặt</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
          <div className="relative">
            <input 
              type="date" 
              className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-600 outline-none ring-1 ring-slate-200 focus:ring-emerald-500 transition-all cursor-pointer"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nhân viên</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ca làm</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giờ vào</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giờ ra</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAttendance.map((item, i) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
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
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {item.shift}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className={cn("text-sm font-bold", item.clockIn === "--:--" ? "text-slate-300" : "text-slate-700")}>
                      {item.clockIn}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className={cn("text-sm font-bold", item.clockOut === "--:--" ? "text-slate-300" : "text-slate-700")}>
                      {item.clockOut}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      item.status === "Đúng giờ" ? "bg-emerald-50 text-emerald-600" : 
                      item.status === "Đi trễ" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 font-headline flex items-center gap-2">
              <BarChart3 className="text-emerald-600" size={24} />
              Biểu đồ Chuyên cần Tháng
            </h3>
            <button className="text-xs font-bold text-emerald-600 hover:underline">Xem chi tiết</button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[45, 52, 48, 61, 55, 67, 72, 65, 58, 63, 70, 75].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-slate-100 rounded-t-lg group-hover:bg-emerald-500 transition-all relative"
                  style={{ height: `${val}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {val}% có mặt
                  </div>
                </div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">T{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#00422b] to-[#006c49] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold font-headline mb-2">Báo cáo Nhanh</h3>
              <p className="text-emerald-200/80 text-sm font-medium">Tỷ lệ chuyên cần toàn trang trại đang ở mức rất tốt.</p>
            </div>
            
            <div className="py-8">
              <div className="text-6xl font-black font-headline tracking-tighter">92.4%</div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mt-2">Chỉ số trung bình tháng</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-200">Khu A (Chuồng nái)</span>
                <span>98%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[98%]" />
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-200">Khu B (Chuồng thịt)</span>
                <span>89%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[89%]" />
              </div>
            </div>
          </div>
          <Fingerprint size={180} className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      <AttendanceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        attendance={selectedAttendance}
      />
    </div>
  );
}
