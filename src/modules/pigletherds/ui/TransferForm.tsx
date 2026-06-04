"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2, MoveRight } from "lucide-react";

import { usePen } from "@/modules/pens/hooks/usePen";
import { UpdatePigletHerdRequest } from "@/modules/pigletherds/model/pigletherd.model";
import { pigletHerdService } from "../api/pigletherd.service";
import { tokenStorage } from "@/modules/auth/utils/tokenStorage";

interface Props {
  herdId: string;
  currentPenId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function TransferPigletHerdForm({
  herdId,
  currentPenId,
  onSuccess,
  onClose,
}: Props) {
  const { pens, loadingList, fetchPens } = usePen();

  const [targetPenId, setTargetPenId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FIX: chỉ fetch khi có token
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (token) fetchPens();
  }, [fetchPens]);

  const filteredPens = useMemo(() => {
    if (!currentPenId) return pens;
    return pens.filter((pen) => pen.id !== currentPenId);
  }, [pens, currentPenId]);

  useEffect(() => {
    if (!currentPenId) {
      setTargetPenId("");
    }
  }, [currentPenId]);

  const handleSubmit = async () => {
    if (!targetPenId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: UpdatePigletHerdRequest = {
        penId: targetPenId,
      };

      await pigletHerdService.update(herdId, payload);

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Điều chuyển chuồng
        </p>
        <h3 className="text-lg font-black text-slate-900">
          Chọn chuồng đích
        </h3>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-500">
          Chuồng đích
        </label>

        <div className="relative">
          <select
            value={targetPenId}
            onChange={(e) => setTargetPenId(e.target.value)}
            disabled={loadingList || isSubmitting}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">Chọn chuồng</option>

            {loadingList ? (
              <option disabled>Đang tải chuồng...</option>
            ) : filteredPens.length === 0 ? (
              <option disabled>Không có chuồng khả dụng</option>
            ) : (
              filteredPens.map((pen) => (
                <option key={pen.id} value={pen.id}>
                  {pen.name}
                </option>
              ))
            )}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {loadingList && (
        <div className="mt-3 flex items-center justify-center text-sm text-slate-500">
          <Loader2 size={14} className="animate-spin mr-2" />
          Đang tải danh sách chuồng...
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={!targetPenId || isSubmitting || loadingList}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <MoveRight size={16} />
          )}
          Điều chuyển
        </button>
      </div>
    </div>
  );
}