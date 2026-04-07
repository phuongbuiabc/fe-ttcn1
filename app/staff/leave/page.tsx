"use client";

import React, { useState } from "react";
import { 
  PlusCircle, 
  Search, 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Calendar,
  BarChart2,
  ArrowRight,
  UserCheck,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { LeaveModal } from "@/components/LeaveModal";

const leaveRequests = [
  {
    id: "#AL-2901",
    name: "Lê Hoàng Nam",
    role: "Kỹ thuật viên",
    date: "15/06/2024",
    endDate: "17/06/2024",
    reason: "Nghỉ phép năm đi du lịch gia đình...",
    status: "Chờ duyệt",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTjiAPbZ_l2Yx032G7HX04vvoem8N3N3xRNeOFGGpAIqaO-LxRNCyZTfG26tT7QdOVjn3ijXEk4XQgGfDBOn-bK1Kib9Nb32t8FCMMp1DuY8J4OLyLc6MZh8Woclu_KpNu3lAQfN5e_siJAT1z6ytiPlBjSe-4BoHIujmBwAJaQSo4t8t1PVjJuIMdP2V89bdUS1R0BGopC9p-E65Avdg6J0jvJ5uJFgiJqiq5zfpCecah9IbjpqShuigf9TF1Cxz4YaQDo4LmvjtM"
  },
  {
    id: "#AL-2900",
    name: "Nguyễn Thị Mai",
    role: "Chăm sóc gia súc",
    date: "12/06/2024",
    endDate: "(Sáng)",
    reason: "Khám sức khỏe định kỳ tại BV Đa khoa",
    status: "Đã duyệt",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdrO52ZWaMXO4oFGzxJLHZrib9zhuowsCajIi6PbwlgFXSt9TdQTU6FlbuY_K0MNrzSsryKkkkOA4MABK7hCMsY2AKZwLitKGaRPX7CEy8OyTiWW2Rx6O1Miypa5B8WIoVzW06eMxKEYBBXglToIPWC_PQNcnQG9Crd7uoXd8nJQqZaVAYxkgFoNOQ8nZZbzCK0Qhb6qojCM2ovVg-lhOINWniMtYuGTadSpltzMCKZUXuhqF-B8-PC2UJ-ErTlqaBO1mx8kuIOq_F"
  },
  {
    id: "#AL-2899",
    name: "Phạm Văn Đức",
    role: "Quản lý kho",
    date: "10/06/2024",
    endDate: "10/06/2024",
    reason: "Việc gia đình đột xuất không thể sắp xếp",
    status: "Từ chối",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXVJMfKeYQvJDJbPQd-lv_zq7BB9VlOOwpinTPJtTPM17pYgQ17J68quVys8cCi7geekRMP7jrY1wGYFEcx088R4LpK4U2v86yC9dr_aMv9dp8FftifKYi5juCNeESMNLCsImZGuUBjHeMyZk2M7JfIBT9sTxDItZfK7X02-Wr1rxVklSFt7i5jNpaceGEJUcJhkEeiA1u0ZbjuONFOclV9TDAo0X1qwkNI8A1AvoWLqSVQ0tN2zs0s0WC5ltpQwUKTO2CAORKmU58"
  }
];

export default function LeaveManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleCreate = () => {
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleDetail = (req: any) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const filteredRequests = leaveRequests.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Tất cả trạng thái" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Nghỉ phép</h1>
          <p className="text-slate-500 mt-1 font-medium">Theo dõi và kiểm duyệt các yêu cầu nghỉ phép của nhân sự.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 border-l-4 border-emerald-500 flex-1">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Chờ duyệt</p>
              <p className="text-xl font-black text-emerald-600 font-headline">12 Đơn</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 border-l-4 border-blue-500">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <UserCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Hôm nay nghỉ</p>
              <p className="text-xl font-black text-blue-600 font-headline">08 Người</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-grow">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm tên nhân viên, ID đơn..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-slate-700 font-medium"
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-50 border-none rounded-xl pl-4 pr-10 py-3 text-xs font-bold text-slate-600 outline-none ring-1 ring-slate-200 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              <option>Tất cả trạng thái</option>
              <option>Chờ duyệt</option>
              <option>Đã duyệt</option>
              <option>Từ chối</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>
        <button 
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Tạo đơn mới
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">ID Đơn</th>
                <th className="text-left py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">Nhân viên</th>
                <th className="text-left py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">Thời gian</th>
                <th className="text-left py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">Lý do</th>
                <th className="text-left py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</th>
                <th className="text-right py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRequests.map((req, i) => (
                <motion.tr 
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => handleDetail(req)}
                >
                  <td className="py-6 px-8">
                    <span className="text-sm font-black text-emerald-600">{req.id}</span>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-100">
                        <Image src={req.avatar} alt={req.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{req.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{req.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="text-xs font-bold text-slate-700">
                      <p>{req.date}</p>
                      <p className="text-slate-400 font-medium mt-0.5">Đến {req.endDate}</p>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <p className="text-sm text-slate-500 line-clamp-1 max-w-[200px] font-medium italic">{req.reason}</p>
                  </td>
                  <td className="py-6 px-8">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      req.status === "Chờ duyệt" ? "bg-amber-50 text-amber-600" :
                      req.status === "Đã duyệt" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        req.status === "Chờ duyệt" ? "bg-amber-500" :
                        req.status === "Đã duyệt" ? "bg-emerald-500" : "bg-red-500"
                      )} />
                      {req.status}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetail(req);
                      }}
                      className="text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Chi tiết
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hiển thị 1 - 10 trong số 48 đơn</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 transition-all">
              <ChevronDown className="rotate-90" size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 transition-all">
              <ChevronDown className="-rotate-90" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-gradient-to-br from-[#00422b] to-[#006c49] p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl group">
          <div className="relative z-10">
            <h3 className="text-xl font-bold font-headline mb-2">Tóm tắt xu hướng nghỉ phép</h3>
            <p className="text-emerald-200/80 text-sm mb-8 max-w-sm font-medium">Tỉ lệ nghỉ phép trong tháng 6 tăng 12% so với tháng trước do mùa vụ du lịch hè.</p>
            <div className="flex gap-12">
              <div>
                <p className="text-4xl font-black font-headline tracking-tight">4.2%</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mt-1">Tỉ lệ vắng mặt</p>
              </div>
              <div>
                <p className="text-4xl font-black font-headline tracking-tight">24h</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mt-1">T.gian duyệt TB</p>
              </div>
            </div>
          </div>
          <BarChart2 size={160} className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Loại nghỉ phổ biến</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-700">Nghỉ phép năm</span>
                <span className="text-emerald-600">65%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-700">Nghỉ ốm</span>
                <span className="text-blue-600">20%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "20%" }} className="h-full bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <LeaveModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        request={selectedRequest}
      />
    </div>
  );
}
