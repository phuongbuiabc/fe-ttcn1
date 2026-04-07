"use client";

import React, { useState } from "react";
import { 
  ArrowUpRight, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Truck,
  User,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  TrendingUp,
  Scale,
  DollarSign
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// --- Types ---

interface ExportRecord {
  id: string;
  date: string;
  customer: string;
  type: string;
  quantity: number;
  weight: string;
  totalAmount: string;
  status: string;
  staff: string;
}

interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const exportRecords: ExportRecord[] = [
  { 
    id: "EXP-2024-001", 
    date: "21/05/2026", 
    customer: "Lò mổ Xuyên Á", 
    type: "Lợn thịt", 
    quantity: 120, 
    weight: "12,500 kg", 
    totalAmount: "850,000,000đ", 
    status: "Đã thanh toán",
    staff: "Nguyễn Văn A"
  },
  { 
    id: "EXP-2024-002", 
    date: "19/05/2026", 
    customer: "Trang trại Hợp Nhất", 
    type: "Lợn giống", 
    quantity: 30, 
    weight: "1,500 kg", 
    totalAmount: "150,000,000đ", 
    status: "Chờ thanh toán",
    staff: "Trần Thị B"
  },
  { 
    id: "EXP-2024-003", 
    date: "16/05/2026", 
    customer: "Đại lý Thực phẩm Y", 
    type: "Lợn thịt", 
    quantity: 80, 
    weight: "8,200 kg", 
    totalAmount: "560,000,000đ", 
    status: "Đã xuất kho",
    staff: "Lê Văn C"
  },
];

const stats: Stat[] = [
  { label: "Doanh thu tháng này", value: "1.56B", icon: TrendingUp, color: "emerald" },
  { label: "Tổng trọng lượng xuất", value: "22.2T", icon: Scale, color: "blue" },
  { label: "Đơn hàng chờ thanh toán", value: "02", icon: DollarSign, color: "amber" },
];

export default function ExportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <ArrowUpRight size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">Giao dịch</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Bán hàng</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý các đơn hàng xuất bán lợn thịt và lợn giống.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-all active:scale-95">
            <Download size={16} /> Xuất báo cáo
          </button>
          <button className="px-6 py-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
            <Plus size={18} /> Tạo đơn bán mới
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <stat.icon size={64} className={cn(
                stat.color === "emerald" ? "text-emerald-600" : 
                stat.color === "amber" ? "text-amber-500" : "text-blue-500"
              )} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">{stat.label}</p>
            <h3 className="text-3xl font-headline font-black text-slate-900">{stat.value}</h3>
            <div className={cn(
              "mt-4 h-1 w-12 rounded-full",
              stat.color === "emerald" ? "bg-emerald-500" : 
              stat.color === "amber" ? "bg-amber-500" : "bg-blue-500"
            )} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm mã đơn, khách hàng..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <Filter size={20} />
            </button>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button className="px-4 py-1.5 text-xs font-bold bg-white text-emerald-700 rounded-lg shadow-sm">Tất cả</button>
            <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 transition-colors">Chờ thanh toán</button>
            <button className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 transition-colors">Đã xuất kho</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày xuất</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loại hàng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Số lượng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Tổng trọng lượng</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Tổng tiền</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhân viên</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {exportRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 text-sm">{record.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User size={14} />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{record.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.type}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{record.quantity}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right">{record.weight}</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-700 text-right">{record.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit",
                      record.status === "Đã thanh toán" ? "bg-emerald-50 text-emerald-600" : 
                      record.status === "Đã xuất kho" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {record.status === "Đã thanh toán" ? <CheckCircle2 size={12} /> : 
                       record.status === "Đã xuất kho" ? <Package size={12} /> : <DollarSign size={12} />}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.staff}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">Hiển thị 3 trong số 18 đơn bán</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-900/20">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
