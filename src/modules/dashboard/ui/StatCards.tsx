'use client'

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Venus, Mars, Baby, Stethoscope, Package, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils/utils';

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

export function StatCards() {
  return (
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
  );
}
