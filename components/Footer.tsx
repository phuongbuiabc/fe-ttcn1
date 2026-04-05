"use client";

import React from "react";
import { 
  Leaf, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Globe,
  ShieldCheck,
  Sprout
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-emerald-50/50 border border-emerald-100 rounded-[3rem] p-16 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand & Mission */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#006c49] to-[#10b981] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Sprout className="text-white" size={20} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-manrope">MD<span className="text-emerald-600">FARM</span></span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Nền tảng quản lý nông nghiệp thông minh, tối ưu hóa quy trình vận hành và nâng cao năng suất bằng công nghệ số hiện đại.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Điều hướng nhanh</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Bảng điều khiển</Link>
            </li>
            <li>
              <Link href="/inventory" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Quản lý kho</Link>
            </li>
            <li>
              <Link href="/staff" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Nhân sự</Link>
            </li>
            <li>
              <Link href="/reports" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Báo cáo & Phân tích</Link>
            </li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Hỗ trợ & Pháp lý</h4>
          <ul className="space-y-4">
            <li>
              <Link href="/settings" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Cài đặt hệ thống</Link>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Trung tâm trợ giúp</a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Chính sách bảo mật</a>
            </li>
            <li>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Điều khoản sử dụng</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Liên hệ</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-emerald-600 mt-0.5" size={18} />
              <span className="text-sm font-medium text-slate-500 leading-relaxed">
                Khu Công nghệ cao, Quận 9,<br />TP. Hồ Chí Minh, Việt Nam
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-emerald-600" size={18} />
              <span className="text-sm font-medium text-slate-500">028 3456 7890</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-emerald-600" size={18} />
              <span className="text-sm font-medium text-slate-500">support@agriintel.vn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            © {currentYear} MDFARM Digital Agriculture. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hệ thống trực tuyến</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={14} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bảo mật SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="text-slate-400" size={14} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiếng Việt (VN)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
