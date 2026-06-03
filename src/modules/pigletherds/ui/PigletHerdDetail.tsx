'use client';

import React from 'react';
import {
  PigletHerdDetailResponse,
  PigletHerdGrowthHistoryItemResponse,
  PigletHerdMovementHistoryItemResponse,
} from '../model/pigletherd.model';
import { PigletHerdStatus } from '@/shared/enums/pigletherd.enum';

interface Props {
  data: PigletHerdDetailResponse | null;
  loading: boolean;
  onClose: () => void;
}

export function PigletHerdDetail({ data, loading, onClose }: Props) {
  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!data) {
    return <div className="p-6">Không có dữ liệu</div>;
  }

  const { herd, growthHistory, movementHistory } = data;

  const growthSummary = growthHistory.reduce(
    (summary, item) => {
      summary.totalRecords += 1;
      summary.totalWeight += item.averageWeight || 0;
      summary.latestWeight = item.averageWeight || summary.latestWeight;
      summary.latestDate = item.trackingDate || summary.latestDate;
      return summary;
    },
    {
      totalRecords: 0,
      totalWeight: 0,
      latestWeight: 0,
      latestDate: '',
    }
  );

  const averageGrowthWeight =
    growthSummary.totalRecords > 0
      ? growthSummary.totalWeight / growthSummary.totalRecords
      : 0;

  const movementSummary = movementHistory.reduce(
    (summary, item) => {
      summary.totalRecords += 1;
      summary.totalQuantity += item.quantity || 0;
      summary.latestMovementDate = item.movementDate || summary.latestMovementDate;
      summary.latestMovementType = item.movementType || summary.latestMovementType;
      return summary;
    },
    {
      totalRecords: 0,
      totalQuantity: 0,
      latestMovementDate: '',
      latestMovementType: '',
    }
  );

  const renderStatusBadge = (status?: PigletHerdStatus) => {
    if (status === PigletHerdStatus.UNWEANED) {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
          Theo mẹ
        </span>
      );
    }

    if (status === PigletHerdStatus.WEANED) {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          Cai sữa
        </span>
      );
    }

    return <span className="text-slate-500">{status || '--'}</span>;
  };

  const formatDate = (value?: string) => {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const formatDateTime = (value?: string) => {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  return (
    <aside className="w-full min-w-0 bg-white shadow-2xl overflow-y-auto flex flex-col h-full">
      <div className="p-6 sticky top-0 bg-white z-20 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">
            Hồ sơ chi tiết
          </span>
          <h3 className="text-2xl font-extrabold">{herd.herdName}</h3>
        </div>

        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          ✕
        </button>
      </div>

      <div className="p-6 space-y-10">
        <section>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
            <Info label="Tên đàn" value={herd.herdName} />
            <Info label="Lứa" value={herd.litterNumber} />
            <Info label="Chuồng" value={herd.penName || '--'} />
            <Info label="Số lượng" value={herd.quantity ?? 0} />
            <Info label="Số tai mẹ" value={herd.motherEarTag || '--'} />
            <Info label="Giống mẹ" value={herd.motherBreed || '--'} />
            <Info label="Số tai bố" value={herd.fatherEarTag || '--'} />
            <Info label="Giống bố" value={herd.fatherBreed || '--'} />
            <Info label="Cân nặng sơ sinh TB" value={herd.averageBirthWeight !== undefined ? `${herd.averageBirthWeight} kg` : '--'} highlight />
            <Info label="Ngày sinh" value={formatDate(herd.birthDate)} />
            <Info label="Trạng thái" value={renderStatusBadge(herd.status)} />
            <Info label="Tạo lúc" value={formatDateTime(herd.createdAt)} />
            <Info label="Cập nhật" value={formatDateTime(herd.updatedAt)} />
            {herd.genderNote ? <Info label="Ghi chú giới tính" value={herd.genderNote} /> : null}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h4 className="font-bold">Lịch sử tăng trưởng</h4>
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">
              {growthHistory.length} lần
            </span>
          </div>

          <div className="w-full max-w-full bg-white rounded-xl overflow-x-auto overflow-y-hidden">
            <table className="w-full table-auto text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left align-top">Ngày</th>
                  <th className="p-2 text-left align-top">Cân nặng TB</th>
                  <th className="p-2 text-left align-top">Ghi chú</th>
                </tr>
              </thead>

              <tbody>
                  {growthHistory.length ? (
                  growthHistory.map((item: PigletHerdGrowthHistoryItemResponse) => (
                    <tr key={item.id}>
                      <td className="p-2 font-medium align-top">{formatDate(item.trackingDate)}</td>
                      <td className="p-2 align-top">{item.averageWeight} kg</td>
                      <td className="p-2 align-top break-words whitespace-normal">{item.note || '--'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-400">
                      Không có dữ liệu tăng trưởng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3 mb-4">
            <h4 className="font-bold">Lịch sử biến động</h4>
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">
              {movementHistory.length} lần
            </span>
          </div>

          <div className="w-full max-w-full bg-white overflow-x-auto overflow-y-hidden">
            <table className="w-full table-auto text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left align-top">Ngày</th>
                  <th className="p-2 text-left align-top">Loại</th>
                  <th className="p-2 text-left align-top">Số lượng</th>
                  <th className="p-2 text-left align-top">Đàn nguồn</th>
                  <th className="p-2 text-left align-top">Đàn đích</th>
                  <th className="p-2 text-left align-top">Lý do</th>
                </tr>
              </thead>

              <tbody>
                {movementHistory.length ? (
                  movementHistory.map((item: PigletHerdMovementHistoryItemResponse) => (
                    <tr key={item.id}>
                      <td className="p-2 font-medium align-top">{formatDate(item.movementDate)}</td>
                      <td className="p-2 align-top">{item.movementType}</td>
                      <td className="p-2 align-top">{item.quantity}</td>
                      <td className="p-2 align-top">{item.sourceHerdId || '--'}</td>
                      <td className="p-2 align-top">{item.targetHerdId || '--'}</td>
                      <td className="p-2 align-top break-words whitespace-normal">{item.reason || '--'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-400">
                      Không có dữ liệu biến động
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

function Info({
  label,
  value,
  highlight,
}: {
  label: string;
  value?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div>
      <span className="text-[10px] text-gray-400 uppercase">{label}</span>
      <p className={`text-sm font-semibold ${highlight ? 'text-emerald-600' : ''}`}>
        {value || '--'}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 font-bold">
        {label}
      </div>
      <div className="mt-1 text-sm font-extrabold text-slate-900">{value}</div>
    </div>
  );
}