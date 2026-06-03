import React from 'react';
import { Package, Calendar, Tag, ShieldAlert, Eye, Pencil, Trash2 } from 'lucide-react';
import { SupplyLoss } from '../../model/inventory.model';

interface IssueTableProps {
  issues: SupplyLoss[];
  loading: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function IssueTable({ issues, loading, onView, onEdit, onDelete }: IssueTableProps) {
  if (loading) {
    return (
      <div className="py-20 text-center font-black text-slate-400 uppercase tracking-widest">
        Đang tải lịch sử xuất...
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="py-20 text-center">
        <Package size={48} className="mx-auto text-slate-200 mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Chưa có lịch sử xuất kho</p>
      </div>
    );
  }

  return (
    <div className="responsive-table">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Vật tư / Mã phiếu</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-center">Ngày xuất</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Lý do xuất</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-center">Số lượng</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Nhân viên</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none text-center w-28">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {issues.map((issue) => (
            <tr 
              key={issue.id} 
              className="hover:bg-slate-50/80 transition-colors group cursor-default"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center font-black text-[10px] shadow-sm">
                    OUT
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 leading-none">{issue.supply_id}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mã: {issue.loss_id?.slice(0, 8)}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Calendar size={13} />
                  <span className="text-xs font-bold text-slate-600">
                    {new Date(issue.date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
                    <ShieldAlert size={12} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 max-w-[200px] truncate">{issue.reason || 'Không có lý do'}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-center">
                <span className="px-3 py-1.5 bg-rose-50 text-rose-600 text-[11px] font-black rounded-xl border border-rose-100/50">
                  {issue.quantity.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                  <Tag size={12} />
                  <span>{issue.employee_id || 'N/A'}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => onView(issue.loss_id)}
                    className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-lg transition-all"
                    title="Xem chi tiết"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => onEdit(issue.loss_id)}
                    className="p-1.5 hover:bg-amber-50 text-slate-400 hover:text-amber-500 rounded-lg transition-all"
                    title="Chỉnh sửa"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(issue.loss_id)}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                    title="Hủy phiếu"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
