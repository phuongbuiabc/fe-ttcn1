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
  ShoppingCart,
  Venus,
  Mars,
  Warehouse,
  History,
  AlertTriangle,
  Zap,
  Syringe,
  BellDot
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "motion/react";
import { cn } from "../shared/lib/utils";

const weightGrowthData = [
  { day: "Ng1", meat: 30, piglet: 10 },
  { day: "Ng3", meat: 35, piglet: 12 },
  { day: "Ng5", meat: 45, piglet: 15 },
  { day: "Ng7", meat: 42, piglet: 18 },
  { day: "Ng9", meat: 55, piglet: 20 },
  { day: "Ng11", meat: 60, piglet: 22 },
  { day: "Ng13", meat: 68, piglet: 25 },
  { day: "Nay", meat: 120, piglet: 30 },
];

const feedConsumptionData = [
  { day: "T2", value: 60 },
  { day: "T3", value: 75 },
  { day: "T4", value: 85 },
  { day: "T5", value: 70 },
  { day: "T6", value: 90 },
  { day: "T7", value: 65 },
  { day: "CN", value: 80 },
];

const fcrData = [
  { week: "Tuần 1", value: 3.0 },
  { week: "Tuần 2", value: 2.8 },
  { week: "Tuần 3", value: 2.5 },
  { week: "Tuần 4", value: 2.2 },
  { week: "Hiện tại", value: 2.0 },
];

const weightDistData = [
  { range: "0-20", count: 15 },
  { range: "20-40", count: 25 },
  { range: "40-60", count: 50 },
  { range: "60-80", count: 85 },
  { range: "80-100", count: 60 },
  { range: "100-120", count: 35 },
  { range: "120+", count: 10 },
];

const survivalData = [
  { name: "Sống", value: 96, color: "#10b981" },
  { name: "Rủi ro", value: 4, color: "#e2e8f0" },
];

const stats = [
  { 
    title: "Số nái", 
    value: "450", 
    change: "+5%", 
    trend: "up", 
    icon: Venus,
    color: "primary",
    accent: "bg-[#006c49]",
    desc: ""
  },
  { 
    title: "Số nọc", 
    value: "25", 
    change: "Đang hoạt động tốt", 
    trend: "neutral", 
    icon: Mars,
    color: "secondary",
    accent: "bg-[#1b6b51]",
    desc: ""
  },
  { 
    title: "Số lợn con", 
    value: "1,850", 
    change: "Sống sót: 96%", 
    trend: "neutral", 
    icon: Baby,
    color: "primary-container",
    accent: "bg-[#10b981]",
    desc: ""
  },
  { 
    title: "Mang thai", 
    value: "120", 
    change: "12 dự sinh tuần này", 
    trend: "neutral", 
    icon: Stethoscope,
    color: "emerald",
    accent: "bg-emerald-600",
    desc: ""
  },
  { 
    title: "Thức ăn", 
    value: "12.4k", 
    unit: "kg",
    change: "Đủ 14 ngày", 
    trend: "neutral", 
    icon: Package,
    color: "primary",
    accent: "bg-[#006c49]",
    desc: ""
  },
  { 
    title: "Bất thường", 
    value: "12", 
    change: "Cần kiểm tra", 
    trend: "down", 
    icon: AlertCircle,
    color: "error",
    accent: "bg-[#ba1a1a]",
    desc: ""
  },
];

const alerts = [
  { 
    category: "Sức khỏe", 
    time: "Vừa xong", 
    title: "Đến hạn tiêm chủng Lô B-12", 
    desc: "Lịch trình đã quá hạn 4 ngày. Cần xử lý ngay.", 
    action: "Xử lý ngay", 
    color: "text-[#ba1a1a]", 
    bgColor: "bg-red-50/50", 
    borderColor: "border-[#ba1a1a]" 
  },
  { 
    category: "Kho bãi", 
    time: "2 giờ trước", 
    title: "Sắp hết thức ăn tại Chuồng 3", 
    desc: "Mức dự trữ còn 12%. Dự kiến hết trong: 18 giờ.", 
    action: "Đặt hàng", 
    color: "text-amber-600", 
    bgColor: "bg-slate-50", 
    borderColor: "border-amber-500" 
  },
  { 
    category: "Sinh sản", 
    time: "5 giờ trước", 
    title: "Nái #452 bắt đầu sinh", 
    desc: "Ghi nhận 4 con khỏe mạnh.", 
    action: "", 
    color: "text-[#006c49]", 
    bgColor: "bg-slate-50", 
    borderColor: "border-[#006c49]" 
  },
  { 
    category: "Môi trường", 
    time: "8 giờ trước", 
    title: "Nhiệt độ Chuồng 5 tăng cao", 
    desc: "Cần điều chỉnh hệ thống làm mát.", 
    action: "", 
    color: "text-[#1b6b51]", 
    bgColor: "bg-slate-50", 
    borderColor: "border-[#1b6b51]" 
  },
];

const recentActivities = [
  { event: "Đã thêm lô mới", desc: "250 lợn con - B-129", time: "2h", icon: PlusCircle, iconColor: "text-emerald-600", bgColor: "bg-emerald-50" },
  { event: "Chuyển sang Chuồng 5", desc: "Nái #882 - G-02", time: "5h", icon: MoveDown, iconColor: "text-blue-600", bgColor: "bg-blue-50" },
  { event: "Cập nhật vật tư", desc: "Nhập 500kg thức ăn", time: "8h", icon: Package, iconColor: "text-amber-600", bgColor: "bg-amber-50" },
  { event: "Tiêm chủng xong", desc: "Lô thịt C-42", time: "12h", icon: Stethoscope, iconColor: "text-purple-600", bgColor: "bg-purple-50" },
];

export default function Dashboard() {
  return (
    <div className="space-y-4">
      {/* Hero Statistics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "bg-white rounded-xl p-3 relative overflow-hidden group border border-slate-100 shadow-sm",
              stat.color === "error" && "bg-red-50/10 border-red-100"
            )}
          >
            <div className={cn("absolute top-0 left-0 w-1 h-full", stat.accent)}></div>
            <div className="flex justify-between items-start mb-1">
              <p className={cn(
                "text-[9px] font-bold uppercase tracking-wider",
                stat.color === "error" ? "text-[#ba1a1a]" : "text-slate-400"
              )}>{stat.title}</p>
              <div className={cn(
                "p-1 rounded-full",
                stat.color === "primary" ? "bg-emerald-50 text-emerald-600" :
                stat.color === "secondary" ? "bg-teal-50 text-teal-600" :
                stat.color === "primary-container" ? "bg-emerald-50 text-emerald-500" :
                stat.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                "bg-red-50 text-red-600"
              )}>
                <stat.icon size={16} />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-headline">
              {stat.value}
              {stat.unit && <span className="text-xs font-bold ml-0.5">{stat.unit}</span>}
            </h3>
            <div className={cn(
              "mt-1 flex items-center gap-1 text-[9px] font-bold",
              stat.color === "error" ? "text-[#ba1a1a]" : 
              stat.color === "primary" ? "text-emerald-600" :
              stat.color === "secondary" ? "text-teal-700" :
              stat.color === "primary-container" ? "text-emerald-500" : "text-emerald-600"
            )}>
              {stat.trend === "up" && <TrendingUp size={10} />}
              {stat.color === "error" && <AlertCircle size={10} />}
              <span className="truncate">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Charts Area (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Weight Growth Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight font-headline">Tăng trưởng Cân nặng Trung bình</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Xu hướng 14 ngày (kg)</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></div>
                  <span className="text-[9px] font-bold text-slate-600">Thịt</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8bd6b6]"></div>
                  <span className="text-[9px] font-bold text-slate-600">Con</span>
                </div>
              </div>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
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
                    dataKey="meat" 
                    stroke="#006c49" 
                    strokeWidth={2.5} 
                    fill="transparent" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="piglet" 
                    stroke="#8bd6b6" 
                    strokeWidth={2.5} 
                    fill="transparent" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feed Consumption */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight font-headline">Tiêu thụ thức ăn theo ngày</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Nhật ký hàng tuần (kg)</p>
              </div>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feedConsumptionData}>
                    <Bar dataKey="value" fill="#10b981" radius={[2, 2, 0, 0]} barSize={20} />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
                    />
                    <Tooltip cursor={{fill: 'transparent'}} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* FCR Index */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight font-headline">Chỉ số FCR theo tuần</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Hiệu quả chuyển đổi thức ăn</p>
              </div>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fcrData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="week" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
                    />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#1b6b51" 
                      strokeWidth={2.5} 
                      dot={{ r: 3, fill: '#1b6b51' }}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weight Distribution */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight font-headline">Phân bố trọng lượng đàn</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Phân bổ trọng lượng đàn (kg)</p>
              </div>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weightDistData}>
                    <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                      {weightDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? "#006c49" : "#e2e8f0"} />
                      ))}
                    </Bar>
                    <XAxis 
                      dataKey="range" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 700 }}
                    />
                    <Tooltip cursor={{fill: 'transparent'}} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Survival Rate */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight font-headline">Tỷ lệ Sống sót trung bình</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Lợn con sống sót khi sinh</p>
              </div>
              <div className="flex items-center justify-around h-40">
                <div className="relative w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={survivalData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={50}
                        paddingAngle={0}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {survivalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-900 leading-none">96%</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Tỷ lệ</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {survivalData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
                      <div className="text-left">
                        <p className="text-[8px] font-bold text-slate-600 uppercase">{item.name}</p>
                        <p className="text-xs font-extrabold">{item.value}.0%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Activity (4 cols) */}
        <div className="col-span-12 lg:col-span-4 h-full">
          <div className="sticky top-20 flex flex-col gap-4 bg-slate-100/50 p-4 rounded-2xl border border-slate-200/50 h-[calc(100vh-104px)]">
            {/* Urgent Alerts Section (60%) */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col h-[60%]">
              <div className="flex items-center gap-2 mb-4 shrink-0">
                <BellDot className="text-[#ba1a1a]" size={20} />
                <h2 className="text-base font-bold text-slate-900 font-headline">Cảnh báo Khẩn cấp</h2>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {alerts.map((alert, i) => (
                  <div key={i} className={cn("p-3 rounded-lg border-l-4", alert.bgColor, alert.borderColor)}>
                    <div className="flex justify-between items-start mb-0.5">
                      <p className={cn("text-[9px] font-bold uppercase tracking-wider", alert.color)}>{alert.category}</p>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">{alert.time}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{alert.title}</p>
                    <p className="text-[10px] text-slate-600 mt-1 leading-tight">{alert.desc}</p>
                    {alert.action && (
                      <button className={cn("mt-2 text-[9px] font-bold flex items-center gap-1 hover:underline", alert.color)}>
                        <span>{alert.action}</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Section (40%) */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col h-[40%]">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-base font-bold text-slate-900 font-headline">Hoạt động Gần đây</h2>
                <button className="text-[10px] font-bold text-emerald-600 hover:underline">Tất cả</button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                    <div className={cn("w-7 h-7 shrink-0 rounded-full flex items-center justify-center", act.bgColor, act.iconColor)}>
                      <act.icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-[11px] font-bold text-slate-900 truncate">{act.event}</p>
                        <span className="text-[8px] text-slate-400 font-bold">{act.time}</span>
                      </div>
                      <p className="text-[9px] text-slate-500 truncate">{act.desc}</p>
                    </div>
                  </div>
                ))}
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

