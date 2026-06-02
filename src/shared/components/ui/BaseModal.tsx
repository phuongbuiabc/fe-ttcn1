"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className,
  showCloseButton = true,
}: BaseModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop click overlay with smooth fade */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100/50 overflow-hidden p-10 relative z-10",
              className
            )}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            )}

            {(title || subtitle) && (
              <div className="mb-6 pr-8">
                {title && <h3 className="text-xl font-bold text-slate-800 uppercase font-headline leading-tight">{title}</h3>}
                {subtitle && <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{subtitle}</p>}
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
