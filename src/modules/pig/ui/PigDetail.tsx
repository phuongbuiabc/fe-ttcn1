'use client';

import React from 'react';
import { PigDetailResponse } from '@/modules/pig/model/pig.model';

interface Props {
  data: PigDetailResponse | null;
  loading: boolean;
  onClose: () => void;
}

export function PigDetail({ data, loading, onClose }: Props) {
  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!data) {
    return <div className="p-6">Không có dữ liệu</div>;
  }

  const { pig, growthHistory, diseaseHistory } = data;

  return (
    <aside className="w-full min-w-0 bg-white border-l shadow-2xl overflow-y-auto flex flex-col h-full">

      {/* HEADER */}
      <div className="p-6 sticky top-0 bg-white z-20 border-b flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">
            Hồ sơ chi tiết
          </span>
          <h3 className="text-2xl font-extrabold">
            {pig.pigCode}
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
          <h4 className="font-bold mb-4">Thông tin cá thể</h4>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">

            <Info label="Số tai" value={pig.earTag} />
            <Info label="Loại" value={pig.type} />

            <Info label="Giống" value={pig.species} />
            <Info label="Trạng thái" value={pig.status} />

            {/* <Info label="Ngày sinh" value={pig.dateOfBirth} />
            <Info label="Ngày nhập" value={pig.entryDate} /> */}

            <Info
              label="Cân nặng sơ sinh"
              value={`${data.currentWeight || 0} kg`}
              highlight
            />

            {/* <Info
              label="Chuồng"
              value={pig.penCode || '--'}
              highlight
            /> */}

            {/* <div className="col-span-2">
              <span className="text-xs text-gray-400">Ghi chú</span>
              <p className="text-sm">{pig.note || '--'}</p>
            </div> */}
          </div>
        </section>

        {/* ===== GROWTH TABLE ===== */}
        <section>
          <h4 className="font-bold mb-4">Theo dõi tăng trưởng</h4>

          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Ngày</th>
                  <th className="p-2 text-left">Cân nặng</th>
                  <th className="p-2 text-left">Vòng ngực/Dài lưng</th>
                </tr>
              </thead>

              <tbody>
                {growthHistory?.length ? (
                  growthHistory.map((g) => (
                    <tr key={g.id} className="border-t">
                      <td className="p-2">{g.trackingDate}</td>
                      <td className="p-2 font-medium">{g.weight} kg</td>
                      <td className="p-2">{g.chestGirth} cm / {g.litterLength} cm</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-2 text-center text-gray-400">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== DISEASE ===== */}
        <section>
          <h4 className="font-bold mb-4">Tiền sử bệnh</h4>

          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Bệnh</th>
                  <th className="p-2 text-left">Ngày bệnh</th>
                  <th className="p-2 text-left">Ngày khỏi</th>
                  <th className="p-2 text-left">Trạng thái</th>
                  
                </tr>
              </thead>

              <tbody>
                {diseaseHistory?.length ? (
                  diseaseHistory.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="p-2">{d.diseaseName}</td>
                      <td className="p-2">{d.sickDate}</td>
                      <td className="p-2">{d.recoveryDate || '--'}</td>
                      <td className="p-2">{d.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-2 text-center text-gray-400">
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