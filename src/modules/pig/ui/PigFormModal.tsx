'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { CreatePigRequest } from '@/modules/pig/model/pig.model';
import { PigType, PigStatus } from '@/modules/pig/model/pig.enum';

interface PigFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatePigRequest) => void;
  editingPig: any | null;
  formData: CreatePigRequest;
  setFormData: (data: CreatePigRequest) => void;
}

export function PigFormModal({
  isOpen,
  onClose,
  onSave,
  editingPig,
  formData,
  setFormData
}: PigFormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-xl"
        >
          {/* HEADER */}
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-black uppercase">
              {editingPig ? 'Cập nhật lợn' : 'Thêm lợn'}
            </h3>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            <div className="grid grid-cols-2 gap-4">

              {/* earTag */}
              <div>
                <label className="text-xs font-bold">Số tai</label>
                <input
                  value={formData.earTag || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, earTag: e.target.value })
                  }
                  className="input"
                />
              </div>

              {/* type */}
              <div>
                <label className="text-xs font-bold">Loại</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as PigType,
                    })
                  }
                  className="input"
                >
                  <option value="NAI">Lợn nái</option>
                  <option value="NOC">Lợn nọc</option>
                  <option value="THIT">Lợn thịt</option>
                </select>
              </div>

              {/* species */}
              <div>
                <label className="text-xs font-bold">Giống</label>
                <input
                  value={formData.species || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, species: e.target.value })
                  }
                  className="input"
                />
              </div>

              {/* origin */}
              <div>
                <label className="text-xs font-bold">Nguồn gốc</label>
                <input
                  value={formData.origin || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, origin: e.target.value })
                  }
                  className="input"
                />
              </div>

              {/* birthWeight */}
              <div>
                <label className="text-xs font-bold">Cân nặng lúc sinh (kg)</label>
                <input
                  type="number"
                  value={formData.birthWeight || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      birthWeight: Number(e.target.value),
                    })
                  }
                  className="input"
                />
              </div>

              {/* birthDate */}
              <div>
                <label className="text-xs font-bold">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      birthDate: e.target.value,
                    })
                  }
                  className="input"
                />
              </div>

              {/* nippleCount */}
              <div>
                <label className="text-xs font-bold">Số vú</label>
                <input
                  type="number"
                  value={formData.nippleCount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nippleCount: Number(e.target.value),
                    })
                  }
                  className="input"
                />
              </div>

              {/* herdEntryDate */}
              <div>
                <label className="text-xs font-bold">Ngày nhập đàn</label>
                <input
                  type="date"
                  value={formData.herdEntryDate || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      herdEntryDate: e.target.value,
                    })
                  }
                  className="input"
                />
              </div>

              {/* status */}
              <div className="col-span-2">
                <label className="text-xs font-bold">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as PigStatus,
                    })
                  }
                  className="input"
                >
                  <option value="ACTIVE">Đang nuôi</option>
                  <option value="SOLD">Đã bán</option>
                  <option value="DEAD">Đã chết</option>
                </select>
              </div>

            </div>

            {/* ACTION */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 rounded-xl"
              >
                Hủy
              </button>

              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl"
              >
                Lưu
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}