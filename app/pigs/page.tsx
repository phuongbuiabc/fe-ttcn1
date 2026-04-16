"use client";

import React, { useState, useEffect } from "react";
import { 
  PlusCircle, 
  RefreshCw, 
  Upload, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  Eye,
  Scale,
  History,
  Edit,
  Trash2,
  MoveDown,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Info,
  ChartLine,
  ClipboardList,
  Stethoscope,
  Syringe,
  MoreVertical,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Settings,
  HelpCircle,
  Menu,
  Bell,
  LayoutDashboard,
  PawPrint,
  Baby,
  Warehouse,
  Database,
  ShoppingCart,
  Users,
  Sprout,
  Venus,
  Mars,
  Utensils,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { pigApi } from "@/lib/api";

interface Pig {
  id: string;
  pigCode: string;
  breed: string;
  weight: number;
  healthStatus: string;
  birthDate: string;
  penId: string;
  pen?: any;
  status: string;
  type?: string;
  date?: string;
  growth?: string;
  statusColor?: string;
}

interface Litter {
  id: string;
  motherId: string;
  birthDate: string;
  count: number;
  status: string;
  pen?: any;
}


export default function PigManagementPage() {
  const [activeTab, setActiveTab] = useState("individual");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [items, setItems] = useState<Pig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = [
    { label: "Tổng số lợn", value: items.length.toString(), change: "", trend: "neutral", color: "emerald" },
    { label: "Lợn con", value: items.filter(i => (i.type || "").toLowerCase().includes("con")).length.toString(), change: "", trend: "neutral", color: "slate" },
    { label: "Lợn nái", value: items.filter(i => (i.type || "").toLowerCase().includes("nái")).length.toString(), change: "", trend: "neutral", color: "slate" },
    { label: "Lợn nọc", value: items.filter(i => (i.type || "").toLowerCase().includes("nọc")).length.toString(), change: "", trend: "neutral", color: "slate" },
    { label: "Bất thường", value: items.filter(i => i.healthStatus !== "Khỏe mạnh" && i.healthStatus !== "Bình thường" && i.healthStatus !== "N/A").length.toString(), change: "", trend: "neutral", color: "rose" },
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pigApi.getAll();
      if (response.success) {
        // Map API fields (species, birthWeight, status) to UI model (breed, weight, healthStatus)
        const mappedPigs = (response.data || []).map((p: any) => ({
          ...p,
          breed: p.species || "N/A",
          weight: p.birthWeight || 0,
          healthStatus: p.status || "N/A",
          penId: p.penId || "C-01", // Fallback for demo
        }));
        setItems(mappedPigs);
      } else {
        setError(response.message || "Failed to fetch pigs");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [litters, setLitters] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [disposals, setDisposals] = useState<any[]>([]);
  
  const growthData: any[] = [
    { name: "Tuần 1", weight: 30 },
    { name: "Tuần 2", weight: 45 },
    { name: "Tuần 3", weight: 40 },
    { name: "Tuần 4", weight: 60 },
    { name: "Tuần 5", weight: 75 },
    { name: "Hôm nay", weight: 90 },
  ];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPig, setEditingPig] = useState<Pig | null>(null);
  const [isLitterModalOpen, setIsLitterModalOpen] = useState(false);
  const [editingLitter, setEditingLitter] = useState<Litter | null>(null);

  // Form State for Pig
  const [formData, setFormData] = useState<Partial<Pig>>({
    id: "",
    type: "Lợn nái",
    breed: "Duroc",
    pen: "",
    date: new Date().toLocaleDateString("vi-VN"),
    weight: 0,
    growth: "+0kg",
    status: "Bình thường",
    statusColor: "emerald"
  });

  // Form State for Litter
  const [litterFormData, setLitterFormData] = useState<Partial<Litter>>({
    id: "",
    motherId: "",
    birthDate: new Date().toLocaleDateString("vi-VN"),
    count: 0,
    status: "Khỏe mạnh",
    pen: ""
  });

  const openAddModal = () => {
    if (activeTab === "individual") {
      setEditingPig(null);
      setFormData({
        id: `SW-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "Lợn nái",
        breed: "Duroc",
        pen: "",
        date: new Date().toLocaleDateString("vi-VN"),
        weight: 0,
        growth: "+0kg",
        status: "Bình thường",
        statusColor: "emerald"
      });
      setIsModalOpen(true);
    } else {
      setEditingLitter(null);
      setLitterFormData({
        id: `L-${Math.floor(100 + Math.random() * 900)}`,
        motherId: "",
        birthDate: new Date().toLocaleDateString("vi-VN"),
        count: 0,
        status: "Khỏe mạnh",
        pen: ""
      });
      setIsLitterModalOpen(true);
    }
  };

  const openEditModal = (pig: Pig) => {
    setEditingPig(pig);
    setFormData(pig);
    setIsModalOpen(true);
  };

  const openEditLitterModal = (litter: Litter) => {
    setEditingLitter(litter);
    setLitterFormData(litter);
    setIsLitterModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bản ghi này không?")) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleDeleteLitter = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đàn con này không?")) {
      setLitters(litters.filter(l => l.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPig) {
      setItems(items.map(i => i.id === editingPig.id ? (formData as Pig) : i));
    } else {
      setItems([(formData as Pig), ...items]);
    }
    setIsModalOpen(false);
  };

  const handleSaveLitter = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLitter) {
      setLitters(litters.map(l => l.id === editingLitter.id ? (litterFormData as Litter) : l));
    } else {
      setLitters([(litterFormData as Litter), ...litters]);
    }
    setIsLitterModalOpen(false);
  };

  const approveSale = () => {
    if (confirm("Bạn có chắc chắn muốn duyệt danh sách bán này?")) {
      setSales([]);
      alert("Đã duyệt bán thành công!");
    }
  };

  const confirmDisposal = () => {
    if (confirm("Bạn có chắc chắn muốn xác nhận tiêu hủy danh sách này?")) {
      setDisposals([]);
      alert("Đã xác nhận tiêu hủy thành công!");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Lợn</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-colors active:scale-95">
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-colors active:scale-95">
            <Upload size={16} /> Import
          </button>
          <button 
            onClick={openAddModal}
            className="px-6 py-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <PlusCircle size={18} /> Thêm lợn
          </button>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={cn(
            "bg-white px-4 py-4 rounded-2xl relative overflow-hidden shadow-sm border border-slate-100",
            stat.color === "rose" && "bg-rose-50/30 border-rose-100"
          )}>
            {stat.color === "emerald" && <div className="absolute left-0 top-0 w-1 h-full bg-emerald-600" />}
            {stat.color === "rose" && <div className="absolute left-0 top-0 w-1 h-full bg-rose-500" />}
            <p className={cn(
              "text-[10px] uppercase tracking-widest font-bold mb-1",
              stat.color === "rose" ? "text-rose-500" : "text-slate-400"
            )}>{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className={cn(
                "text-2xl font-headline font-black",
                stat.color === "rose" ? "text-rose-600" : "text-slate-900"
              )}>{stat.value}</h3>
              {stat.change && (
                <div className="flex items-center text-emerald-600 text-[10px] font-bold gap-0.5">
                  <TrendingUp size={12} /> {stat.change}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setActiveTab("individual")}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-2xl transition-all font-bold",
            activeTab === "individual" 
              ? "bg-white text-emerald-600 shadow-sm border-b-4 border-emerald-600" 
              : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <span className="text-xl">🐖</span> Lợn cá thể
        </button>
        <button 
          onClick={() => setActiveTab("litters")}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-2xl transition-all font-bold",
            activeTab === "litters" 
              ? "bg-white text-emerald-600 shadow-sm border-b-4 border-emerald-600" 
              : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <span className="text-xl">🐷</span> Đàn con
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-100 p-4 rounded-2xl flex flex-wrap items-end gap-3">
        <div className="flex-[2] min-w-[200px]">
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2 px-1">Tìm kiếm</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Số tai/ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2 px-1">Loại</label>
          <select className="w-full px-4 py-2.5 bg-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20 text-sm appearance-none outline-none">
            <option>Tất cả loại</option>
            <option>Lợn nái</option>
            <option>Lợn nọc</option>
          </select>
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2 px-1">Giống</label>
          <select className="w-full px-4 py-2.5 bg-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20 text-sm appearance-none outline-none">
            <option>Tất cả giống</option>
            <option>Duroc</option>
            <option>Landrace</option>
            <option>Yorkshire</option>
          </select>
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2 px-1">Chuồng</label>
          <select className="w-full px-4 py-2.5 bg-white rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20 text-sm appearance-none outline-none">
            <option>Khu vực A</option>
            <option>Khu vực B</option>
          </select>
        </div>
        <div className="flex-[1.5] min-w-[180px] px-2">
          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Cân nặng (kg)</label>
          <div className="relative h-2 bg-slate-200 rounded-full mt-4">
            <div className="absolute left-1/4 right-1/4 h-full bg-emerald-600 rounded-full" />
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-emerald-600 rounded-full cursor-pointer" />
            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-emerald-600 rounded-full cursor-pointer" />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold">
            <span>20kg</span>
            <span>180kg</span>
          </div>
        </div>
        <div className="flex-none flex gap-2">
          <button className="py-2.5 bg-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-300 transition-all px-4">Reset</button>
          <button className="p-2.5 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        <div className="flex justify-end p-4 border-b border-slate-50">
          <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-emerald-100 transition-all active:scale-95">
            <Eye size={16} /> Xem chi tiết
          </button>
        </div>
        <div className="overflow-x-auto">
          {activeTab === "individual" ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4" /></th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Số Tai</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Loại</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Giống</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Chuồng</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Ngày nhập trại</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Cân nặng</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Tăng trưởng</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                        <p className="text-slate-500 font-bold">Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-20 text-center">
                      <p className="text-slate-500 font-bold">Không có dữ liệu lợn nào.</p>
                    </td>
                  </tr>
                ) : items.map((pig) => (
                  <React.Fragment key={pig.id}>
                    <tr 
                      onClick={() => setExpandedRow(expandedRow === pig.id ? null : pig.id)}
                      className={cn(
                        "hover:bg-slate-50 transition-colors group cursor-pointer",
                        expandedRow === pig.id && "bg-emerald-50/20"
                      )}
                    >
                      <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4" />
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-emerald-600 font-bold hover:underline">{pig.pigCode}</span>
                      </td>
                      <td className="px-4 py-5 font-bold text-slate-900">{pig.breed}</td>
                      <td className="px-4 py-5 font-medium text-slate-600">{pig.penId}</td>
                      <td className="px-4 py-5 text-slate-500 text-sm">{new Date(pig.birthDate).toLocaleDateString('vi-VN')}</td>
                      <td className="px-4 py-5 font-bold text-slate-900">{pig.weight} kg</td>
                      <td className="px-4 py-5">
                        <span className={cn(
                          "font-bold flex items-center gap-1 text-sm text-emerald-600",
                        )}>
                          <TrendingUp size={14} />
                          +0kg
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className={cn(
                          "flex items-center gap-2 text-sm font-bold",
                          pig.healthStatus === "Good" ? "text-emerald-600" : "text-rose-600"
                        )}>
                          <span className={cn("w-2 h-2 rounded-full", pig.healthStatus === "Good" ? "bg-emerald-600" : "bg-rose-600")} />
                          {pig.healthStatus}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-3 text-slate-400">
                          <button className="hover:text-emerald-600 transition-colors"><Scale size={18} /></button>
                          <button className="hover:text-emerald-600 transition-colors"><Utensils size={18} /></button>
                          <button className="hover:text-emerald-600 transition-colors"><History size={18} /></button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditModal(pig as any); }}
                            className="hover:text-blue-600 transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(pig.id); }}
                            className="hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expansion Details */}
                    <AnimatePresence>
                      {expandedRow === pig.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-emerald-50/30"
                        >
                          <td colSpan={10} className="px-12 py-6">
                            <div className="flex flex-col lg:flex-row gap-10">
                              <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                                <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-6 flex items-center gap-2">
                                  <ChartLine size={14} className="text-emerald-600" /> Biểu đồ tăng trưởng (30 ngày)
                                </h4>
                                <div className="h-40 w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={growthData}>
                                      <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                                      <YAxis hide />
                                      <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                      />
                                      <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                              <div className="w-full lg:w-1/3 space-y-4">
                                <h4 className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-2">
                                  <ClipboardList size={14} className="text-emerald-600" /> Ghi chú cho ăn gần đây
                                </h4>
                                <div className="text-sm bg-white p-5 rounded-2xl border-l-4 border-emerald-400 shadow-sm">
                                  <p className="text-slate-600 leading-relaxed italic">
                                    &quot;Đã điều chỉnh tăng 15% cám hỗn hợp. Pig cho thấy sự háu ăn trở lại sau đợt tiêm phòng.&quot;
                                  </p>
                                  <div className="flex items-center gap-2 mt-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">M</div>
                                    <p className="text-[10px] text-slate-400 font-bold">— 08:45 AM, Quản lý Minh</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-600 w-4 h-4" /></th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Mã đàn</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Mẹ</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Ngày sinh</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Số lượng</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Chuồng</th>
                  <th className="px-4 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {litters.map((litter) => (
                  <tr key={litter.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-5"><input type="checkbox" className="rounded text-emerald-600 w-4 h-4" /></td>
                    <td className="px-4 py-5 font-bold text-emerald-600">{litter.id}</td>
                    <td className="px-4 py-5 font-medium text-slate-600">{litter.motherId}</td>
                    <td className="px-4 py-5 text-slate-500 text-sm">{litter.birthDate}</td>
                    <td className="px-4 py-5 font-bold text-slate-900">{litter.count} con</td>
                    <td className="px-4 py-5 font-medium text-slate-600">{litter.pen}</td>
                    <td className="px-4 py-5">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full">{litter.status}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-3 text-slate-400">
                        <button 
                          onClick={() => openEditLitterModal(litter)}
                          className="hover:text-blue-600 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteLitter(litter.id)}
                          className="hover:text-rose-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bulk Actions & Pagination Footer */}
        <div className="p-6 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-emerald-600 px-4 py-2 bg-emerald-100 rounded-full">Đã chọn 2 lợn</span>
            <div className="h-6 w-px bg-slate-300 hidden md:block" />
            <div className="flex gap-3">
              <button className="text-[12px] font-bold text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1 uppercase">
                <MoveDown size={16} /> Chuyển chuồng
              </button>
              <button className="text-[12px] font-bold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 uppercase">
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 mr-2 whitespace-nowrap">1-10 trên 1,428</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-400 cursor-not-allowed"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 font-bold text-xs transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 font-bold text-xs transition-colors">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Bottom Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Proposed for Sale Table */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                <ShoppingCart size={20} />
              </div>
              <h2 className="text-xl font-headline font-extrabold text-slate-900">Bảng Đề xuất bán</h2>
            </div>
            <button 
              onClick={approveSale}
              className="px-5 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200"
            >
              <CheckCircle size={14} /> Duyệt bán
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-3 bg-slate-50 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Tìm ID lợn..." 
                  className="w-full pl-8 pr-3 py-1.5 bg-white rounded-lg border-none text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
              <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-emerald-600 border border-slate-100"><Filter size={14} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded text-emerald-600 w-3.5 h-3.5" /></th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Mã nhân viên</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Số tai</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Cân nặng</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Lý do</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sales.map((item, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/20 transition-colors">
                      <td className="px-4 py-3"><input type="checkbox" className="rounded text-emerald-600 w-3.5 h-3.5" /></td>
                      <td className="px-3 py-3 text-xs text-slate-600 font-medium">{item.staffId}</td>
                      <td className="px-3 py-3 font-bold text-emerald-700 text-xs">{item.pigId}</td>
                      <td className="px-3 py-3 text-xs text-slate-600 font-bold">{item.weight}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">{item.reason}</td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-full">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Proposed for Disposal Table */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-xl font-headline font-extrabold text-slate-900">Bảng đề xuất tiêu hủy</h2>
            </div>
            <button 
              onClick={confirmDisposal}
              className="px-5 py-2 bg-rose-600 text-white rounded-full text-xs font-bold hover:bg-rose-700 transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
            >
              <CheckCircle size={14} /> Xác nhận tiêu hủy
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-3 bg-slate-50 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Tìm ID lợn..." 
                  className="w-full pl-8 pr-3 py-1.5 bg-white rounded-lg border-none text-xs focus:ring-1 focus:ring-rose-500 outline-none"
                />
              </div>
              <button className="p-2 bg-white rounded-lg text-slate-400 hover:text-rose-600 border border-slate-100"><Filter size={14} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="px-4 py-3 w-8"><input type="checkbox" className="rounded text-rose-600 w-3.5 h-3.5" /></th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Mã nhân viên</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Số tai</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Lý do</th>
                    <th className="px-3 py-3 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {disposals.map((item, idx) => (
                    <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                      <td className="px-4 py-3"><input type="checkbox" className="rounded text-rose-600 w-3.5 h-3.5" /></td>
                      <td className="px-3 py-3 text-xs text-slate-600 font-medium">{item.staffId}</td>
                      <td className="px-3 py-3 font-bold text-rose-700 text-xs">{item.pigId}</td>
                      <td className="px-3 py-3 text-xs text-slate-600 italic">{item.reason}</td>
                      <td className="px-3 py-3">
                        <span className={cn(
                          "px-2 py-0.5 text-[9px] font-bold rounded-full",
                          item.status === "Khẩn cấp" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"
                        )}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      {/* Litter Modal */}
      <AnimatePresence>
        {isLitterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="text-2xl font-headline font-black text-emerald-900">
                  {editingLitter ? "Sửa thông tin đàn con" : "Thêm đàn con mới"}
                </h3>
                <button 
                  onClick={() => setIsLitterModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSaveLitter} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mã đàn</label>
                    <input 
                      type="text" 
                      required
                      value={litterFormData.id}
                      onChange={(e) => setLitterFormData({...litterFormData, id: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mã lợn mẹ</label>
                    <input 
                      type="text" 
                      required
                      value={litterFormData.motherId}
                      onChange={(e) => setLitterFormData({...litterFormData, motherId: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số lượng (con)</label>
                    <input 
                      type="number" 
                      required
                      value={litterFormData.count}
                      onChange={(e) => setLitterFormData({...litterFormData, count: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Chuồng</label>
                    <input 
                      type="text" 
                      required
                      value={litterFormData.pen}
                      onChange={(e) => setLitterFormData({...litterFormData, pen: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Trạng thái</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={litterFormData.status}
                      onChange={(e) => setLitterFormData({...litterFormData, status: e.target.value})}
                    >
                      <option>Khỏe mạnh</option>
                      <option>Cần theo dõi</option>
                      <option>Yếu</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsLitterModalOpen(false)}
                    className="px-8 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="text-2xl font-headline font-black text-emerald-900">
                  {editingPig ? "Sửa thông tin lợn" : "Thêm lợn mới"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số tai / ID</label>
                    <input 
                      type="text" 
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({...formData, id: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Loại lợn</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option>Lợn nái</option>
                      <option>Lợn nọc</option>
                      <option>Lợn con</option>
                      <option>Lợn vỗ béo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Giống</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.breed}
                      onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    >
                      <option>Duroc</option>
                      <option>Landrace</option>
                      <option>Yorkshire</option>
                      <option>Pietrain</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Chuồng</label>
                    <input 
                      type="text" 
                      required
                      value={formData.pen}
                      onChange={(e) => setFormData({...formData, pen: e.target.value})}
                      placeholder="Ví dụ: A1 - Box 12"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Cân nặng (kg)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Trạng thái</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.status}
                      onChange={(e) => {
                        const status = e.target.value;
                        const statusColor = status === "Bình thường" ? "emerald" : "rose";
                        setFormData({...formData, status, statusColor});
                      }}
                    >
                      <option>Bình thường</option>
                      <option>Cảnh báo Sức khỏe</option>
                      <option>Cần theo dõi</option>
                      <option>Cách ly</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
