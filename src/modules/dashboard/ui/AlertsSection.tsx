'use client'

import React from 'react';
import { BellDot, ArrowRight } from 'lucide-react';
import { cn } from '@/shared/utils/utils';

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

export function AlertsSection() {
  return (
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
  );
}
