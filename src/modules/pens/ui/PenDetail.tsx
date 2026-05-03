'use client';

import React from 'react';
import { PenDetailResponse, PenPigSummary } from '../model/pen.model';

interface Props {
  pen: PenDetailResponse | null;
  loading: boolean;
  onClose: () => void;
}

export function PenDetail({ pen, loading, onClose }: Props) {
  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!pen) {
    return <div className="p-6">Không có dữ liệu</div>;
  }

  return (
    <aside className="w-full min-w-0 bg-white border-l shadow-2xl overflow-y-auto flex flex-col h-full">

      {/* HEADER */}
      <div className="p-6 sticky top-0 bg-white z-20 border-b flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">
            Hồ sơ chi tiết
          </span>
          <h3 className="text-2xl font-extrabold">
            {pen.name}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ✕
        </button>
      </div>

      <div className="p-6 space-y-10">

        {/* ===== INFO ===== */}
        <section>
          <h4 className="font-bold mb-4">Thông tin chuồng</h4>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">

            <Info label="Diện tích" value={pen.area ? `${pen.area} m²` : '--'} />
            <Info label="Số lợn" value={pen.pigCount} />

            <Info label="Heo con" value={pen.pigletCount} />
            <Info label="Tổng" value={(Number(pen.pigCount) + Number(pen.pigletCount))} highlight />

          </div>
        </section>

        {/* ===== PIG LIST TABLE ===== */}
        <section>
          <h4 className="font-bold mb-4">Danh sách lợn</h4>

          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Số tai</th>
                  <th className="p-2 text-left">Loại</th>
                  <th className="p-2 text-left">Cân nặng</th>
                </tr>
              </thead>

              <tbody>
                {pen.pigs?.length ? (
                  pen.pigs.map((p: PenPigSummary) => (
                    <tr key={p.pigId} className="border-t">
                      <td className="p-2 font-medium">{p.earTag}</td>
                      <td className="p-2">{p.type}</td>
                      <td className="p-2">{p.currentWeight} kg</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-2 text-center text-gray-400">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </aside>
  );
}

/* ===== SUB COMPONENT ===== */
function Info({
  label,
  value,
  highlight
}: {
  label: string;
  value?: string | number;
  highlight?: boolean;
}) {
  return (
    <div>
      <span className="text-[10px] text-gray-400 uppercase">
        {label}
      </span>
      <p className={`text-sm font-semibold ${highlight ? 'text-emerald-600' : ''}`}>
        {value || '--'}
      </p>
    </div>
  );
}