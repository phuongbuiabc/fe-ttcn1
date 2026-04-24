'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { CreatePigRequest } from '@/modules/pig/model/pig.model';
import { PigType, PigStatus } from '@/shared/enums/pig.enum';
import {
  PIG_TYPE_OPTIONS,
  PIG_STATUS_OPTIONS,
} from '@/modules/pig/utils/pig.mapper';

interface PigFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatePigRequest) => void;
  editingPig: any | null;
  formData: CreatePigRequest;
  setFormData: (data: CreatePigRequest) => void;

  breedOptions: { label: string; value: string | number }[];
  isLoadingBreeds?: boolean;
}

export function PigFormModal({
  isOpen,
  onClose,
  onSave,
  editingPig,
  formData,
  setFormData,
  breedOptions = [],
  isLoadingBreeds = false,
}: PigFormModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClassName =
    'w-full mt-1.5 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all duration-200';

  const labelClassName =
    'text-xs font-semibold text-gray-600 tracking-wide uppercase';

  const handleNumber = (value: string) => {
    return value ? Number(value) : undefined;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="bg-white rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-extrabold text-gray-800">
                {editingPig ? 'CẬP NHẬT THÔNG TIN' : 'THÊM LỢN MỚI'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* earTag */}
                <div>
                  <label className={labelClassName}>Số tai</label>
                  <input
                    placeholder="Nhập số tai..."
                    value={formData.earTag || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, earTag: e.target.value })
                    }
                    className={inputClassName}
                    required
                  />
                </div>

                {/* type */}
                <div>
                  <label className={labelClassName}>Loại</label>
                  <select
                    value={formData.type || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as PigType,
                      })
                    }
                    className={inputClassName}
                    required
                  >
                    <option value="" disabled>
                      -- Chọn loại lợn --
                    </option>
                    {PIG_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* breed */}
                <div>
                  <label className={labelClassName}>Giống</label>
                  <div className="relative">
                    <select
                      value={formData.species || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          species: e.target.value,
                        })
                      }
                      className={inputClassName}
                      disabled={isLoadingBreeds || breedOptions.length === 0}
                      required
                    >
                      <option value="" disabled>
                        {isLoadingBreeds
                          ? 'Đang tải dữ liệu...'
                          : breedOptions.length === 0
                          ? 'Không có dữ liệu giống'
                          : '-- Chọn giống --'}
                      </option>

                      {breedOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {isLoadingBreeds && (
                      <Loader2 className="absolute right-8 top-[18px] w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </div>
                </div>

                {/* origin */}
                <div>
                  <label className={labelClassName}>Nguồn gốc</label>
                  <input
                    placeholder="VD: Trại giống A..."
                    value={formData.origin || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, origin: e.target.value })
                    }
                    className={inputClassName}
                  />
                </div>

                {/* birthWeight */}
                <div>
                  <label className={labelClassName}>
                    Cân nặng lúc sinh (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    value={formData.birthWeight ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        birthWeight: handleNumber(e.target.value),
                      })
                    }
                    className={inputClassName}
                  />
                </div>

                {/* nippleCount */}
                <div>
                  <label className={labelClassName}>Số vú</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.nippleCount ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nippleCount: handleNumber(e.target.value),
                      })
                    }
                    className={inputClassName}
                  />
                </div>

                {/* birthDate */}
                <div>
                  <label className={labelClassName}>Ngày sinh</label>
                  <input
                    type="date"
                    value={formData.birthDate || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        birthDate: e.target.value,
                      })
                    }
                    className={inputClassName}
                  />
                </div>

                {/* herdEntryDate */}
                <div>
                  <label className={labelClassName}>Ngày nhập đàn</label>
                  <input
                    type="date"
                    value={formData.herdEntryDate || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        herdEntryDate: e.target.value,
                      })
                    }
                    className={inputClassName}
                  />
                </div>

                {/* status */}
                <div className="md:col-span-2 pt-2">
                  <label className={labelClassName}>Trạng thái hiện tại</label>

                  <div className="mt-2 flex gap-4">
                    {PIG_STATUS_OPTIONS.map((status) => (
                      <label
                        key={status.value}
                        className={`flex-1 flex items-center justify-center py-3 border rounded-xl cursor-pointer ${
                          formData.status === status.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={status.value}
                          checked={formData.status === status.value}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value as PigStatus,
                            })
                          }
                          className="hidden"
                        />
                        <span className="font-semibold text-sm">
                          {status.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* ACTION */}
              <div className="flex gap-4 pt-6 mt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3.5 px-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  {editingPig ? 'Lưu thay đổi' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}