'use client';

import React, { useMemo, useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { BaseSearch } from '@/shared/components/search';
import { DiseaseResponse } from '@/modules/disease/model/disease.model';

interface Props {
  diseases: DiseaseResponse[];
  loading: boolean;
  onEdit: (disease: DiseaseResponse) => void;
  onDelete: (id: string) => void;
}

const formatDate = (date?: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
};

export const DiseaseTable: React.FC<Props> = ({
  diseases,
  loading,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const types = useMemo(() => {
    const s = new Set<string>();
    diseases.forEach((d) => d.diseaseType && s.add(d.diseaseType));
    return Array.from(s);
  }, [diseases]);

  const visible = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return diseases.filter((d) => {
      if (selectedType && d.diseaseType !== selectedType) return false;
      if (!term) return true;
      const name = (d.name || '').toLowerCase();
      const symptoms = (d.symptoms || '').toLowerCase();
      return name.includes(term) || symptoms.includes(term);
    });
  }, [diseases, searchTerm, selectedType]);
  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100">

      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
          <BaseSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm tên hoặc triệu chứng"
            className="min-w-[240px] shrink-0"
          />

          <label className="flex min-w-[180px] items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-500">Loại</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">Tất cả</option>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <table className="w-full border-separate border-spacing-0 text-left [&_th]:border-0 [&_td]:border-0">
        <thead className="sticky top-0 z-10 bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Tên bệnh</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Loại</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Triệu chứng</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Ngày tạo</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td className="py-10 text-center text-slate-500" colSpan={5}>
                Đang tải...
              </td>
            </tr>
          ) : visible.length === 0 ? (
            <tr>
              <td className="py-10 text-center text-slate-500" colSpan={5}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            visible.map((d) => (
              <tr key={d.id} className="transition hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-sm">{d.name}</td>
                <td className="px-6 py-4 text-sm">{d.diseaseType}</td>
                <td className="px-6 py-4 text-sm">{d.symptoms}</td>
                <td className="px-6 py-4 text-sm">{formatDate(d.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      aria-label="Sửa"
                      title="Sửa"
                      className="p-2 rounded-full hover:bg-slate-50 text-blue-600"
                      onClick={() => onEdit(d)}
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      aria-label="Xóa"
                      title="Xóa"
                      className="p-2 rounded-full hover:bg-slate-50 text-rose-600"
                      onClick={() => onDelete(d.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};