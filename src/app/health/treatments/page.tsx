"use client";

import React from "react";

export default function TreatmentsPage() {
  return (
    <div className="p-6 bg-[#fbfcfd] min-h-screen -m-6 pt-12">
      <div className="max-w-2xl mx-auto p-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-center mt-20">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <HelpCircleIcon size={32} />
        </div>
        <h1 className="text-2xl font-black uppercase text-slate-800 tracking-tight">Nhật ký điều trị bệnh</h1>
        <p className="text-sm text-slate-500 mt-2 font-medium">Tính năng này đang được phát triển.</p>
      </div>
    </div>
  );
}

function HelpCircleIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
