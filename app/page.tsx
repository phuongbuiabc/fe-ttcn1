"use client";

import React from "react";
import { 
  TrendingUp, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Plus,
  ArrowRight,
  LayoutGrid,
  Baby,
  Stethoscope,
  AlertCircle,
  MoveDown,
  PlusCircle,
  Thermometer,
  Leaf,
  BellRing,
  ShoppingCart
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const herdData = [
  { month: "Tháng 1", value: 1500 },
  { month: "Tháng 2", value: 1800 },
  { month: "Tháng 3", value: 1700 },
  { month: "Tháng 4", value: 2100 },
  { month: "Tháng 5", value: 2300 },
  { month: "Tháng 6", value: 2500 },
];

const stats = [
  { 
    title: "Tổng số lợn", 
    value: "2,500", 
    change: "+4.2% so với tháng trước", 
    trend: "up", 
    icon: Package,
    color: "emerald",
    accent: "bg-[#006c49]"
  },
  { 
    title: "Tổng số lô", 
    value: "45", 
    change: "8 lô đang trong giai đoạn cai sữa", 
    trend: "neutral", 
    icon: LayoutGrid,
    color: "teal",
    accent: "bg-[#1b6b51]"
  },
  { 
    title: "Lợn đang mang thai", 
    value: "320", 
    change: "12 con dự sinh trong 48 giờ tới", 
    trend: "neutral", 
    icon: Baby,
    color: "emerald-container",
    accent: "bg-[#10b981]"
  },
  { 
    title: "Bệnh / Cảnh báo", 
    value: "12", 
    change: "Yêu cầu chú ý ngay lập tức", 
    trend: "down", 
    icon: Stethoscope,
    color: "error",
    accent: "bg-[#ba1a1a]"
  },
];

const activities = [
  { id: "B-129", event: "Đã thêm lô mới", desc: "Nhập 250 lợn con", time: "2 giờ trước", icon: PlusCircle, iconColor: "text-emerald-600", bgColor: "bg-emerald-50" },
  { id: "G-02", event: "Chuyển lợn sang Chuồng 5", desc: "Đã chuyển nái #882", time: "5 giờ trước", icon: MoveDown, iconColor: "text-blue-600", bgColor: "bg-blue-50" },
  { id: "B-12", event: "Hoàn thành kiểm tra y tế", desc: "BS. Hans đã kiểm tra Ô 4", time: "Hôm qua", icon: AlertCircle, iconColor: "text-red-600", bgColor: "bg-red-50" },
  { id: "KHO", event: "Xác nhận nhập thức ăn", desc: "5 tấn Hỗn hợp Ngũ cốc A", time: "24 thg 10", icon: Package, iconColor: "text-amber-600", bgColor: "bg-amber-50" },
];

export default function Dashboard() {
  return (
    <div className="space-y-10">
      {/* Hero Statistics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 relative overflow-hidden group shadow-sm border border-slate-100"
          >
            <div className={cn("absolute top-0 left-0 w-1 h-full", stat.accent)}></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className={cn(
                  "text-4xl font-extrabold tracking-tight font-headline",
                  stat.color === "error" ? "text-[#ba1a1a]" : "text-slate-900"
                )}>{stat.value}</h3>
              </div>
              <div className={cn(
                "p-3 rounded-full",
                stat.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                stat.color === "teal" ? "bg-teal-50 text-teal-600" :
                stat.color === "emerald-container" ? "bg-emerald-50 text-emerald-500" :
                "bg-red-50 text-red-600"
              )}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className={cn(
              "mt-4 flex items-center gap-2 text-xs font-semibold",
              stat.color === "error" ? "text-[#ba1a1a]" : 
              stat.color === "emerald" ? "text-emerald-600" :
              stat.color === "teal" ? "text-teal-700" : "text-emerald-500"
            )}>
              {stat.trend === "up" && <TrendingUp size={14} />}
              {stat.color === "error" && <AlertCircle size={14} />}
              <span>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Middle: Main Chart (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-headline">Biến động Tổng đàn theo Thời gian</h2>
                <p className="text-sm text-slate-500">Xu hướng tăng trưởng (6 tháng qua)</p>
              </div>
              <div className="flex gap-2 bg-slate-50 p-1 rounded-lg">
                <button className="px-4 py-1.5 text-xs font-bold bg-white text-emerald-700 shadow-sm rounded-md">6 Tháng</button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700">1 Năm</button>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={herdData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#006c49" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#chartGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
            <div className="p-6 pb-0 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight font-headline">Hoạt động Gần đây</h2>
              <button className="text-sm font-semibold text-emerald-600 hover:underline">Xem tất cả</button>
            </div>
            <div className="p-6">
              <div className="space-y-0">
                <div className="grid grid-cols-12 gap-4 pb-4 mb-4 border-b border-slate-100">
                  <div className="col-span-5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sự kiện</div>
                  <div className="col-span-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center">Mã Lô</div>
                  <div className="col-span-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Thời gian</div>
                  <div className="col-span-2"></div>
                </div>
                
                {activities.map((act, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 items-center py-4 hover:bg-slate-50 transition-colors rounded-lg group">
                    <div className="col-span-5 flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", act.bgColor, act.iconColor)}>
                        <act.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{act.event}</p>
                        <p className="text-[11px] text-slate-500">{act.desc}</p>
                      </div>
                    </div>
                    <div className="col-span-3 text-center">
                      <span className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-full text-slate-700">{act.id}</span>
                    </div>
                    <div className="col-span-2 text-xs font-medium text-slate-500">{act.time}</div>
                    <div className="col-span-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-emerald-600"><MoreVertical size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Alerts & Mini Stats (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Quick Alerts Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <BellRing className="text-[#ba1a1a]" size={24} />
              <h2 className="text-xl font-bold text-slate-900 font-headline">Cảnh báo Khẩn cấp</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-50/50 border-l-4 border-[#ba1a1a]">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-[#ba1a1a] uppercase tracking-wider">Cảnh báo Sức khỏe</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Vừa xong</span>
                </div>
                <p className="text-sm font-bold text-slate-900">Đến hạn tiêm chủng Lô B-12</p>
                <p className="text-xs text-slate-600 mt-1">Lịch trình đã quá hạn 4 ngày. Cần xử lý ngay để ngăn ngừa lây lan.</p>
                <button className="mt-3 text-xs font-bold text-[#ba1a1a] flex items-center gap-1 hover:underline">
                  <span>Xử lý ngay</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-amber-500">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Kho bãi</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">2 giờ trước</span>
                </div>
                <p className="text-sm font-bold text-slate-900">Sắp hết thức ăn tại Chuồng 3</p>
                <p className="text-xs text-slate-600 mt-1">Mức dự trữ còn 12%. Dự kiến hết trong: 18 giờ.</p>
                <button className="mt-3 text-xs font-bold text-amber-600 flex items-center gap-1 hover:underline">
                  <span>Đặt hàng bổ sung</span>
                  <ShoppingCart size={12} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-[#006c49]">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-[#006c49] uppercase tracking-wider">Nhiệm vụ</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">25 thg 10</span>
                </div>
                <p className="text-sm font-bold text-slate-900">Vệ sinh Chuồng 1</p>
                <p className="text-xs text-slate-600 mt-1">Lịch làm sạch sâu định kỳ hàng quý vào sáng mai.</p>
              </div>
            </div>
          </div>

          {/* Secondary Insight Card */}
          <div className="bg-gradient-to-br from-[#1b6b51] to-[#006c49] p-6 rounded-xl text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Leaf size={180} />
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-2">Năng suất Bền vững</p>
              <h3 className="text-3xl font-extrabold mb-4">98.2%</h3>
              <p className="text-xs opacity-90 leading-relaxed mb-6">Chỉ số sức khỏe đàn lợn của bạn nằm trong top 5% khu vực. Chuyển đổi thức ăn hiệu quả và không có dịch bệnh bùng phát trong tháng này.</p>
              <div className="w-full bg-white/20 h-1.5 rounded-full mb-1">
                <div className="bg-white h-full rounded-full w-[98%]"></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span>Hiệu suất</span>
                <span>98%</span>
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-emerald-600">
              <Thermometer size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Nhiệt độ TB Chuồng</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900">22.4°C</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">Tối ưu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#006c49] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
        <Plus size={32} />
      </button>
    </div>
  );
}
