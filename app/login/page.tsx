"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sprout, 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-[#006c49] to-[#10b981] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Sprout className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 font-headline">MDFARM</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Chào mừng trở lại</h2>
            <p className="text-slate-500 font-medium">Đăng nhập để quản lý trang trại của bạn một cách thông minh nhất.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mật khẩu</label>
                <Link href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Quên mật khẩu?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Đăng nhập <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="my-10 flex items-center gap-4">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hoặc tiếp tục với</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
              <Chrome size={18} /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
              <Github size={18} /> GitHub
            </button>
          </div>

          <p className="mt-12 text-center text-sm font-medium text-slate-500">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-emerald-600 font-black hover:text-emerald-700 underline underline-offset-4">Đăng ký ngay</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual/Marketing */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b981_0%,transparent_50%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-500/20 rounded-full animate-[pulse_8s_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-500/10 rounded-full animate-[pulse_12s_infinite]" />
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest"
          >
            <AlertCircle size={14} /> Phiên bản 2.0 đã sẵn sàng
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-black text-white tracking-tighter leading-[0.9] mb-6"
          >
            Quản lý trang trại <br /> <span className="text-emerald-400">theo cách hiện đại.</span>
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg font-medium leading-relaxed"
          >
            Hệ thống thông minh giúp bạn tối ưu hóa quy trình chăn nuôi, theo dõi sức khỏe đàn lợn và quản lý tài chính hiệu quả.
          </motion.p>
        </div>

        {/* Floating UI Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg" />
            <div className="space-y-1">
              <div className="w-20 h-2 bg-white/20 rounded" />
              <div className="w-12 h-1.5 bg-white/10 rounded" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-20 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl"
        >
          <div className="flex items-end gap-2 mb-2">
            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
            <div className="w-2 h-12 bg-emerald-400 rounded-full" />
            <div className="w-2 h-6 bg-emerald-600 rounded-full" />
          </div>
          <div className="w-24 h-2 bg-white/20 rounded" />
        </motion.div>
      </div>
    </div>
  );
}
