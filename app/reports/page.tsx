"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter,
  ArrowUpRight,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "motion/react";

const monthlyData = [
  { name: "T1", revenue: 4000, cost: 2400 },
  { name: "T2", revenue: 3000, cost: 1398 },
  { name: "T3", revenue: 2000, cost: 9800 },
  { name: "T4", revenue: 2780, cost: 3908 },
  { name: "T5", revenue: 1890, cost: 4800 },
  { name: "T6", revenue: 2390, cost: 3800 },
  { name: "T7", revenue: 3490, cost: 4300 },
];

const categoryData = [
  { name: "Thức ăn", value: 400, color: "#006c49" },
  { name: "Phân bón", value: 300, color: "#10b981" },
  { name: "Thuốc", value: 300, color: "#34d399" },
  { name: "Khác", value: 200, color: "#6ee7b7" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-manrope tracking-tight">Báo cáo & Phân tích</h2>
          <p className="text-gray-500 mt-2 font-medium">Phân tích chuyên sâu về hiệu quả kinh doanh của trang trại.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
            <Calendar size={18} />
            Tháng này
          </button>
          <button className="px-6 py-3 bg-[#006c49] text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
            <Download size={18} />
            Xuất báo cáo PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-gray-900 font-manrope">Doanh thu vs Chi phí</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#006c49]" />
                <span className="text-xs font-bold text-gray-500">Doanh thu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-200" />
                <span className="text-xs font-bold text-gray-500">Chi phí</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
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
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Bar dataKey="revenue" fill="#006c49" radius={[6, 6, 0, 0]} />
                <Bar dataKey="cost" fill="#a7f3d0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 font-manrope mb-10">Cơ cấu Doanh thu</h3>
          <div className="h-[250px] w-full mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-bold text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
