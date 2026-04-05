"use client";

import React from "react";
import { Bell, Search, Settings } from "lucide-react";
import Image from "next/image";

export function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Tìm kiếm đàn, chuồng hoặc nhật ký..." 
            className="w-full bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all placeholder:text-slate-400 outline-none text-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-600 hover:text-emerald-600 transition-colors relative group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
        </button>
        <button className="p-2 text-slate-600 hover:text-emerald-600 transition-colors">
          <Settings size={20} />
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900 leading-none font-headline">Marcus Thorne</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter mt-1 font-bold">Quản lý Trang trại</p>
          </div>
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-100">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU8H1s-kjjlI2NWZ__-jyblSSG7AHeOmfBWSF8MxnkOItZRulZPOyAz2qjUhh1OL64lfdFM3kKVyoIqsyWJn5zjUx7eLL_HW8pI7vf7kinoqASkg8UI3plURqUft8OU90He4GSu8H6s1eeSLihn2CxkXvzfLfGOt1_K0f_R5CcwU5SWhzTWWSwqDfcNCrJcqrvpPZbGJ421OUkC2tzipzeMZWNrpeeEb8uqSfmGHmEmiduDR15CCVyTYCHUQc6re0vxz3nNLuM4UFJ"
              alt="Marcus Thorne"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
