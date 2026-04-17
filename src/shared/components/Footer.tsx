"use client";
import React from "react";


export function Footer() {
  return (
    <footer className="py-6 px-8 border-t border-slate-100 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} MDFARM - Hệ thống Quản lý Trang trại Thông minh
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-slate-400 hover:text-emerald-600 transition-colors">Hướng dẫn</a>
          <a href="#" className="text-xs text-slate-400 hover:text-emerald-600 transition-colors">Điều khoản</a>
          <a href="#" className="text-xs text-slate-400 hover:text-emerald-600 transition-colors">Bảo mật</a>
        </div>
      </div>
    </footer>
  );
}
