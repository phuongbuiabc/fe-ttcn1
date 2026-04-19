"use client";
import React from "react";
import { Package, Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-0 pb-6 pt-6 border-t border-slate-100/60 font-body">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Side: Brand & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center text-white">
              <Package size={14} />
            </div>
            <span className="text-sm font-black tracking-tighter text-slate-900">MDFARM.</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <Activity size={10} className="animate-pulse" />
            <span className="uppercase tracking-wider">Hệ thống trực tuyến</span>
          </div>
        </div>

        {/* Middle: Fast Links (Optional but compact) */}
        <div className="flex gap-4 items-center">
            <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">Hướng dẫn</a>
            <span className="text-slate-200">•</span>
            <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">Bảo mật</a>
            <span className="text-slate-200">•</span>
            <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">hotline: 1900-1234</a>
        </div>

        {/* Right Side: Copyright & Version */}
        <div className="flex flex-col items-end gap-0.5">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
             © {new Date().getFullYear()} MDFARM Agriculture Tech.
          </p>
          <p className="text-[9px] text-slate-300 font-medium">
             v2.1.0-stable • Developed by MDTeam
          </p>
        </div>
      </div>
    </footer>
  );
}
