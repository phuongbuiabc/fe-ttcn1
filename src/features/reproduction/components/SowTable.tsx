import React from "react";
import { 
  MoreVertical, 
  ChevronRight, 
  Activity,
  Edit,
  Trash2,
  Baby,
  Calendar
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SowRecord } from "@/shared/types";

interface SowTableProps {
  sows: SowRecord[];
  loading: boolean;
  onEdit: (sow: SowRecord) => void;
  onDelete: (id: string) => void;
}

export const SowTable: React.FC<SowTableProps> = ({ sows, loading, onEdit, onDelete }) => {
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
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Mã Số</th>
            <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Giống</th>
            <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Chuồng</th>
            <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Trạng thái</th>
            <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Ngày phối</th>
            <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Tiến độ</th>
            <th className="px-6 py-4 text-right text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sows.map((sow) => (
            <tr key={sow.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-5">
                <span className="text-emerald-600 font-bold tracking-tight">{sow.id}</span>
              </td>
              <td className="px-4 py-5 font-bold text-slate-900">{sow.breed}</td>
              <td className="px-4 py-5 font-medium text-slate-600">{sow.pen}</td>
              <td className="px-4 py-5">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-bold uppercase",
                  sow.status === "PREGNANT" ? "bg-emerald-100 text-emerald-700" : 
                  sow.status === "FARROWING" ? "bg-rose-100 text-rose-700" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {sow.status}
                </span>
              </td>
              <td className="px-4 py-5 text-sm text-slate-500">
                {sow.matingDate || "--/--/----"}
              </td>
              <td className="px-4 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${sow.progress || 0}%` }} 
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{sow.progress || 0}%</span>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <div className="flex justify-end gap-2 text-slate-400">
                  <button 
                    onClick={() => onEdit(sow)}
                    className="p-2 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(sow.id)}
                    className="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
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
