import React, { useEffect, useMemo, useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { useBreed } from '../hooks/useBreed';
import { BreedResponse } from '@/modules/breed/model/breed.model';
import { BaseSearch } from '@/shared/components/search';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

export const BreedTable: React.FC = () => {
  const { breeds, fetchBreeds, loading, deleteBreed } = useBreed();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  const visibleBreeds = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return breeds;

    return breeds.filter((breed) => {
      const name = (breed.name || '').toLowerCase();
      const characteristics = (breed.characteristics || '').toLowerCase();
      return name.includes(term) || characteristics.includes(term);
    });
  }, [breeds, searchTerm]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="px-4 py-3 border-b border-slate-100">
        <BaseSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm theo tên hoặc đặc điểm"
          className="min-w-[280px] max-w-md"
        />
      </div>

      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tên giống</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Đặc điểm</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Ngày thêm</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Ngày sửa</th>
            <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-slate-400">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : visibleBreeds.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-slate-400">
                Không có giống nào
              </td>
            </tr>
            ) : (
            visibleBreeds.map((breed) => (
              <tr key={breed.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {breed.name}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {breed.characteristics || '-'}
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {formatDate(breed.createdAt)}
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {formatDate(breed.updatedAt)}
                </td>

                {/* ACTION */}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      aria-label="Sửa"
                      title="Sửa"
                      className="p-2 rounded-full hover:bg-slate-50 text-blue-600"
                      onClick={() => {
                        console.log('edit', breed);
                      }}
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      aria-label="Xóa"
                      title="Xóa"
                      className="p-2 rounded-full hover:bg-slate-50 text-rose-600"
                      onClick={() => deleteBreed(breed.id)}
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