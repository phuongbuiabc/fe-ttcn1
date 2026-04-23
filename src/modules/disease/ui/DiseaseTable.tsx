'use client';

import React from 'react';
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
  return (
    <div className="overflow-x-auto bg-white rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Tên bệnh</th>
            <th className="p-3 text-left">Loại</th>
            <th className="p-3 text-left">Triệu chứng</th>
            <th className="p-3 text-left">Ngày tạo</th>
            <th className="p-3 text-left">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td className="p-4 text-center" colSpan={5}>
                Đang tải...
              </td>
            </tr>
          ) : diseases.length === 0 ? (
            <tr>
              <td className="p-4 text-center" colSpan={5}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            diseases.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3">{d.diseaseType}</td>
                <td className="p-3">{d.symptoms}</td>
                <td className="p-3">{formatDate(d.createdAt)}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => onEdit(d)}
                    className="text-blue-600 text-xs"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => onDelete(d.id)}
                    className="text-red-600 text-xs"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};