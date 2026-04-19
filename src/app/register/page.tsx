"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sprout,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { authService as authApi } from "@/entities/auth/api/auth.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/components/AuthProvider";
import { useEffect } from "react";

export default function RegisterPage() {
  const { user, loading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push("/");
    }
  }, [user, isAuthLoading, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<string>("OWNER");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      // Split fullName into givenName and familyName
      const nameParts = fullName.trim().split(/\s+/);
      const familyName = nameParts.length > 1 ? nameParts[0] : "";
      const givenName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0];

      const response = await authApi.register({
        givenName,
        familyName,
        email,
        password,
        avatarUrl: "" // Optional
      });

      if (response.success) {
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Visual/Marketing */}
      <div className="hidden lg:flex flex-1 bg-emerald-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b981_0%,transparent_50%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-500/20 rounded-full animate-[pulse_8s_infinite]" />
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest"
          >
            <CheckCircle2 size={14} /> Gia nhập cộng đồng 500+ trang trại
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black text-white tracking-tighter leading-[0.85] mb-8"
          >
            Bắt đầu hành trình <br /> <span className="text-emerald-400 italic">số hóa trang trại.</span>
          </motion.h3>

          <div className="space-y-6">
            {[
              { title: "Quản lý tập trung", desc: "Theo dõi mọi hoạt động từ xa, mọi lúc mọi nơi." },
              { title: "Báo cáo thông minh", desc: "Phân tích dữ liệu để tối ưu hóa lợi nhuận." },
              { title: "Bảo mật tuyệt đối", desc: "Dữ liệu của bạn được mã hóa và bảo vệ an toàn." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h4 className="text-white font-black text-lg">{item.title}</h4>
                  <p className="text-emerald-100/60 text-sm font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-[#006c49] to-[#10b981] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Sprout className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 font-headline">MDFARM</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Tạo tài khoản mới</h2>
            <p className="text-slate-500 font-medium">Hoàn thành thông tin bên dưới để bắt đầu quản lý trang trại.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-sm font-bold text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole("OWNER")}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  role === "OWNER" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <ShieldCheck size={16} /> Chủ trang trại
              </button>
              <button
                type="button"
                onClick={() => setRole("WORKER")}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  role === "WORKER" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Briefcase size={16} /> Công nhân
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
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

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 ml-1">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-200 text-emerald-600 focus:ring-emerald-500" />
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Tôi đồng ý với <Link href="#" className="text-emerald-600 font-bold hover:underline">Điều khoản dịch vụ</Link> và <Link href="#" className="text-emerald-600 font-bold hover:underline">Chính sách bảo mật</Link> của MDFARM.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Tạo tài khoản <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-sm font-medium text-slate-500">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-emerald-600 font-black hover:text-emerald-700 underline underline-offset-4">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
