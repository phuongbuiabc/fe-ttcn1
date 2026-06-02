"use client";

import React from "react";
import { Trash2, AlertTriangle, Info } from "lucide-react";
import { BaseModal } from "./BaseModal";

type ConfirmType = "danger" | "warning" | "info";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
}

const typeConfigs = {
  danger: {
    icon: Trash2,
    iconBg: "bg-rose-50 text-rose-500",
    confirmBtn: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-900/10",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-50 text-amber-500",
    confirmBtn: "bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-amber-900/10",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-50 text-blue-500",
    confirmBtn: "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10",
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "danger",
}: ConfirmModalProps) {
  const config = typeConfigs[type];
  const Icon = config.icon;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-sm text-center">
      <div className={`w-16 h-16 ${config.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>
        <Icon size={32} />
      </div>
      <p className="text-xl font-bold uppercase tracking-tight text-slate-800 font-headline">{title}</p>
      <p className="text-slate-500 text-sm mt-2 mb-8 leading-relaxed italic">"{description}"</p>
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 duration-200"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all duration-200 ${config.confirmBtn}`}
        >
          {confirmText}
        </button>
      </div>
    </BaseModal>
  );
}
