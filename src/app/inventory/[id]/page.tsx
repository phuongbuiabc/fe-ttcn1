"use client";

import React, { use } from "react";
import { 
  ArrowLeft, 
  ChevronRight, 
  Package, 
  History, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown,
  Edit3,
  Trash2,
  Plus,
  Minus
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const stockHistory = [
  { date: "01/04", stock: 400 },
  { date: "02/04", stock: 450 },
  { date: "03/04", stock: 420 },
  { date: "04/04", stock: 480 },
  { date: "05/04", stock: 450 },
];

const transactions = [
  { id: "TX001", type: "Nhập kho", amount: "+100 kg", date: "04/04/2024", user: "Nguyễn Văn A", status: "Hoàn thành" },
  { id: "TX002", type: "Xuất kho", amount: "-50 kg", date: "03/04/2024", user: "Trần Thị B", status: "Hoàn thành" },
  { id: "TX003", type: "Xuất kho", amount: "-30 kg", date: "02/04/2024", user: "Lê Văn C", status: "Hoàn thành" },
  { id: "TX004", type: "Nhập kho", amount: "+150 kg", date: "01/04/2024", user: "Nguyễn Văn A", status: "Hoàn thành" },
];

export default function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="space-y-10">
      {/* Breadcrumbs & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/inventory" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-[#006c49] hover:bg-emerald-50 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
            <Link href="/inventory" className="hover:text-gray-600 transition-colors">Kho vật tư</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900">Bột bắp cao cấp</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
            <Edit3 size={20} />
          </button>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Product Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm">
            <div className="h-64 relative">
              <Image 
                src="https://picsum.photos/seed/corn/800/600" 
                alt="Bột bắp cao cấp" 
                fill
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-900/20">
                  Còn hàng
                </span>
              </div>
            </div>
            <div className="p-10">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Thức ăn chăn nuôi</p>
              <h1 className="text-3xl font-bold text-gray-900 font-manrope mb-6">Bột bắp cao cấp</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Bột bắp được tuyển chọn từ những hạt bắp chất lượng nhất, giàu dinh dưỡng, phù hợp cho nhiều loại gia súc, gia cầm. Đã qua kiểm định an toàn thực phẩm.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-sm font-bold text-gray-500">Mã vật tư</span>
                  <span className="text-sm font-bold text-gray-900">BB-001</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-sm font-bold text-gray-500">Đơn vị tính</span>
                  <span className="text-sm font-bold text-gray-900">Kilogram (kg)</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-sm font-bold text-gray-500">Đơn giá nhập</span>
                  <span className="text-sm font-bold text-gray-900">25.000đ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-900/40">
            <h3 className="text-xl font-bold font-manrope mb-6">Thao tác nhanh</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-6 bg-white/10 backdrop-blur-md rounded-3xl hover:bg-white/20 transition-all flex flex-col items-center gap-3 border border-white/10">
                <Plus size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Nhập kho</span>
              </button>
              <button className="p-6 bg-white/10 backdrop-blur-md rounded-3xl hover:bg-white/20 transition-all flex flex-col items-center gap-3 border border-white/10">
                <Minus size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Xuất kho</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & History */}
        <div className="lg:col-span-2 space-y-10">
          {/* Stock Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Package size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  <ArrowUp size={14} />
                  +12%
                </div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Tồn kho hiện tại</p>
              <p className="text-3xl font-bold text-gray-900 font-manrope">450 <span className="text-sm font-medium text-gray-400">kg</span></p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <TrendingUp size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  <ArrowUp size={14} />
                  +8%
                </div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Tiêu thụ trung bình</p>
              <p className="text-3xl font-bold text-gray-900 font-manrope">15.2 <span className="text-sm font-medium text-gray-400">kg/ngày</span></p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-manrope">Biến động tồn kho</h3>
                <p className="text-sm text-gray-500 mt-1">Lịch sử thay đổi trong 7 ngày qua</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-emerald-50 text-[#006c49] rounded-xl text-xs font-bold">7 ngày</button>
                <button className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-xs font-bold">30 ngày</button>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stock" 
                    stroke="#006c49" 
                    strokeWidth={4} 
                    dot={{ fill: '#006c49', strokeWidth: 2, r: 6, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 text-gray-500 rounded-2xl">
                  <History size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-manrope">Lịch sử giao dịch</h3>
              </div>
              <button className="text-sm font-bold text-emerald-600 hover:underline">Tải xuống CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loại</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số lượng</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngày</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Người thực hiện</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((tx, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            tx.type === "Nhập kho" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                          )}>
                            {tx.type === "Nhập kho" ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{tx.type}</span>
                        </div>
                      </td>
                      <td className={cn(
                        "px-10 py-6 text-sm font-bold",
                        tx.type === "Nhập kho" ? "text-emerald-600" : "text-blue-600"
                      )}>{tx.amount}</td>
                      <td className="px-10 py-6 text-sm font-medium text-gray-400">{tx.date}</td>
                      <td className="px-10 py-6 text-sm font-bold text-gray-900">{tx.user}</td>
                      <td className="px-10 py-6">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
