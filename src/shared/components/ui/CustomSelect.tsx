"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon?: LucideIcon;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  icon: Icon,
  className,
  placeholder = "Chọn...",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full pl-12 pr-10 py-4 bg-[#f8fafc] hover:bg-[#f1f5f9] border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl text-sm font-bold text-left text-slate-800 transition-all duration-200 outline-none flex items-center justify-between cursor-pointer relative",
          isOpen && "border-emerald-500/20 bg-white shadow-[0_4px_20px_rgba(16,185,129,0.05)]",
          disabled && "opacity-60 cursor-not-allowed bg-slate-100 text-slate-400 select-none pointer-events-none"
        )}
      >
        {/* Left Icon */}
        {Icon && (
          <Icon
            className={cn(
              "absolute left-5 top-1/2 -translate-y-1/2 transition-colors",
              isOpen ? "text-emerald-500" : "text-slate-400"
            )}
            size={16}
          />
        )}

        <span className={cn(!selectedOption && "text-slate-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Right Chevron */}
        <ChevronDown
          className={cn(
            "absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-200 pointer-events-none",
            isOpen && "rotate-180 text-emerald-500"
          )}
          size={16}
        />
      </button>

      {/* Floating Options Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-30 left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] overflow-hidden p-1.5"
          >
            <div className="max-h-56 overflow-y-auto no-scrollbar space-y-0.5">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3.5 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between cursor-pointer",
                      isSelected && "bg-emerald-50/50 hover:bg-emerald-50/70 text-emerald-600"
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check size={14} className="text-emerald-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
