'use client'

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for Recharts to improve bundle size and initial load speed
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

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

export function MainCharts() {
  return (
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
  );
}
