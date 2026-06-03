'use client';

import React, { useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { CreatePigletHerdGrowthRequest } from '../model/pigletherdgrowth.model';
import { usePigletHerd } from '../hooks/usePigletherd';
import { usePigletHerdGrowth } from '../hooks/usePigletherdgrowth';
import { PigletHerdResponse } from '../model/pigletherd.model';

type RowDraft = {
  rowId: string;
  herdId: string;
  herdNameInput: string;
  averageWeight: string;
  note: string;
};

const getToday = () => new Date().toISOString().slice(0, 10);

const toNumberOrUndefined = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  return Number.isNaN(num) ? undefined : num;
};

const createEmptyRow = (): RowDraft => ({
  rowId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  herdId: '',
  herdNameInput: '',
  averageWeight: '',
  note: '',
});

interface PigletHerdGrowthFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export function PigletHerdGrowthForm({ onClose, onSuccess }: PigletHerdGrowthFormProps = {}) {
  const { herds, fetchHerds, loading: loadingHerds } = usePigletHerd();
  const { createGrowth, loading } = usePigletHerdGrowth();
  const isModal = typeof onClose === 'function';

  const [trackingDate, setTrackingDate] = useState<string>(getToday());
  const [rows, setRows] = useState<RowDraft[]>([createEmptyRow()]);
  const [activeSuggestionRowId, setActiveSuggestionRowId] = useState<string | null>(null);
  const [suggestionPos, setSuggestionPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHerds();
  }, [fetchHerds]);

  const handleChangeCell = (rowId: string, field: 'averageWeight' | 'note', value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.rowId === rowId
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  const handleHerdInputChange = (rowId: string, value: string) => {
    const normalizedInput = value.trim().toLowerCase();
    setRows((prev) =>
      prev.map((row) => {
        if (row.rowId !== rowId) return row;

        if (!normalizedInput) {
          return {
            ...row,
            herdNameInput: value,
            herdId: '',
          };
        }

        const matchedHerd = herds.find(
          (herd) => (herd.herdName || '').trim().toLowerCase() === normalizedInput
        );

        return {
          ...row,
          herdNameInput: value,
          herdId: matchedHerd?.id || '',
        };
      })
    );
  };

  const getSuggestions = (keyword: string) => {
    const normalized = keyword.trim().toLowerCase();
    const source = herds.filter((herd) => !!herd.herdName?.trim());
    if (!normalized) return source.slice(0, 8);

    return source
      .filter((herd) => (herd.herdName || '').toLowerCase().includes(normalized))
      .slice(0, 8);
  };

  const handleSelectHerd = (rowId: string, herd: PigletHerdResponse) => {
    setRows((prev) =>
      prev.map((row) =>
        row.rowId === rowId
          ? {
              ...row,
              herdId: herd.id,
              herdNameInput: herd.herdName || '',
            }
          : row
      )
    );
    setActiveSuggestionRowId(null);
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const handleDeleteRow = (rowId: string) => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.rowId !== rowId);
    });
  };

  const handleCancel = () => {
    const confirmed = window.confirm('Bạn có chắc muốn hủy? Mọi thay đổi chưa lưu sẽ bị mất.');
    if (!confirmed) return;

    if (isModal) {
      onClose?.();
      return;
    }

    setRows([createEmptyRow()]);
    setTrackingDate(getToday());
  };

  const handleConfirm = async () => {
    const payloads = rows
      .map((row) => {
        if (!row.herdId) return null;

        const averageWeightVal = toNumberOrUndefined(row.averageWeight);
        if (averageWeightVal === undefined && !row.note.trim()) {
          return null;
        }

        const payload: CreatePigletHerdGrowthRequest = {
          herdId: row.herdId,
          trackingDate,
          averageWeight: averageWeightVal ?? 0,
          note: row.note.trim() || '',
        };

        return payload;
      })
      .filter((item): item is CreatePigletHerdGrowthRequest => item !== null);

    if (payloads.length === 0) {
      alert('Chưa có dữ liệu hợp lệ để lưu. Vui lòng chọn đàn con và nhập ít nhất 1 chỉ số.');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn lưu ${payloads.length} bản ghi tăng trưởng đàn con?`)) {
      return;
    }

    setSubmitting(true);
    try {
      await Promise.all(payloads.map((item) => createGrowth([item])));
      alert(`Đã lưu ${payloads.length} bản ghi tăng trưởng đàn con thành công.`);
      onSuccess?.();

      if (!isModal) {
        setRows([createEmptyRow()]);
      }
    } catch {
      alert('Có lỗi khi lưu dữ liệu tăng trưởng đàn con. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasValidRows = rows.some((row) => {
    if (!row.herdId) return false;
    const averageWeight = toNumberOrUndefined(row.averageWeight);

    return (
      (averageWeight !== undefined && averageWeight !== 0) ||
      row.note.trim() !== ''
    );
  });

  const fieldInvalid = (value: string) => {
    if (!value) return false;
    const n = Number(value);
    return Number.isNaN(n) || n < 0;
  };

  const content = (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-800">Bảng theo dõi tăng trưởng đàn con</h2>
          </div>
          <input
            type="date"
            value={trackingDate}
            onChange={(e) => setTrackingDate(e.target.value)}
            className="w-[160px] rounded-lg px-2 py-1.5 bg-slate-100 text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3 text-left">STT</th>
                <th className="p-3 text-left w-[220px]">Tên đàn</th>
                <th className="p-3 text-left">Cân nặng TB (kg)</th>
                <th className="p-3 text-left">Ghi chú</th>
                <th className="p-3 text-center">Xóa</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const suggestions = getSuggestions(row.herdNameInput);

                return (
                  <tr key={row.rowId}>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 w-[220px] min-w-[180px]">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Gõ tên đàn để chọn"
                          value={row.herdNameInput}
                          onFocus={(e) => {
                            setActiveSuggestionRowId(row.rowId);
                            const rect = e.currentTarget.getBoundingClientRect();
                            setSuggestionPos({
                              top: rect.bottom + window.scrollY,
                              left: rect.left + window.scrollX,
                              width: rect.width,
                            });
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              setActiveSuggestionRowId(null);
                              setSuggestionPos(null);
                            }, 120);
                          }}
                          onChange={(e) => {
                            setActiveSuggestionRowId(row.rowId);
                            handleHerdInputChange(row.rowId, e.target.value);
                          }}
                          className="w-full rounded px-2 py-1 bg-slate-100"
                        />

                        {activeSuggestionRowId === row.rowId && suggestions.length > 0 && suggestionPos && (
                          <div
                            className="fixed z-50 w-64 max-h-56 overflow-y-auto rounded-md bg-white shadow-lg"
                            style={{
                              top: suggestionPos.top,
                              left: suggestionPos.left,
                              width: suggestionPos.width,
                            }}
                          >
                            {suggestions.map((herd) => (
                              <button
                                type="button"
                                key={herd.id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSelectHerd(row.rowId, herd);
                                }}
                                className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50 whitespace-nowrap"
                              >
                                {herd.herdName}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-2">
                      <div>
                        <input
                          type="number"
                          placeholder="Nhập"
                          value={row.averageWeight}
                          onChange={(e) => handleChangeCell(row.rowId, 'averageWeight', e.target.value)}
                          className={`w-full rounded px-2 py-1 bg-slate-100 ${fieldInvalid(row.averageWeight) ? 'ring-2 ring-rose-500' : ''}`}
                        />
                        {fieldInvalid(row.averageWeight) && (
                          <p className="text-rose-600 text-xs mt-1">Giá trị không hợp lệ</p>
                        )}
                      </div>
                    </td>

                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Ghi chú"
                        value={row.note}
                        onChange={(e) => handleChangeCell(row.rowId, 'note', e.target.value)}
                        className="w-full rounded px-2 py-1 bg-slate-100"
                      />
                    </td>

                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeleteRow(row.rowId)}
                        disabled={rows.length === 1}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors disabled:opacity-40"
                        title="Xóa dòng"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {loadingHerds && (
          <p className="px-4 py-2 text-xs text-slate-500">Đang tải danh sách đàn con...</p>
        )}

        <div className="px-4 py-3">
          <button
            onClick={handleAddRow}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            + Thêm dòng
          </button>
        </div>

        <div className="px-4 py-3 flex items-center justify-end gap-2">
          <button
            onClick={handleCancel}
            disabled={submitting || loading}
            className="px-4 py-2 bg-gray-200 text-slate-700 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || loading || !hasValidRows}
            className={`px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors ${submitting || loading || !hasValidRows ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            title={!hasValidRows ? 'Cần ít nhất 1 dòng hợp lệ' : ''}
          >
            {submitting ? 'Đang lưu...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-slate-900">Thêm bản ghi tăng trưởng đàn con</h2>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-[#fbfcfd]">
            {content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 min-h-screen bg-[#fbfcfd]">
      {content}
    </div>
  );
}