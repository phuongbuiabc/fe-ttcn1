import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-50">
      <div className="flex items-center gap-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Trang {currentPage} / {totalPages}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={cn(
            "p-2 rounded-xl border border-slate-100 transition-all",
            currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-50 text-slate-600"
          )}
        >
          <ChevronLeft size={16} />
        </button>
        
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          // Chỉ hiện trang đầu, cuối và quanh trang hiện tại nếu quá nhiều trang
          if (totalPages > 5 && page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
            if (page === 2 || page === totalPages - 1) return <span key={page} className="px-2 text-slate-300">...</span>;
            return null;
          }
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 rounded-xl text-[10px] font-black transition-all border",
                currentPage === page 
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20" 
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
              )}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={cn(
            "p-2 rounded-xl border border-slate-100 transition-all",
            currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-50 text-slate-600"
          )}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
