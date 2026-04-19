"use client";

import React, { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  ExternalLink,
  ChevronDown,
  BookOpen,
  LifeBuoy,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";

const faqs = [
  {
    question: "Làm thế nào để thêm lợn mới vào hệ thống?",
    answer: "Bạn có thể thêm lợn mới bằng cách vào mục 'Quản lý Đàn lợn' và nhấn nút 'Thêm lợn mới'. Tại đây, bạn cần nhập các thông tin cơ bản như Mã số, Giống, Ngày sinh và Chuồng nuôi."
  },
  {
    question: "Tôi có thể theo dõi lịch tiêm phòng ở đâu?",
    answer: "Lịch tiêm phòng được quản lý trong mục 'Sức khỏe'. Bạn có thể xem danh sách các đợt tiêm sắp tới và ghi nhận kết quả tiêm trực tiếp trên giao diện."
  },
  {
    question: "Làm sao để chuyển lợn từ chuồng này sang chuồng khác?",
    answer: "Trong mục 'Chuồng nuôi', bạn chọn chuồng đang chứa lợn, sau đó nhấn vào biểu tượng 'Chuyển đàn' (mũi tên 2 chiều). Chọn chuồng đích và số lượng cần chuyển để hoàn tất."
  },
  {
    question: "Dữ liệu của tôi có được bảo mật không?",
    answer: "AgriIntel sử dụng công nghệ mã hóa tiên tiến và lưu trữ trên nền tảng đám mây bảo mật cao. Chỉ những tài khoản được cấp quyền mới có thể truy cập dữ liệu của trang trại."
  }
];

const contactMethods = [
  {
    name: "Chat trực tuyến",
    description: "Hỗ trợ 24/7 qua tin nhắn",
    icon: MessageCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    name: "Gửi Email",
    description: "support@agriintel.vn",
    icon: Mail,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    name: "Hotline",
    description: "1900 1234 (8:00 - 18:00)",
    icon: Phone,
    color: "text-purple-600",
    bg: "bg-purple-50"
  }
];

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Section */}
      <div className="relative rounded-[1.75rem] overflow-hidden bg-emerald-900 p-8 md:p-20 text-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-800/50 border border-emerald-700/50 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">
            <LifeBuoy size={14} className="animate-pulse" /> Trung tâm hỗ trợ AgriIntel
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white font-headline tracking-tight leading-[1.1]">
            Chúng tôi có thể <span className="text-emerald-400">giúp gì</span> cho bạn?
          </h1>
          <div className="relative max-w-xl mx-auto group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 group-focus-within:text-white transition-colors" size={22} />
            <input 
              type="text" 
              placeholder="Tìm kiếm hướng dẫn, câu hỏi thường gặp..." 
              className="w-full pl-14 pr-8 py-5 bg-white/10 border border-white/20 rounded-[2rem] text-white placeholder:text-emerald-300/40 focus:ring-4 focus:ring-emerald-400/20 focus:bg-white/20 outline-none backdrop-blur-xl transition-all shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contactMethods.map((method, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 + 0.3 }}
            className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <method.icon size={100} />
            </div>
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm", method.bg, method.color)}>
              <method.icon size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-headline">{method.name}</h3>
            <p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">{method.description}</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
              Liên hệ ngay <ExternalLink size={12} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 font-headline tracking-tight">Câu hỏi thường gặp</h2>
            <button className="text-sm font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest">Xem tất cả</button>
          </div>
          
          <div className="space-y-5">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "bg-white rounded-[2rem] border transition-all overflow-hidden",
                  openFaq === idx ? "border-emerald-200 shadow-xl" : "border-slate-100 hover:border-slate-200 shadow-sm"
                )}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className={cn("font-black text-base transition-colors", openFaq === idx ? "text-emerald-700" : "text-slate-700 group-hover:text-emerald-600")}>
                    {faq.question}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    openFaq === idx ? "bg-emerald-600 text-white rotate-180" : "bg-slate-50 text-slate-400"
                  )}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-8"
                    >
                      <div className="h-px bg-slate-50 mb-6" />
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 font-headline tracking-tight">Tài liệu</h2>
          <div className="space-y-4">
            {[
              { title: "Hướng dẫn bắt đầu nhanh", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
              { title: "Quản lý đàn lợn nâng cao", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Báo cáo và Phân tích", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" },
              { title: "Chính sách bảo mật", icon: ShieldCheck, color: "text-slate-500", bg: "bg-slate-50" },
            ].map((item, idx) => (
              <button 
                key={idx}
                className="w-full p-5 bg-white rounded-[1.5rem] border border-slate-100 flex items-center justify-between group hover:border-emerald-200 hover:bg-emerald-50/30 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", item.bg, item.color)}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-sm font-black text-slate-700 group-hover:text-emerald-700 transition-colors">{item.title}</span>
                </div>
                <ExternalLink size={16} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
              </button>
            ))}
          </div>

          <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <HelpCircle size={120} />
            </div>
            <div className="relative z-10">
              <h4 className="text-2xl font-black font-headline mb-3">Vẫn cần trợ giúp?</h4>
              <p className="text-xs text-slate-400 mb-8 leading-relaxed font-bold">Đội ngũ kỹ thuật của chúng tôi luôn sẵn sàng hỗ trợ bạn giải quyết mọi vấn đề 24/7.</p>
              <button 
                onClick={() => setIsTicketModalOpen(true)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40 transition-all active:scale-95"
              >
                Gửi yêu cầu hỗ trợ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {isTicketModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTicketModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[1.75rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 font-headline tracking-tight">Gửi yêu cầu</h3>
                    <p className="text-sm text-slate-500 font-bold mt-1">Chúng tôi sẽ phản hồi trong vòng 24h.</p>
                  </div>
                  <button 
                    onClick={() => setIsTicketModalOpen(false)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-colors"
                  >
                    <Zap size={20} className="rotate-45" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chủ đề</label>
                    <input type="text" placeholder="Vấn đề bạn đang gặp phải..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mô tả chi tiết</label>
                    <textarea rows={4} placeholder="Hãy mô tả rõ vấn đề để chúng tôi hỗ trợ tốt nhất..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none" />
                  </div>
                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm">
                      <ShieldCheck size={20} />
                    </div>
                    <p className="text-xs text-emerald-800 font-bold leading-relaxed">Thông tin của bạn được bảo mật tuyệt đối theo chính sách của AgriIntel.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsTicketModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all">
                    Gửi yêu cầu ngay
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

