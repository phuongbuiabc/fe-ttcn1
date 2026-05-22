'use client';

import React, { useEffect, useState } from 'react';
import { pigService } from '@/modules/pig/api/pig.service';
import type { PigHistoryFarrowingResponse } from '@/modules/pig/model/pig.model';
import type { SowRecord } from '@/modules/reproduction/model/reproduction.model';

interface Props {
  sow: SowRecord | null;
}

export function FarrowingDetail({ sow }: Props) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PigHistoryFarrowingResponse[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!sow?.id) {
        setHistory([]);
        return;
      }

      setLoading(true);
      try {
        const res = await pigService.getPigHistoryFarrowing(sow.id);
        if (res.success) {
          setHistory(res.data || []);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error('Khong the tai lich su sinh san', error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    void loadHistory();
  }, [sow?.id]);

  if (!sow) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-100">
      {loading ? (
        <div className="p-4 text-sm text-slate-500">Dang tai lich su sinh san...</div>
      ) : history.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2 text-left">Lứa</th>
                <th className="p-2 text-left">Ngày đẻ</th>
                <th className="p-2 text-center">Sinh</th>
                <th className="p-2 text-center">Sống</th>
                <th className="p-2 text-center">Thai gỗ</th>
                <th className="p-2 text-center">Đè chết</th>
                <th className="p-2 text-center">Dị tật</th>
                <th className="p-2 text-center">TB kg</th>
                <th className="p-2 text-left">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
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
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-sm text-slate-400">Khong co du lieu sinh san</div>
      )}
    </section>
  );
}
