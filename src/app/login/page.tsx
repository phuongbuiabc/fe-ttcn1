"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sprout,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";
import { useAuth } from "@/shared/components/AuthProvider";
import { authService as authApi } from "@/modules/auth/api/auth.service";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, loading: isAuthLoading, login } = useAuth();
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register Form States
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push("/");
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    // Clear old auth info on page entry
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.clear();

    // Check query params for registration mode
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "register" || params.get("register") === "true" || params.get("registered") === "true") {
        setIsRegister(true);
      }
    }
  }, []);

  const toggleMode = (val: boolean) => {
    setIsRegister(val);
    setError(null);
    setSuccessMessage(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (val) {
        url.searchParams.set("mode", "register");
      } else {
        url.searchParams.delete("mode");
        url.searchParams.delete("register");
        url.searchParams.delete("registered");
      }
      window.history.pushState({}, "", url.pathname + url.search);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await login({ email, username: email, password });
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message?.includes("Failed to fetch") || err.name === "TypeError") {
        setError("Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng hoặc CORS.");
      } else {
        setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

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

    if (!agreeTerms) {
      setError("Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.");
      setIsLoading(false);
      return;
    }

    try {
      const nameParts = fullName.trim().split(/\s+/);
      const familyName = nameParts.length > 1 ? nameParts[0] : "";
      const givenName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0];

      const response = await authApi.register({
        givenName,
        familyName,
        email,
        password,
        avatarUrl: ""
      });

      if (response.success) {
        toggleMode(false);
        setSuccessMessage("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
        // Clear registration states
        setFullName("");
        setConfirmPassword("");
        setAgreeTerms(false);
      }
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex bg-white font-sans overflow-hidden transition-all duration-700 ease-in-out",
      isRegister ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Left/Right Side - Form Container */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white"
      >
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-[#006c49] to-[#10b981] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Sprout className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tighter text-slate-900 font-headline">MDFARM</h1>
          </div>

          <AnimatePresence mode="wait">
            {!isRegister ? (
              <motion.div
                key="login-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Chào mừng trở lại</h2>
                  <p className="text-slate-500 font-medium">Đăng nhập để quản lý trang trại của bạn một cách thông minh nhất.</p>
                </div>

                {successMessage && (
                  <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-[#10b981] rounded-r-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle2 className="text-[#10b981] shrink-0" size={20} />
                    <p className="text-sm font-bold text-emerald-800">{successMessage}</p>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="text-rose-500 shrink-0" size={20} />
                    <p className="text-sm font-bold text-rose-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mật khẩu</label>
                      <Link href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Quên mật khẩu?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
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
                    className="w-full py-4 mt-2 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Đăng nhập <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>


              </motion.div>
            ) : (
              <motion.div
                key="register-section"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Đăng ký tài khoản</h2>
                  <p className="text-slate-500 font-medium">Khởi tạo tài khoản quản lý hệ thống MDFARM.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="text-rose-500 shrink-0" size={20} />
                    <p className="text-sm font-bold text-rose-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Họ và tên</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mật khẩu</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tối thiểu 6 ký tự"
                        className="w-full pl-12 pr-12 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
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

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full pl-12 pr-12 py-3 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 ml-1 py-1">
                    <input
                      type="checkbox"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-200 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                      Tôi đồng ý với <Link href="#" className="text-emerald-600 font-bold hover:underline">Điều khoản dịch vụ</Link> và <Link href="#" className="text-emerald-600 font-bold hover:underline">Chính sách bảo mật</Link> của MDFARM.
                    </p>
                  </div>

                </form>

                <p className="mt-8 text-center text-sm font-medium text-slate-500">
                  Đã có tài khoản?{" "}
                  <button
                    onClick={() => toggleMode(false)}
                    className="text-emerald-600 font-black hover:text-emerald-700 underline underline-offset-4 cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Left/Right Side - Visual Column */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden items-center justify-center p-12"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b981_0%,transparent_50%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-500/20 rounded-full animate-[pulse_8s_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-500/10 rounded-full animate-[pulse_12s_infinite]" />
        </div>

        <div className="relative z-10 max-w-lg">
          <AnimatePresence mode="wait">
            {!isRegister ? (
              <motion.div
                key="login-marketing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest">
                  <CheckCircle2 size={14} /> Trang trại lợn giống Mão Điền
                </div>
                <h3 className="text-5xl font-black text-white tracking-tighter leading-[0.95] mb-6">
                  Quản lý chăn nuôi <br /> <span className="text-emerald-400 font-headline font-black">Mão Điền, Bắc Ninh.</span>
                </h3>
                <p className="text-slate-400 text-base font-medium leading-relaxed mb-6">
                  Hệ thống số hóa thông minh phục vụ theo dõi chu kỳ sinh sản, tiêm phòng dịch bệnh, tăng trưởng và tài chính của đàn lợn giống chất lượng cao.
                </p>
                <div className="inline-block px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold">
                  Hotline hỗ trợ: <span className="text-emerald-400 text-base font-black">1900 1234</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register-marketing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest">
                  <CheckCircle2 size={14} /> Mão Điền, Thuận Thành, Bắc Ninh
                </div>
                <h3 className="text-5xl font-black text-white tracking-tighter leading-[0.95] mb-8">
                  Hành trình số hóa <br /> <span className="text-emerald-400 font-headline font-black italic">Trang trại lợn giống.</span>
                </h3>

                <div className="space-y-5">
                  {[
                    { title: "Nguồn giống Mão Điền", desc: "Quản lý nguồn giống lợn chất lượng cao, chọn lọc hàng đầu Tỉnh Bắc Ninh." },
                    { title: "Chăm sóc & Thống kê", desc: "Tự động thống kê tăng trưởng đàn heo, tiêm phòng và lịch phối giống." },
                    { title: "Hotline Hỗ Trợ 24/7", desc: "Liên hệ Hotline 1900 1234 để được kỹ thuật viên hỗ trợ nhanh chóng." }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                        <CheckCircle2 size={14} />
                      </div>
                      <div>
                        <h4 className="text-white font-black text-lg">{item.title}</h4>
                        <p className="text-emerald-100/60 text-sm font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating UI Elements */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
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
          animate={{ y: [0, 15, 0] }}
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
      </motion.div>
    </div>
  );
}
