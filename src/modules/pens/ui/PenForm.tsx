'use client';

import React, { useEffect, useState } from 'react';
import { useArea } from '@/modules/area/hooks/useArea';
import { PenResponse } from '@/modules/pens/model/pen.model';
import { PenStatus, PenType } from '@/shared/enums/pen.enum';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: PenResponse | null;
}

export function PenForm({ open, onClose, onSubmit, initialData }: Props) {
  const { areas, fetchAreas } = useArea();

  const isPenStatus = (value: string): value is PenStatus =>
    Object.values(PenStatus).includes(value as PenStatus);

  const [form, setForm] = useState({
    name: '',
    area: '0',
    areaId: '',
    penType: '',
    status: PenStatus.IN_USE
  });

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        area: String(initialData.area ?? 0),
        areaId: initialData.areaId,
        penType: initialData.penType || '',
        status: isPenStatus(initialData.status) ? initialData.status : PenStatus.IN_USE
      });
    }
  }, [initialData]);

  const normalizeDoubleInput = (value: string) => value.replace(',', '.');

  const handleSubmit = () => {
    const parsedArea = Number.parseFloat(normalizeDoubleInput(form.area));
    const sanitizedName = form.name.trim();

    onSubmit({
      name: sanitizedName,
      area: Number.isFinite(parsedArea) ? parsedArea : 0,
      areaId: form.areaId || undefined,
      penType: form.penType || undefined,
      status: form.status,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] p-6 rounded-xl space-y-4">

        <h3 className="font-bold text-lg">
          {initialData ? 'Sửa chuồng' : 'Thêm chuồng'}
        </h3>

        {/* NAME */}
        <input
          placeholder="Tên chuồng"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* AREA */}
        <input
          type="number"
          step="any"
          inputMode="decimal"
          min="0"
          placeholder="Diện tích"
          value={form.area}
          onChange={e => setForm({ ...form, area: e.target.value })}
          className="w-full border p-2 rounded"
        />

        {/* AREA SELECT */}
        <select
          value={form.areaId}
          onChange={e => setForm({ ...form, areaId: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Chọn khu vực</option>
          {areas.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        {/* TYPE */}
        <select
          value={form.penType}
          onChange={e => setForm({ ...form, penType: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Chọn loại chuồng</option>
          <option value={PenType.BREEDING}>Chuồng giống</option>
          <option value={PenType.FARROWING}>Chuồng đẻ</option>
          <option value={PenType.GROWING}>Chuồng nuôi</option>
          <option value={PenType.FINISHING}>Chuồng xuất</option>
        </select>

        {/* STATUS */}
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value as PenStatus })}
          className="w-full border p-2 rounded"
        >
          <option value={PenStatus.IN_USE}>Đang sử dụng</option>
          <option value={PenStatus.EMPTY}>Trống</option>
          <option value={PenStatus.MAINTENANCE}>Bảo trì</option>
        </select>

        {/* ACTION */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-emerald-600 text-white rounded"
          >
            Lưu
          </button>
        </div>

      </div>
    </div>
  );
}