'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Edit, Search, Trash2, X } from 'lucide-react';

import { DiseaseResponse } from '../model/disease.model';
import { cn } from '@/shared/utils/utils';

import { BaseSearch } from '@/shared/components/search';

interface DiseaseTableProps {
  diseases: DiseaseResponse[];
  loading: boolean;
  onEdit?: (disease: DiseaseResponse) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
}

export function DiseaseTable({
  diseases,
  loading,
  onEdit,
  onDelete,
  onCreate,
}: DiseaseTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const key = searchTerm.toLowerCase().trim();

    return diseases.filter((d) =>
      !key || d.name?.toLowerCase().includes(key)
    );
  }, [diseases, searchTerm]);

  const hasActions = Boolean(onEdit || onDelete);

  if (loading && diseases.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div>

      {/* SEARCH + ACTION BAR */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between gap-3">

        {/* SEARCH */}
        <div className="flex-1 max-w-xs">
          <BaseSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm theo tên bệnh..."
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <X size={14} />
              Xóa
            </button>
          )}

          {onCreate && (
            <button
              onClick={onCreate}
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
            >
              + Thêm bệnh
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="responsive-table max-h-[65vh] overflow-y-auto">
        <table className="w-full text-left border-collapse">

          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr>
              <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-700">
                Tên bệnh
              </th>
              <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-700">
                Loại bệnh
              </th>
              <th className="px-6 py-3 text-[10px] font-black uppercase text-slate-700">
                Triệu chứng
              </th>

              {hasActions && (
                <th className="px-6 py-3 text-right text-[10px] font-black uppercase text-slate-700">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {filtered.map((disease) => (
              <tr
                key={disease.id}
                className="hover:bg-slate-50 transition"
              >
                <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                  {disease.name}
                </td>

                <td className="px-6 py-3 text-sm text-slate-700">
                  {disease.diseaseType || '--'}
                </td>

                <td className="px-6 py-3 text-sm text-slate-600">
                  {disease.symptoms || '--'}
                </td>

                {hasActions && (
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-2">

                      {onEdit && (
                        <button
                          onClick={() => onEdit(disease)}
                          className="text-xs font-semibold text-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(disease.id);
                          }}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                    </div>
                  </td>
                )}
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={hasActions ? 4 : 3}
                  className="text-center py-10 text-xs text-slate-400 font-semibold"
                >
                  Không có dữ liệu bệnh
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}