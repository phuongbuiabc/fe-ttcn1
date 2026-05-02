'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useArea } from '@/modules/area/hooks/useArea';
import { usePen } from '@/modules/pens/hooks/usePen';
import { usePig } from '@/modules/pig/hooks/usePig';
import { PigDetailResponse } from '@/modules/pig/model/pig.model';

export default function BarnPigPage() {
  const { areas, fetchAreas } = useArea();
  const { pens, penDetail, fetchPens, fetchPenDetail } = usePen();
  const { fetchPigDetail } = usePig();

  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedPen, setSelectedPen] = useState<string | null>(null);
  const [tab, setTab] = useState<'PIG' | 'HERD'>('PIG');
  const [pigDetails, setPigDetails] = useState<PigDetailResponse[]>([]);

  useEffect(() => {
    fetchAreas();
    fetchPens();
  }, []);

  useEffect(() => {
    if (selectedPen) {
      fetchPenDetail(selectedPen);
    } else {
      setPigDetails([]);
    }
  }, [selectedPen]);

  useEffect(() => {
    if (!penDetail || penDetail.pigs.length === 0) {
      setPigDetails([]);
      return;
    }

    const fetchPigDetailsForPen = async () => {
      const details = await Promise.all(
        penDetail.pigs.map((p) => fetchPigDetail(p.id))
      );
      setPigDetails(details.filter((d): d is PigDetailResponse => d !== null));
    };

    fetchPigDetailsForPen();
  }, [penDetail]);

  const filteredPens = useMemo(() => {
    if (selectedArea === 'ALL') return pens;
    return pens.filter((p) => p.areaId === selectedArea);
  }, [pens, selectedArea]);

  const latestGrowthMap = useMemo(() => {
    const map: Record<string, PigDetailResponse['growthHistory'][number] | undefined> = {};

    pigDetails.forEach((pigDetail) => {
      if (pigDetail.growthHistory.length > 0) {
        map[pigDetail.pig.id] = pigDetail.growthHistory[pigDetail.growthHistory.length - 1];
      }
    });

    return map;
  }, [pigDetails]);

  return (
    <div className="flex h-full">
      <section className="w-[30%] p-6 flex flex-col border-r">
        <div className="flex justify-between mb-4">
          <h4 className="font-bold text-lg">Chuồng</h4>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-xs border px-3 py-1 rounded-full"
          >
            <option value="ALL">Tất cả</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase">
                <th>Chuồng</th>
                <th className="text-right">Lợn</th>
              </tr>
            </thead>
            <tbody>
              {filteredPens.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPen(p.id)}
                  className={`cursor-pointer hover:bg-emerald-50 ${
                    selectedPen === p.id ? 'bg-emerald-100' : ''
                  }`}
                >
                  <td>
                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.area}</p>
                    </div>
                  </td>
                  <td className="text-right">
                    {selectedPen === p.id ? (penDetail?.pigCount || 0) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="w-[70%] p-6 flex flex-col">
        <div className="flex justify-between mb-4">
          <h4 className="font-bold text-lg">Danh sách</h4>

          <div className="flex bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setTab('PIG')}
              className={`px-4 py-1 rounded-full text-xs ${
                tab === 'PIG' ? 'bg-white shadow text-emerald-600' : ''
              }`}
            >
              Lợn
            </button>
            <button
              onClick={() => setTab('HERD')}
              className={`px-4 py-1 text-xs ${tab === 'HERD' ? 'text-gray-500' : ''}`}
            >
              Đàn con
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {tab === 'PIG' ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase">
                  <th>Số tai</th>
                  <th>Ngày đo</th>
                  <th>Giống</th>
                  <th>Lưng</th>
                  <th>Ngực</th>
                  <th>Cân</th>
                </tr>
              </thead>

              <tbody>
                {pigDetails.map((pigDetail) => {
                  const p = pigDetail.pig;
                  const growth = latestGrowthMap[p.id];

                  return (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="font-bold">{p.earTag}</td>
                      <td>{growth?.trackingDate || '-'}</td>
                      <td>{p.species}</td>
                      <td>{growth?.litterLength || '-'}</td>
                      <td>{growth?.chestGirth || '-'}</td>
                      <td className="font-bold">{growth?.weight || '-'} kg</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-gray-400">Chưa triển khai đàn con</div>
          )}
        </div>
      </section>
    </div>
  );
}
