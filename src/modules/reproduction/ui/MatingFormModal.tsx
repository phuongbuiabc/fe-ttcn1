"use client";

import React from "react";
import { X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MatingForm from "@/modules/mating/ui/MatingForm";
import useMating from "@/modules/mating/hook/useMating";

interface MatingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MatingFormModal({ isOpen, onClose }: MatingFormModalProps) {
  const { createMating, loading } = useMating();

  if (!isOpen) return null;

  const handleSubmit = async (data: any) => {
    const res = await createMating(data);
    if (res?.success) {
      onClose();
    } else {
      alert(res?.message || 'Tạo phối giống thất bại');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[1.75rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center"><Heart size={24} /></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Phối giống mới</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={24} className="text-slate-300" /></button>
          </div>
          <div className="p-0">
            <MatingForm onSubmit={handleSubmit} onCancel={onClose} loading={loading} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

