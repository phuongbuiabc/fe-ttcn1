"use client";

import React, { useMemo, useState } from 'react';
import { BaseSearch } from '@/shared/components/search';
import { Eye, Edit, Trash2, Home, Warehouse, UtensilsCrossed } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/shared/utils/utils';

import { PenResponse } from '@/modules/pens/model/pen.model';
import { AreaResponse } from '@/modules/area/model/area.model';

interface Props {
  pens: PenResponse[];
  areas?: AreaResponse[];
  loading?: boolean;
  onView: (pen: PenResponse) => void;
  onEdit: (pen: PenResponse) => void;
  onDelete: (id: string) => void;
  onFeed: (pen: PenResponse) => void;
}

export function PenTable({ pens, areas: propAreas, loading, onView, onEdit, onDelete, onFeed }: Props) {
  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-gray-400">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!pens.length) {
    return (
      <div className="p-6 text-center text-sm text-gray-400">
        Không có dữ liệu chuồng
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  // area options: prefer `areas` passed from parent (with names), otherwise fall back to unique areaId from pens
  const areaOptions = useMemo(() => {
    if (propAreas && propAreas.length > 0) return propAreas.map((a) => ({ id: a.id, name: a.name }));
    const s = new Set<string>();
    pens.forEach((p) => p.areaId && s.add(p.areaId));
    return Array.from(s).map((id) => ({ id, name: id }));
  }, [propAreas, pens]);

  const areaMap = useMemo(() => {
    const map: Record<string, string> = {};
    areaOptions.forEach((a) => {
      map[a.id] = a.name;
    });
    return map;
  }, [areaOptions]);

  const visiblePens = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return pens.filter((p) => {
      if (selectedArea && p.areaId !== selectedArea) return false;
      if (!term) return true;
      const name = (p.name || '').toLowerCase();
      const id = (p.id || '').toLowerCase();
      const areaName = (areaMap[p.areaId] || '').toLowerCase();
      return name.includes(term) || id.includes(term) || areaName.includes(term);
    });
  }, [pens, searchTerm, selectedArea]);

  return (
    <div className="responsive-table">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <BaseSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm chuồng hoặc ID"
            className="min-w-[240px] shrink-0"
          />

          <label className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">Khu vực</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="ml-2 rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none"
            >
              <option value="">Tất cả</option>
              {areaOptions.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">
              Chuồng
            </th>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">
              Khu vực
            </th>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">
              Diện tích
            </th>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {visiblePens.map((item, i) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => onView(item)}
              className="hover:bg-slate-50 cursor-pointer"
            >
              {/* NAME */}
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                    <Home size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {item.name}
                    </p>
                  </div>
                </div>
              </td>

              {/* AREA */}
              <td className="px-6 py-3">
                <span className="text-sm text-gray-600">
                  {areaMap[item.areaId] || item.areaId || '--'}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">
                  {item.penType}
                </p>
              </td>

              {/* SIZE */}
              <td className="px-6 py-3">
                <span className="text-sm font-medium">
                  {item.area ?? 0} m²
                </span>
              </td>

              {/* STATUS */}
              <td className="px-6 py-3">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-[10px] font-semibold uppercase',
                    item.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-600'
                      : item.status === 'EMPTY'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-rose-50 text-rose-600'
                  )}
                >
                  {item.status}
                </span>
              </td>

              {/* ACTION */}
              <td className="px-6 py-2 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(item);
                    }}
                    className="p-1.5 text-slate-400 hover:text-emerald-600"
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFeed?.(item);
                    }}
                    className="p-1.5 text-slate-400 hover:text-emerald-600"
                    title="Cho ăn"
                  >
                    <UtensilsCrossed size={14} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                  >
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