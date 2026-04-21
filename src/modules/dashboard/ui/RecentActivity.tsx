'use client'

import React from 'react';
import { PlusCircle, MoveDown, Package, Stethoscope } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const recentActivities = [
  { event: "Đã thêm lô mới", desc: "250 lợn con - B-129", time: "2h", icon: PlusCircle, iconColor: "text-emerald-600", bgColor: "bg-emerald-50" },
  { event: "Chuyển sang Chuồng 5", desc: "Nái #882 - G-02", time: "5h", icon: MoveDown, iconColor: "text-blue-600", bgColor: "bg-blue-50" },
  { event: "Cập nhật vật tư", desc: "Nhập 500kg thức ăn", time: "8h", icon: Package, iconColor: "text-amber-600", bgColor: "bg-amber-50" },
  { event: "Tiêm chủng xong", desc: "Lô thịt C-42", time: "12h", icon: Stethoscope, iconColor: "text-purple-600", bgColor: "bg-purple-50" },
];

export function RecentActivity() {
  return (
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
  );
}
