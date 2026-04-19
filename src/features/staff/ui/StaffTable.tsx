'use client'

import React from 'react';
import { Eye, Edit, Trash2, User } from 'lucide-react';

interface StaffTableProps {
  staffs: any[];
  loading: boolean;
  onEdit: (staff: any) => void;
  onDelete: (staff: any) => void;
  onView: (staff: any) => void;
}

export function StaffTable({ staffs, loading, onEdit, onDelete, onView }: StaffTableProps) {
  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold">
        Đang tải dữ liệu nhân sự...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-1.5 text-[9px] uppercase font-black text-slate-900 tracking-widest leading-none">Cán bộ / Nhân viên</th>
            <th className="px-6 py-1.5 text-[9px] uppercase font-black text-slate-900 tracking-widest leading-none">Chức vụ / Vị trí</th>
            <th className="px-6 py-1.5 text-[9px] uppercase font-black text-slate-900 tracking-widest leading-none">Thông tin Liên hệ</th>
            <th className="px-6 py-1.5 text-[9px] uppercase font-black text-slate-900 tracking-widest leading-none text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {staffs.map((staff) => (
            <tr key={staff.id} className="hover:bg-slate-50 transition-all group cursor-pointer" onClick={() => onView(staff)}>
              <td className="px-6 py-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-black text-xs">
                    {staff.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 leading-none text-[13px]">{staff.full_name}</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5 font-bold">{staff.employee_id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-1.5">
                <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100 text-[9px] font-black uppercase tracking-widest">
                  {staff.position}
                </span>
              </td>
              <td className="px-6 py-1.5">
                 <p className="text-[13px] font-bold text-slate-700 leading-none">{staff.phone}</p>
                 <p className="text-[9px] text-slate-400 font-medium mt-0.5">{staff.email}</p>
              </td>
              <td className="px-6 py-1.5 text-right">
                <div className="flex justify-end gap-1.5 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onView(staff); }}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 transition-all"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(staff); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-all"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(staff); }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-all"
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

