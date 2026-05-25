'use client';

import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { PigletHerdResponse } from '../model/pigletherd.model';

interface Props {
  data: PigletHerdResponse[];
  loading?: boolean;
  onView: (item: PigletHerdResponse) => void;
  onEdit: (item: PigletHerdResponse) => void;
  onDelete: (id: string) => void;
}

export function PigletHerdTable({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return <div className="p-4 text-center text-sm">Đang tải...</div>;
  }

  if (!data.length) {
    return <div className="p-4 text-center text-sm">Không có dữ liệu</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
      <table className="w-full border-separate border-spacing-0 text-left [&_th]:border-0 [&_td]:border-0 text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Tên đàn</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Lứa</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Số lượng</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Ngày sinh</th>
            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {data.map(item => (
            <tr key={item.id} className="transition hover:bg-slate-50">
              <td className="px-6 py-4 font-semibold text-slate-800">{item.herdName}</td>
              <td className="px-6 py-4 text-slate-600">{item.litterNumber}</td>
              <td className="px-6 py-4 text-slate-600">{item.quantity}</td>
              <td className="px-6 py-4 text-slate-600">
                {item.birthDate || '--'}
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    aria-label="Xem"
                    title="Xem"
                    onClick={() => onView(item)}
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-emerald-600"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    aria-label="Sửa"
                    title="Sửa"
                    onClick={() => onEdit(item)}
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    aria-label="Xóa"
                    title="Xóa"
                    onClick={() => onDelete(item.id)}
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-rose-600"
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