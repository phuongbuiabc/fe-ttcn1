'use client';

import { PenDetailResponse } from '../model/pen.model';

interface Props {
  pen: PenDetailResponse | null;
  loading: boolean;
  onClose: () => void;
}

export function PenDetail({ pen, loading, onClose }: Props) {
  if (loading) return <div className="p-4">Đang tải...</div>;
  if (!pen) return null;

  return (
    <div className="bg-white rounded-xl p-4 overflow-y-auto max-h-[80vh]">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold text-lg">Chi tiết: {pen.name}</h2>
        <button onClick={onClose}>Đóng</button>
      </div>

      <div className="space-y-2 text-sm">
        <p><b>Diện tích:</b> {pen.area}</p>
        <p><b>Số lợn:</b> {pen.pigCount}</p>
        <p><b>Heo con:</b> {pen.pigletCount}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">🐷 Danh sách lợn</h3>
        {pen.pigs?.map((p: any) => (
          <div key={p.id} className="text-xs border-b py-1">
            {p.pigCode}
          </div>
        ))}
      </div>
    </div>
  );
}