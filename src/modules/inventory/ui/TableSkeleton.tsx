import React from 'react';

export function TableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="bg-slate-50 h-12 w-full mb-4 rounded-xl" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
          <div className="w-10 h-10 bg-slate-100 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded w-1/3" />
            <div className="h-3 bg-slate-50 rounded w-1/4" />
          </div>
          <div className="w-20 h-8 bg-slate-100 rounded-lg" />
          <div className="w-24 h-4 bg-slate-50 rounded" />
        </div>
      ))}
    </div>
  );
}
