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
    <table className="w-full text-sm">
      <thead className="bg-gray-50 text-xs uppercase">
        <tr>
          <th className="px-4 py-2">Tên đàn</th>
          <th className="px-4 py-2">Lứa</th>
          <th className="px-4 py-2">Số lượng</th>
          <th className="px-4 py-2">Ngày sinh</th>
          <th className="px-4 py-2 text-right">Thao tác</th>
        </tr>
      </thead>

      <tbody>
        {data.map(item => (
          <tr key={item.id} className="border-t hover:bg-gray-50">
            <td className="px-4 py-2 font-medium">{item.herdName}</td>
            <td className="px-4 py-2">{item.litterNumber}</td>
            <td className="px-4 py-2">{item.quantity}</td>
            <td className="px-4 py-2">
              {item.birthDate || '--'}
            </td>

            <td className="px-4 py-2 text-right">
              <div className="flex justify-end gap-2">
                <button onClick={() => onView(item)}>
                  <Eye size={14} />
                </button>
                <button onClick={() => onEdit(item)}>
                  <Edit size={14} />
                </button>
                <button onClick={() => onDelete(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}