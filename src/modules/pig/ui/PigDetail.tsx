'use client';

import React from 'react';
import {
  PigDetailResponse,
  PigHistoryFarrowingResponse,
  PigCurrentResponse,
} from '@/modules/pig/model/pig.model';
import { PigType } from '@/shared/enums/pig.enum';

interface Props {
  data: PigDetailResponse | null;
  loading: boolean;
  pigCurrent: PigCurrentResponse | null;
  farrowingHistory: PigHistoryFarrowingResponse[];
  farrowingLoading: boolean;
  onClose: () => void;
}

export function PigDetail({
  data,
  loading,
  pigCurrent,
  farrowingHistory,
  farrowingLoading,
  onClose,
}: Props) {
  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!data) {
    return <div className="p-6">Không có dữ liệu</div>;
  }

  const { pig, growthHistory, diseaseHistory } = data;
  const isSow = pig.type === PigType.NAI;
  const farrowingSummary = farrowingHistory.reduce(
    (summary, item) => {
      summary.totalLitter += 1;
      summary.totalBorn += item.bornCount || 0;
      summary.totalAlive += item.aliveCount || 0;
      summary.totalDead += item.deadCount || 0;
      summary.totalCrushed += item.crushedCount || 0;
      summary.totalDeformed += item.deformedCount || 0;
      summary.totalWeight += item.averageWeight || 0;
      return summary;
    },
    {
      totalLitter: 0,
      totalBorn: 0,
      totalAlive: 0,
      totalDead: 0,
      totalCrushed: 0,
      totalDeformed: 0,
      totalWeight: 0,
    }
  );

  const averageLitterWeight =
    farrowingSummary.totalLitter > 0
      ? farrowingSummary.totalWeight / farrowingSummary.totalLitter
      : 0;

  return (
    <aside className="w-full min-w-0 bg-white border-l shadow-2xl overflow-y-auto flex flex-col h-full">

      {/* HEADER */}
      <div className="p-6 sticky top-0 bg-white z-20 border-b flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">
            Hồ sơ chi tiết
          </span>
          <h3 className="text-2xl font-extrabold">
            {pig.earTag}
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

            <Info label="Ngày sinh" value={pig.birthDate} />
            <Info label="Ngày nhập" value={pig.herdEntryDate} />

            <Info
              label="Cân nặng sơ sinh"
              value={`${data.currentWeight || 0} kg`}
              highlight
            />
            <Info
              label="Số núm vú"
              value={pig.nippleCount !== undefined ? pig.nippleCount : '--'}
            />

            <Info label="Nguồn" value={pig.origin} />
            
            <Info
              label="Chuồng"
              value={data.currentPenName || '--'}
              highlight
            />

            <Info
              label="Ngày vào chuồng"
              value={data.penEntryDate || '--'}
            />

            {/* <div className="col-span-2">
              <span className="text-xs text-gray-400">Ghi chú</span>
              <p className="text-sm">{pig.note || '--'}</p>
            </div> */}

            {pigCurrent && (
              <>
                <Info
                  label="Cân nặng"
                  value={pigCurrent.weight !== undefined ? `${pigCurrent.weight} kg` : undefined}
                  highlight
                />
                <Info
                  label="Dài lưng"
                  value={pigCurrent.litterLength !== undefined ? `${pigCurrent.litterLength} cm` : undefined}
                />
                <Info
                  label="Vòng ngực"
                  value={pigCurrent.chestGirth !== undefined ? `${pigCurrent.chestGirth} cm` : undefined}
                />
                <Info label="ADG" value={pigCurrent.adg !== undefined ? `${pigCurrent.adg}` : undefined} />
                <Info label="FCR" value={pigCurrent.fcr !== undefined ? `${pigCurrent.fcr}` : undefined} />
              </>
            )}
          </div>
        </section>

        {isSow && (
          <section>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h4 className="font-bold">Lịch sử sinh sản</h4>
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">
                {farrowingHistory.length} lứa
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <StatCard label="Tổng lứa" value={farrowingSummary.totalLitter} />
              <StatCard label="Tổng con sinh" value={farrowingSummary.totalBorn} />
              <StatCard label="Tổng con sống" value={farrowingSummary.totalAlive} />
              <StatCard label="TB cân nặng" value={`${averageLitterWeight.toFixed(2)} kg`} />
            </div>

            <div className="w-full max-w-full bg-white border rounded-xl overflow-x-auto overflow-y-hidden">
              {farrowingLoading ? (
                <div className="p-4 text-sm text-slate-500">Đang tải lịch sử sinh sản...</div>
              ) : (
                <table className="min-w-[980px] w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Lứa</th>
                      <th className="p-2 text-left">Ngày đẻ</th>
                      <th className="p-2 text-center">Sinh</th>
                      <th className="p-2 text-center">Sống</th>
                      <th className="p-2 text-center">Chết</th>
                      <th className="p-2 text-center">Đè chết</th>
                      <th className="p-2 text-center">Dị tật</th>
                      <th className="p-2 text-center">TB kg</th>
                      <th className="p-2 text-left">Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody>
                    {farrowingHistory.length ? (
                      farrowingHistory.map((item) => (
                        <tr key={item.cycleId} className="border-t">
                          <td className="p-2 font-medium">{item.cycleId}</td>
                          <td className="p-2">{item.actualFarrowDate}</td>
                          <td className="p-2 text-center">{item.bornCount}</td>
                          <td className="p-2 text-center">{item.aliveCount}</td>
                          <td className="p-2 text-center">{item.deadCount}</td>
                          <td className="p-2 text-center">{item.crushedCount}</td>
                          <td className="p-2 text-center">{item.deformedCount}</td>
                          <td className="p-2 text-center">{item.averageWeight}</td>
                          <td className="p-2">{item.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-4 text-center text-gray-400">
                          Không có dữ liệu sinh sản
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

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

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-slate-50 px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 font-bold">
        {label}
      </div>
      <div className="mt-1 text-sm font-extrabold text-slate-900">{value}</div>
    </div>
  );
}