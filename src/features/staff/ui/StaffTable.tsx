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
            <th className="px-10 py-6 text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Cán bộ / Nhân viên</th>
            <th className="px-10 py-6 text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Chức vụ / Vị trí</th>
            <th className="px-10 py-6 text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Thông tin Liên hệ</th>
            <th className="px-10 py-6 text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {staffs.map((staff) => (
            <tr key={staff.id} className="hover:bg-slate-50 transition-all group cursor-pointer" onClick={() => onView(staff)}>
              <td className="px-10 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black">
                    {staff.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 leading-none">{staff.full_name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1.5 font-bold">{staff.employee_id}</p>
                  </div>
                </div>
              </td>
              <td className="px-10 py-6">
                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-100 text-[10px] font-black uppercase tracking-widest">
                  {staff.position}
                </span>
              </td>
              <td className="px-10 py-6">
                 <p className="text-sm font-bold text-slate-700 leading-none">{staff.phone}</p>
                 <p className="text-[10px] text-slate-400 font-medium mt-1">{staff.email}</p>
              </td>
              <td className="px-10 py-6 text-right">
                <div className="flex justify-end gap-2 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onView(staff); }}
                    className="p-2.5 text-slate-400 hover:text-emerald-600 transition-all"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(staff); }}
                    className="p-2.5 text-slate-400 hover:text-blue-600 transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(staff); }}
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
}
