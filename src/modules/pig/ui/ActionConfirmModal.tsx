'use client';

import React from 'react';
import { AlertTriangle, ShoppingCart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/shared/lib/utils';

import {
  ACTION_CONFIRM_CONFIG,
  ActionType,
} from '@/modules/pig/constants/action-confirm';

interface ActionConfirmModalProps {
  isOpen: boolean;
  type: ActionType;
  targetName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ActionConfirmModal({
  isOpen,
  type,
  targetName,
  onClose,
  onConfirm,
}: ActionConfirmModalProps) {
  if (!isOpen) return null;

  const config = ACTION_CONFIRM_CONFIG[type];

  const renderIcon = () => {
    switch (config.icon) {
      case 'delete':
        return <Trash2 size={40} />;
      case 'sale':
        return <ShoppingCart size={40} />;
      default:
        return <AlertTriangle size={40} />;
    }
  };

  const isPositive = config.color === 'success';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-md p-6 text-center shadow-xl"
        >
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4',
              isPositive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-600'
            )}
          >
            {renderIcon()}
          </div>

          <h3 className="text-lg font-bold mb-2">
            {config.title}
          </h3>

          <p className="text-sm text-slate-500 mb-6">
            {config.getDescription(targetName)}
            <br />
            <span className="font-bold text-slate-900">
              Không thể hoàn tác.
            </span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 rounded"
            >
              Hủy
            </button>

            <button
              onClick={onConfirm}
              className={cn(
                'flex-1 py-2 text-white rounded',
                isPositive ? 'bg-emerald-600' : 'bg-rose-500'
              )}
            >
              Xác nhận
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}