import React, { useEffect } from 'react';
import { useBreed } from '../hooks/useBreed';
import { BreedResponse } from '@/modules/breed/model/breed.model';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

interface Props {
  breeds: BreedResponse[];
}

export const BreedTable: React.FC<Props> = ({ breeds }) => {
  const { fetchBreeds, loading, deleteBreed } = useBreed();

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
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
          ) : breeds.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-slate-400">
                Không có giống nào
              </td>
            </tr>
          ) : (
            breeds.map((breed) => (
              <tr key={breed.id} className="border-t hover:bg-slate-50 transition">
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
                      className="text-xs px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={() => {
                        console.log("edit", breed);
                      }}
                    >
                      Sửa
                    </button>

                    <button
                      className="text-xs px-3 py-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
                      onClick={() => deleteBreed(breed.id)}
                    >
                      Xóa
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