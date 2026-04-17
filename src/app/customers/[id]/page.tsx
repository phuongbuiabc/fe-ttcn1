"use client";

import React, { use } from "react";
import { 
  ArrowLeft, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown,
  Edit3,
  Trash2,
  MessageSquare,
  Plus,
  MoreVertical,
  History
} from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const spendingData = [
  { month: "T10", amount: 45000000 },
  { month: "T11", amount: 52000000 },
  { month: "T12", amount: 48000000 },
  { month: "T1", amount: 65000000 },
  { month: "T2", amount: 58000000 },
  { month: "T3", amount: 72000000 },
];

const orders = [
  { id: "ORD-001", date: "02/04/2024", items: "Bột bắp cao cấp (500kg)", total: "12.500.000đ", status: "Hoàn thành" },
  { id: "ORD-002", date: "25/03/2024", items: "Phân bón NPK (10 bao)", total: "8.500.000đ", status: "Hoàn thành" },
  { id: "ORD-003", date: "12/03/2024", items: "Thuốc trừ sâu (5 chai)", total: "600.000đ", status: "Hoàn thành" },
  { id: "ORD-004", date: "01/03/2024", items: "Hạt giống lúa (100kg)", total: "1.800.000đ", status: "Hoàn thành" },
];

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="space-y-10">
      {/* Breadcrumbs & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/customers" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-[#006c49] hover:bg-emerald-50 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
            <Link href="/customers" className="hover:text-gray-600 transition-colors">Khách hàng</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900">Nguyễn Văn A</span>
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
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm">
            <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-800 relative">
              <div className="absolute -bottom-12 left-10">
                <div className="w-24 h-24 bg-white rounded-[2rem] p-1 shadow-xl">
                  <div className="w-full h-full bg-emerald-50 text-emerald-700 rounded-[1.75rem] flex items-center justify-center font-bold text-2xl">
                    NV
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-16 px-10 pb-10">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900 font-manrope">Nguyễn Văn A</h1>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">Hoạt động</span>
              </div>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-8">Đại lý cấp 1</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-bold text-gray-900">vana@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</p>
                    <p className="text-sm font-bold text-gray-900">0901 234 567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Địa chỉ</p>
                    <p className="text-sm font-bold text-gray-900">123 Đường 3/2, Ninh Kiều, Cần Thơ</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ngày tham gia</p>
                    <p className="text-sm font-bold text-gray-900">15 Tháng 06, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-emerald-900/40">
            <h3 className="text-xl font-bold font-manrope mb-6">Tương tác</h3>
            <div className="space-y-4">
              <button className="w-full py-4 bg-white text-[#006c49] rounded-2xl text-sm font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-3">
                <MessageSquare size={20} />
                Gửi tin nhắn
              </button>
              <button className="w-full py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl text-sm font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-3 border border-white/10">
                <Plus size={20} />
                Tạo đơn hàng mới
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Orders */}
        <div className="lg:col-span-2 space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4">
                <ShoppingBag size={20} />
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Tổng đơn hàng</p>
              <p className="text-xl font-bold text-gray-900 font-manrope">45 đơn</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4">
                <TrendingUp size={20} />
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Tổng chi tiêu</p>
              <p className="text-xl font-bold text-gray-900 font-manrope">1.280.000.000đ</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-4">
                <Calendar size={20} />
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Đơn gần nhất</p>
              <p className="text-xl font-bold text-gray-900 font-manrope">02/04/2024</p>
            </div>
          </div>

          {/* Spending Chart */}
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-manrope">Biểu đồ chi tiêu</h3>
                <p className="text-sm text-gray-500 mt-1">Lịch sử chi tiêu 6 tháng gần nhất</p>
              </div>
              <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none ring-1 ring-gray-200">
                <option>6 tháng qua</option>
                <option>1 năm qua</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#006c49" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#006c49" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(value) => `${value/1000000}M`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#006c49" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 text-gray-500 rounded-2xl">
                  <History size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-manrope">Lịch sử đơn hàng</h3>
              </div>
              <button className="text-sm font-bold text-emerald-600 hover:underline">Xem tất cả</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mã đơn</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngày đặt</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tổng tiền</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-10 py-6 text-sm font-bold text-gray-900">{order.id}</td>
                      <td className="px-10 py-6 text-sm font-medium text-gray-400">{order.date}</td>
                      <td className="px-10 py-6 text-sm font-medium text-gray-600">{order.items}</td>
                      <td className="px-10 py-6 text-sm font-bold text-gray-900">{order.total}</td>
                      <td className="px-10 py-6">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {order.status}
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
