'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Split } from '@/modules/pigletherds/model/pigletherd.model';

interface SplitFormProps {
  isOpen: boolean;
  onClose: () => void;
  sourceHerdId: string;
  onSave: (data: Split) => Promise<void> | void;
}

const getToday = () => new Date().toISOString().slice(0, 10);

export function SplitForm({
  isOpen,
  onClose,
  sourceHerdId,
  onSave,
}: SplitFormProps) {
  const [form, setForm] = useState<Split>({
    sourceHerdId: '',
    litterNumber: 1,
    quantity: 0,
    movementDate: getToday(),
    reason: '',
  });

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      sourceHerdId,
      litterNumber: 1,
      quantity: 0,
      movementDate: getToday(),
      reason: '',
    });
  }, [isOpen, sourceHerdId]);

  const handleChange = (key: keyof Split, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSave({
      ...form,
      sourceHerdId,
    });

    onClose();
  };

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase">
        {label}
      </label>
      {children}
    </div>
  );

  const inputClass =
    'w-full bg-slate-100 px-3 py-2 rounded outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.25 }}
            className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-slate-50">
              <h3 className="text-sm font-bold uppercase text-slate-800">
                Tách đàn
              </h3>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <Field label="Lứa mới">
                <input
                  type="number"
                  value={form.litterNumber}
                  onChange={(e) =>
                    handleChange('litterNumber', Number(e.target.value))
                  }
                  className={inputClass}
                  min={1}
                  required
                />
              </Field>

              <Field label="Số lượng tách">
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    handleChange('quantity', Number(e.target.value))
                  }
                  className={inputClass}
                  min={1}
                  required
                />
              </Field>

              <Field label="Ngày tách">
                <input
                  type="date"
                  value={form.movementDate}
                  onChange={(e) =>
                    handleChange('movementDate', e.target.value)
                  }
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Lý do">
                <textarea
                  value={form.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="Nhập lý do tách đàn..."
                />
              </Field>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded font-semibold"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 rounded font-semibold"
                >
                  Tách đàn
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SplitForm;