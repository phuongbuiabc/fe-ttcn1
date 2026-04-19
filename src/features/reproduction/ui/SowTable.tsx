import React from "react";
import { 
  MoreVertical, 
  ChevronRight, 
  Activity,
  Edit,
  Trash2,
  Baby,
  Calendar,
  Eye
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SowRecord } from "@/shared/types";

interface SowTableProps {
  sows: SowRecord[];
  loading: boolean;
  onEdit: (sow: SowRecord) => void;
  onDelete: (id: string) => void;
  onView: (sow: SowRecord) => void;
}

export const SowTable: React.FC<SowTableProps> = ({ sows, loading, onEdit, onDelete, onView }) => {
  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-500 font-bold">Đang tải danh sách nái...</p>
      </div>
    );
  }

  if (sows.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 font-bold">Không có dữ liệu lợn nái.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400 leading-none">Mã Số Nái</th>
            <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400 leading-none">Giống / Đặc điểm</th>
            <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400 leading-none">Chuồng</th>
            <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400 leading-none">Trạng thái</th>
            <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black text-slate-400 leading-none text-center">Tiến độ</th>
            <th className="px-10 py-6 text-right text-[10px] uppercase tracking-widest font-black text-slate-400 leading-none">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sows.map((sow) => (
            <tr key={sow.id} className="hover:bg-slate-50 transition-all group cursor-pointer" onClick={() => onView(sow)}>
              <td className="px-10 py-6">
                <span className="text-emerald-600 font-black tracking-tight uppercase leading-none">{sow.id}</span>
              </td>
              <td className="px-10 py-6 font-black text-slate-900 leading-none">{sow.breed}</td>
              <td className="px-10 py-6">
                <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black rounded-lg border border-slate-100 uppercase tracking-tighter">
                  {sow.pen}
                </span>
              </td>
              <td className="px-10 py-6">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                  sow.status === "PREGNANT" ? "bg-emerald-50 text-emerald-600" : 
                  sow.status === "FARROWING" ? "bg-rose-50 text-rose-600" :
                  "bg-slate-50 text-slate-500"
                )}>
                  {sow.status === "PREGNANT" ? "MANG THAI" : 
                   sow.status === "FARROWING" ? "ĐANG ĐẺ" : "CHỜ PHỐI"}
                </span>
              </td>
              <td className="px-10 py-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${sow.progress || 0}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-800 tracking-tighter">{sow.progress || 0}%</span>
                </div>
              </td>
              <td className="px-10 py-6 text-right">
                <div className="flex justify-end gap-2 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onView(sow); }}
                    className="p-2.5 text-slate-400 hover:text-emerald-600 transition-all"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(sow); }}
                    className="p-2.5 text-slate-400 hover:text-blue-600 transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(sow.id); }}
                    className="p-2.5 text-slate-400 hover:text-rose-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
