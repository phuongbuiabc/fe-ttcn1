"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Zap,
  Trash2,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";
import { BaseModal } from "@/shared/components/ui/BaseModal";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  createdAt: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
}

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
    answer: "MDFARM sử dụng công nghệ mã hóa tiên tiến và lưu trữ trên nền tảng đám mây bảo mật cao. Chỉ những tài khoản được cấp quyền mới có thể truy cập dữ liệu của trang trại."
  }
];

const contactMethods = [
  {
    name: "Chat trực tuyến",
    description: "Hỗ trợ 24/7 qua trợ lý ảo",
    icon: MessageCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    action: "chat"
  },
  {
    name: "Gửi Email",
    description: "support@mdfarm.vn",
    icon: Mail,
    color: "text-blue-600",
    bg: "bg-blue-50",
    action: "email"
  },
  {
    name: "Hotline",
    description: "1900 1234 (8:00 - 18:00)",
    icon: Phone,
    color: "text-purple-600",
    bg: "bg-purple-50",
    action: "phone"
  }
];

const docContents: Record<string, string> = {
  "Hướng dẫn bắt đầu nhanh": `Chào mừng bạn đến với MDFARM! Dưới đây là các bước nhanh nhất để thiết lập hệ thống trang trại:

1. Thêm Chuồng nuôi: Truy cập mục "Chuồng nuôi" để khai báo các ô chuồng giống, ô chuồng thịt.
2. Khai báo Đàn lợn: Vào mục "Quản lý Đàn lợn", thêm lợn giống/lợn thịt vào từng chuồng tương ứng.
3. Phân công Lịch làm việc: Trưởng nhóm/Quản lý sẽ truy cập mục "Lịch làm việc" và phân ca trực cụ thể cho kỹ thuật viên và nhân viên chăm sóc.

Nếu có thêm thắc mắc, vui lòng gửi ticket yêu cầu hỗ trợ cho chúng tôi!`,

  "Quản lý đàn lợn nâng cao": `MDFARM cung cấp các tính năng quản lý chu trình sinh sản và chỉ số thể trạng đàn lợn chi tiết:

- Phối giống & Thai kỳ: Ghi nhận ngày phối giống, kiểm tra thai kỳ định kỳ (ngày 21, ngày 42) để cập nhật trạng thái sinh sản của heo nái.
- Theo dõi Tăng trưởng: Lưu trữ các chỉ số thể trạng (cân nặng, vòng ngực, chiều dài thân) để hệ thống tự động tính toán chỉ số FCR (hiệu quả tiêu thụ thức ăn) và ADG (tốc độ tăng trưởng hàng ngày).
- Phân loại Trạng thái: Trạng thái lợn tự động chuyển đổi từ Hậu bị -> Mang thai -> Nuôi con -> Chờ phối giúp tối ưu quy trình quản lý thức ăn.`,

  "Báo cáo và Phân tích": `Nhận các dữ liệu báo cáo trực quan về hiệu quả trang trại:

1. Xuất file Excel báo cáo: Bạn có thể xuất danh sách đàn lợn, lịch tiêm phòng hoặc báo cáo tồn kho vật tư ra Excel để quản lý nội bộ.
2. Thống kê biểu đồ: Hệ thống hiển thị các biểu đồ trực quan về số lượng heo con sinh ra, tỷ lệ phối giống thành công và biến động tồn kho thức ăn/thuốc thú y.
3. Quản lý hao hụt: Ghi chép chi tiết các phiếu nhập, phiếu xuất và hao hụt để cân bằng kho vật tư hàng tháng.`,

  "Chính sách bảo mật": `MDFARM cam kết bảo vệ dữ liệu trang trại của bạn tối đa:

- Mã hóa SSL/TLS: Toàn bộ dữ liệu truyền nhận giữa trình duyệt và máy chủ được mã hóa bảo mật.
- Phân quyền truy cập (RBAC): Phân chia vai trò rõ ràng giữa Quản lý trang trại (Admin) và nhân viên chăm sóc để tránh rò rỉ dữ liệu hoặc thay đổi cấu hình trái phép.
- Sao lưu tự động: Dữ liệu trang trại được tự động sao lưu hàng ngày trên hệ thống đám mây để ngăn ngừa sự cố mất mát dữ liệu.`
};

function SupportContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0].question);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Interactive Chatbot States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string; time: string }[]>([]);
  const [userMsg, setUserMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Set initial chatbot message on client-side mount only to prevent hydration mismatch
  useEffect(() => {
    setChatMessages([
      { 
        sender: 'bot', 
        text: 'Xin chào! Tôi là trợ lý ảo hỗ trợ vận hành MDFARM. Bạn cần giúp đỡ gì hôm nay?', 
        time: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
  }, []);

  const searchParams = useSearchParams();

  // Watch query params to trigger modal or show doc
  useEffect(() => {
    const docParam = searchParams.get("doc");
    const contactParam = searchParams.get("contact");

    if (docParam && docContents[docParam]) {
      setSelectedDoc({ title: docParam, content: docContents[docParam] });
    }
    if (contactParam === "phone") {
      setIsPhoneModalOpen(true);
    } else if (contactParam === "email") {
      setIsEmailModalOpen(true);
    }
  }, [searchParams]);

  // Interactive Document Viewer States
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; content: string } | null>(null);

  // Email and Hotline Modal States
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [emailFrom, setEmailFrom] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Load tickets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mdfarm_support_tickets");
    if (saved) {
      try {
        setTickets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse support tickets:", e);
      }
    }
  }, []);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket: SupportTicket = {
      id: Math.random().toString(36).substring(2, 11),
      subject,
      description,
      createdAt: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING'
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    localStorage.setItem("mdfarm_support_tickets", JSON.stringify(updated));

    setSubject("");
    setDescription("");
    setIsTicketModalOpen(false);
    alert("Yêu cầu hỗ trợ của bạn đã được lưu lại thành công!");
  };

  const handleDeleteTicket = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy yêu cầu hỗ trợ này không?")) {
      const updated = tickets.filter(t => t.id !== id);
      setTickets(updated);
      localStorage.setItem("mdfarm_support_tickets", JSON.stringify(updated));
    }
  };

  const handleContactAction = (action: string) => {
    if (action === "chat") {
      setIsChatOpen(true);
    } else if (action === "email") {
      setIsEmailModalOpen(true);
    } else if (action === "phone") {
      setIsPhoneModalOpen(true);
    }
  };

  const handleSendEmailForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailFrom.trim() || !emailSubject.trim() || !emailBody.trim()) return;

    // Simulate sending email: add as a ticket to local storage!
    const newTicket: SupportTicket = {
      id: "email-" + Math.random().toString(36).substring(2, 11),
      subject: `[Email] ${emailSubject}`,
      description: `Từ: ${emailFrom}\n\n${emailBody}`,
      createdAt: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING'
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    localStorage.setItem("mdfarm_support_tickets", JSON.stringify(updated));

    // Open standard mail client as a backup option if they want
    const mailtoUrl = `mailto:support@mdfarm.vn?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(`Từ: ${emailFrom}\n\n${emailBody}`)}`;
    window.location.href = mailtoUrl;

    setEmailFrom("");
    setEmailSubject("");
    setEmailBody("");
    setIsEmailModalOpen(false);
    alert("Yêu cầu gửi Email đã được ghi nhận thành công!");
  };



  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const time = new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    const updatedMsgs = [...chatMessages, { sender: 'user' as const, text: userMsg, time }];
    setChatMessages(updatedMsgs);
    const sentMsg = userMsg.toLowerCase();
    setUserMsg("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "Cảm ơn bạn đã liên hệ. Tôi đã ghi nhận yêu cầu và sẽ chuyển tiếp đến bộ phận kỹ thuật hỗ trợ sớm nhất.";
      
      if (sentMsg.includes("lợn") || sentMsg.includes("heo")) {
        botResponse = "Để thêm lợn mới, bạn vào 'Quản lý Đàn lợn' -> 'Thêm lợn mới'. Bạn có thể theo dõi giống, thể trạng đàn lợn trong mục này.";
      } else if (sentMsg.includes("mật khẩu") || sentMsg.includes("đổi mật khẩu")) {
        botResponse = "Bạn có thể đổi mật khẩu bằng cách truy cập 'Hồ sơ cá nhân' -> 'Đổi mật khẩu', hệ thống sẽ tự chuyển bạn sang cài đặt Bảo mật.";
      } else if (sentMsg.includes("tiêm") || sentMsg.includes("vaccine") || sentMsg.includes("thuốc")) {
        botResponse = "Lịch tiêm phòng vaccine và danh sách điều trị nằm trong mục 'Sức khỏe'. Bạn có thể ghi nhận kết quả tiêm tại đây.";
      } else if (sentMsg.includes("chuồng")) {
        botResponse = "Quản lý chuồng nuôi nằm trong mục 'Chuồng nuôi'. Bạn có thể thêm ô chuồng mới và di chuyển lợn bằng chức năng 'Chuyển đàn'.";
      } else if (sentMsg.includes("vật tư") || sentMsg.includes("kho")) {
        botResponse = "Mục 'Vật tư' quản lý cám ăn, thuốc thú y và vaccine. Bạn có thể tạo phiếu nhập/xuất kho vật tư trực tiếp tại đây.";
      } else if (sentMsg.includes("chào") || sentMsg.includes("hello")) {
        botResponse = "Xin chào! Tôi có thể hỗ trợ gì cho bạn trong việc vận hành trang trại MDFARM hôm nay?";
      }

      setChatMessages(prev => [...prev, { sender: 'bot' as const, text: botResponse, time: new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleOpenDoc = (title: string) => {
    const content = docContents[title] || "Tài liệu đang được cập nhật...";
    setSelectedDoc({ title, content });
  };

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
            <LifeBuoy size={14} className="animate-pulse" /> Trung tâm hỗ trợ MDFARM
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
            onClick={() => handleContactAction(method.action)}
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
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                Không tìm thấy kết quả phù hợp cho "{searchTerm}"
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div 
                  key={faq.question} 
                  className={cn(
                    "bg-white rounded-[2rem] border transition-all overflow-hidden",
                    openFaq === faq.question ? "border-emerald-200 shadow-xl" : "border-slate-100 hover:border-slate-200 shadow-sm"
                  )}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === faq.question ? null : faq.question)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left group"
                  >
                    <span className={cn("font-black text-base transition-colors", openFaq === faq.question ? "text-emerald-700" : "text-slate-700 group-hover:text-emerald-600")}>
                      {faq.question}
                    </span>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      openFaq === faq.question ? "bg-emerald-600 text-white rotate-180" : "bg-slate-50 text-slate-400"
                    )}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === faq.question && (
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
              ))
            )}
          </div>
        </div>

        {/* Resources Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 font-headline tracking-tight">Tài liệu & Yêu cầu</h2>
          <div className="space-y-4">
            {[
              { title: "Hướng dẫn bắt đầu nhanh", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
              { title: "Quản lý đàn lợn nâng cao", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Báo cáo và Phân tích", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" },
              { title: "Chính sách bảo mật", icon: ShieldCheck, color: "text-slate-500", bg: "bg-slate-50" },
            ].map((item, idx) => (
              <button 
                key={idx}
                onClick={() => handleOpenDoc(item.title)}
                className="w-full p-5 bg-white rounded-[1.5rem] border border-slate-100 flex items-center justify-between group hover:border-emerald-200 hover:bg-emerald-50/30 transition-all shadow-sm hover:shadow-md text-left"
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

          {/* Submitted Tickets History List */}
          {tickets.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 font-headline uppercase tracking-tight text-left">Yêu cầu đã gửi ({tickets.length})</h3>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-100">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3 relative group text-left">
                    <button 
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-all active:scale-95"
                      title="Hủy yêu cầu"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border inline-block mb-2",
                        ticket.status === 'RESOLVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" :
                        ticket.status === 'IN_PROGRESS' ? "bg-blue-50 text-blue-600 border-blue-100/50" :
                        "bg-amber-50 text-amber-600 border-amber-100/50"
                      )}>
                        {ticket.status === 'RESOLVED' ? 'Đã xử lý' :
                         ticket.status === 'IN_PROGRESS' ? 'Đang xử lý' : 'Đang chờ'}
                      </span>
                      <h4 className="text-sm font-black text-slate-800 leading-tight pr-6">{ticket.subject}</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed break-words">{ticket.description}</p>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                      <Clock size={10} />
                      <span>{ticket.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      <BaseModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Gửi yêu cầu"
        subtitle="Chúng tôi sẽ phản hồi trong vòng 24h."
        className="max-w-xl"
      >
        <form onSubmit={handleSubmitTicket} className="space-y-6 mt-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chủ đề</label>
            <input 
              type="text" required placeholder="Vấn đề bạn đang gặp phải..." 
              value={subject} onChange={(e) => setSubject(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mô tả chi tiết</label>
            <textarea 
              rows={4} required placeholder="Hãy mô tả rõ vấn đề để chúng tôi hỗ trợ tốt nhất..." 
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none resize-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs text-emerald-800 font-bold leading-relaxed">Thông tin của bạn được bảo mật tuyệt đối theo chính sách của MDFARM.</p>
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsTicketModalOpen(false)}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all active:scale-95"
            >
              Gửi yêu cầu ngay
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Interactive Chatbot Modal */}
      <BaseModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title="Trợ lý ảo hỗ trợ MDFARM"
        subtitle="Hỗ trợ trả lời tự động các câu hỏi 24/7."
        className="max-w-xl"
      >
        <div className="space-y-4 mt-4">
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 rounded-2xl space-y-3 flex flex-col scrollbar-thin">
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "max-w-[80%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm text-left",
                  msg.sender === 'user' 
                    ? "bg-emerald-600 text-white self-end rounded-tr-none" 
                    : "bg-white text-slate-800 self-start rounded-tl-none border border-slate-100"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className={cn("text-[9px] block mt-1 text-right", msg.sender === 'user' ? "text-emerald-200" : "text-slate-400")}>
                  {msg.time}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="bg-white text-slate-400 self-start p-3 rounded-2xl rounded-tl-none text-[10px] italic shadow-sm border border-slate-100 animate-pulse">
                Trợ lý ảo đang nhập phản hồi...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendChat} className="flex gap-3">
            <input 
              type="text" 
              placeholder="Hỏi về thêm lợn, chuồng, vật tư, đổi mật khẩu..." 
              value={userMsg} 
              onChange={(e) => setUserMsg(e.target.value)}
              className="flex-1 px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/20 focus:bg-white transition-all placeholder:text-slate-300"
            />
            <button 
              type="submit" 
              className="px-6 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all"
            >
              Gửi
            </button>
          </form>
        </div>
      </BaseModal>

      {/* Interactive Document Viewer Modal */}
      <BaseModal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title || "Tài liệu"}
        subtitle="Hướng dẫn chi tiết quy trình vận hành."
        className="max-w-2xl"
      >
        <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 max-h-[450px] overflow-y-auto scrollbar-thin text-left">
          <p className="whitespace-pre-wrap text-sm text-slate-600 font-medium leading-relaxed">
            {selectedDoc?.content}
          </p>
        </div>
        <button 
          onClick={() => setSelectedDoc(null)}
          className="w-full mt-6 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95 duration-200"
        >
          Đóng tài liệu
        </button>
      </BaseModal>

      {/* Interactive Email Modal */}
      <BaseModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Gửi Email Hỗ Trợ"
        subtitle="Gửi thông điệp trực tiếp đến ban kỹ thuật MDFARM."
        className="max-w-xl"
      >
        <form onSubmit={handleSendEmailForm} className="space-y-6 mt-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email của bạn</label>
            <input 
              type="email" required placeholder="nhanvien@mdfarm.vn" 
              value={emailFrom} onChange={(e) => setEmailFrom(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tiêu đề</label>
            <input 
              type="text" required placeholder="Chủ đề email..." 
              value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nội dung</label>
            <textarea 
              rows={4} required placeholder="Nội dung cần hỗ trợ..." 
              value={emailBody} onChange={(e) => setEmailBody(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none resize-none transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsEmailModalOpen(false)}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all active:scale-95"
            >
              Gửi Email
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Interactive Hotline Modal */}
      <BaseModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        title="Liên hệ Hotline"
        subtitle="Hỗ trợ xử lý khẩn cấp 24/7."
        className="max-w-md text-center"
      >
        <div className="mt-6 space-y-6">
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100/50 flex flex-col items-center justify-center space-y-2 shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Số điện thoại hỗ trợ</span>
            <span className="text-3xl font-black text-emerald-600 font-headline">1900 1234</span>
            <span className="text-xs text-slate-400 font-medium">Cước phí cuộc gọi: 1.000đ/phút</span>
          </div>

          <div className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            Thời gian hỗ trợ: <strong className="text-slate-700">8:00 - 18:00</strong> từ Thứ 2 đến Chủ nhật. Trong trường hợp khẩn cấp ngoài giờ trực, vui lòng để lại tin nhắn.
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setIsPhoneModalOpen(false)}
              className="w-full py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SupportContent />
    </Suspense>
  );
}
