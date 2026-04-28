'use client';

import React from 'react';
import { Eye, Edit, Trash2, Map } from 'lucide-react';
import { motion } from 'motion/react';

import { AreaResponse } from '@/modules/area/model/area.model';

interface Props {
  areas: AreaResponse[];
  loading?: boolean;
  onView: (area: AreaResponse) => void;
  onEdit: (area: AreaResponse) => void;
  onDelete: (id: string) => void;
}

export function AreaTable({ areas, loading, onView, onEdit, onDelete }: Props) {
  if (loading) {
    return <div className="p-6 text-center text-sm text-gray-400">Đang tải...</div>;
  }

  if (!areas.length) {
    return <div className="p-6 text-center text-sm text-gray-400">Không có khu vực</div>;
  }

  return (
    <div className="responsive-table">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Khu vực</th>
            <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Mô tả</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-slate-400 uppercase">Thao tác</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {areas.map((item, i) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="hover:bg-slate-50 cursor-pointer"
              onClick={() => onView(item)}
            >
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded">
                    <Map size={14} />
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.id}</p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-3 text-sm text-gray-600">
                {item.description || '--'}
              </td>

              <td className="px-6 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onView(item); }}>
                    <Eye size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                    <Edit size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}