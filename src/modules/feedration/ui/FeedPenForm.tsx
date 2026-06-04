"use client";

import React, { useEffect, useState } from "react";
import { FeedPenRequest } from "@/modules/feedration/model/feedration.model";
import { feedrationService } from "@/modules/feedration/api/feedration.service";
import { Supply } from "@/modules/inventory/model/inventory.model";

interface Props {
  open: boolean;
  penId: string;
  penName: string;
  feedOptions: Supply[];
  onClose: () => void;
  onSuccess?: () => void;
}

export function FeedPenForm({
  open,
  penId,
  penName,
  feedOptions = [],
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<FeedPenRequest>({
    penId: "",
    feedId: "",
    feedAmout: 0,
    feedingDate: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const today = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (open) {
        setForm({
        penId,
        feedId: "",
        feedAmout: 0,
        feedingDate: today(),
        note: "",
        });
    }
    }, [open, penId]);

  const handleChange = (key: keyof FeedPenRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await feedrationService.feedPen(form);
        onSuccess?.();
        onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-5 w-[520px]">
        <h2 className="text-lg font-bold mb-4">
          Cho ăn chuồng {penName}
        </h2>

        <div className="space-y-3">
            {/* FEED */}
            <div>
                <label className="text-sm font-medium">Thức ăn</label>
                <select
                value={form.feedId}
                onChange={(e) => handleChange("feedId", e.target.value)}
                className="w-full rounded-xl px-3 py-2 bg-slate-100 text-sm"
                >
                <option value="">Chọn thức ăn</option>
                {feedOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name} ({item.unit})
                    </option>
                    ))}
                </select>
            </div>

            {/* AMOUNT */}
            <div>
                <label className="text-sm font-medium">Số lượng</label>
                <input
                type="number"
                step="0.01"
                value={form.feedAmout}
                onChange={(e) =>
                    handleChange("feedAmout", parseFloat(e.target.value))
                }
                className="w-full px-3 py-2 bg-slate-50 rounded-xl"
                />
            </div>

            {/* DATE */}
            <div>
                <label className="text-sm font-medium">Ngày cho ăn</label>
                <input
                type="date"
                value={form.feedingDate}
                onChange={(e) => handleChange("feedingDate", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl"
                />
            </div>

            {/* NOTE */}
            <div>
                <label className="text-sm font-medium">Ghi chú</label>
                <textarea
                value={form.note}
                onChange={(e) => handleChange("note", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl"
                />
            </div>
            </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl"
          >
            Ghi nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedPenForm;