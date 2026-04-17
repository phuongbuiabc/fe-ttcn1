"use client";

import React, { useState } from "react";
import { 
  LayoutGrid, 
  Thermometer, 
  Droplets, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowRightLeft, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Settings2,
  Info,
  X,
  Edit,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";

// --- Types ---

interface BarnSensor {
  type: "temp" | "humidity";
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
}

interface Barn {
  id: string;
  name: string;
  type: "Sinh sản" | "Vỗ béo" | "Cai sữa" | "Cách ly";
  capacity: number;
  currentPigs: number;
  sensors: BarnSensor[];
  status: "Khỏe mạnh" | "Cần chú ý" | "Cách ly";
  lastCleaned: string;
}

// --- Mock Data ---

const barns: Barn[] = [
  {
    id: "P-01",
    name: "Chuồng A-01",
    type: "Sinh sản",
    capacity: 100,
    currentPigs: 85,
    sensors: [
      { type: "temp", value: 26.5, unit: "°C", status: "normal" },
      { type: "humidity", value: 65, unit: "%", status: "normal" }
    ],
    status: "Khỏe mạnh",
    lastCleaned: "2 giờ trước"
  },
  {
    id: "P-02",
    name: "Chuồng A-02",
    type: "Sinh sản",
    capacity: 100,
    currentPigs: 98,
    sensors: [
      { type: "temp", value: 28.2, unit: "°C", status: "warning" },
      { type: "humidity", value: 72, unit: "%", status: "warning" }
    ],
    status: "Cần chú ý",
    lastCleaned: "5 giờ trước"
  },
  {
    id: "P-03",
    name: "Chuồng B-01",
    type: "Vỗ béo",
    capacity: 150,
    currentPigs: 145,
    sensors: [
      { type: "temp", value: 25.8, unit: "°C", status: "normal" },
      { type: "humidity", value: 60, unit: "%", status: "normal" }
    ],
    status: "Khỏe mạnh",
    lastCleaned: "1 giờ trước"
  },
  {
    id: "P-04",
    name: "Chuồng C-01",
    type: "Cách ly",
    capacity: 20,
    currentPigs: 12,
    sensors: [
      { type: "temp", value: 24.5, unit: "°C", status: "normal" },
      { type: "humidity", value: 55, unit: "%", status: "normal" }
    ],
    status: "Cách ly",
    lastCleaned: "30 phút trước"
  },
  {
    id: "P-05",
    name: "Chuồng B-02",
    type: "Vỗ béo",
    capacity: 150,
    currentPigs: 110,
    sensors: [
      { type: "temp", value: 30.5, unit: "°C", status: "critical" },
      { type: "humidity", value: 80, unit: "%", status: "critical" }
    ],
    status: "Cần chú ý",
    lastCleaned: "4 giờ trước"
  }
];

export default function BarnManagementPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Barn[]>(barns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [editingBarn, setEditingBarn] = useState<Barn | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Barn>>({
    id: "",
    name: "",
    type: "Sinh sản",
    capacity: 100,
    currentPigs: 0,
    status: "Khỏe mạnh",
    lastCleaned: "Vừa xong"
  });

  const openAddModal = () => {
    setEditingBarn(null);
    setFormData({
      id: `P-${Math.floor(10 + Math.random() * 90)}`,
      name: "",
      type: "Sinh sản",
      capacity: 100,
      currentPigs: 0,
      status: "Khỏe mạnh",
      lastCleaned: "Vừa xong"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (barn: Barn) => {
    setEditingBarn(barn);
    setFormData(barn);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa chuồng này không?")) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newBarn = {
      ...formData,
      sensors: formData.sensors || [
        { type: "temp", value: 25 + Math.random() * 5, unit: "°C", status: "normal" },
        { type: "humidity", value: 60 + Math.random() * 10, unit: "%", status: "normal" }
      ]
    } as Barn;

    if (editingBarn) {
      setItems(items.map(i => i.id === editingBarn.id ? newBarn : i));
    } else {
      setItems([newBarn, ...items]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Chuồng nuôi</h1>
          <p className="text-slate-500 text-sm mt-1">Giám sát mật độ, môi trường và tình trạng vệ sinh các khu chuồng.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsSensorModalOpen(true)}
            className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-all active:scale-95"
          >
            <Settings2 size={16} /> Cấu hình cảm biến
          </button>
          <button 
            onClick={openAddModal}
            className="px-6 py-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={18} /> Thêm chuồng mới
          </button>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm tên chuồng, loại chuồng..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter size={20} />
          </button>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode("grid")}
            className={cn(
              "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
              viewMode === "grid" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-emerald-700"
            )}
          >
            Lưới
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={cn(
              "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
              viewMode === "list" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-emerald-700"
            )}
          >
            Danh sách
          </button>
        </div>
      </div>

      {/* Barns Display */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((barn) => (
              <div key={barn.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-headline font-black text-slate-900">{barn.name}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{barn.type}</p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      barn.status === "Khỏe mạnh" ? "bg-emerald-100 text-emerald-700" : 
                      barn.status === "Cần chú ý" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                    )}>
                      {barn.status}
                    </span>
                  </div>

                  {/* Sensors */}
                  <div className="grid grid-cols-2 gap-3">
                    {barn.sensors.map((sensor, sIdx) => (
                      <div key={sIdx} className={cn(
                        "p-3 rounded-2xl border flex items-center gap-3",
                        sensor.status === "normal" ? "bg-slate-50 border-slate-100" : 
                        sensor.status === "warning" ? "bg-amber-50 border-amber-100" : "bg-rose-50 border-rose-100"
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center",
                          sensor.status === "normal" ? "bg-white text-slate-400" : 
                          sensor.status === "warning" ? "bg-white text-amber-500" : "bg-white text-rose-500"
                        )}>
                          {sensor.type === "temp" ? <Thermometer size={16} /> : <Droplets size={16} />}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{sensor.type === "temp" ? "Nhiệt độ" : "Độ ẩm"}</p>
                          <p className={cn(
                            "text-sm font-black",
                            sensor.status === "normal" ? "text-slate-900" : 
                            sensor.status === "warning" ? "text-amber-700" : "text-rose-700"
                          )}>{sensor.value}{sensor.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Capacity */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400 uppercase tracking-widest">Mật độ</span>
                      <span className="text-slate-900">{barn.currentPigs}/{barn.capacity} con</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000",
                          (barn.currentPigs / barn.capacity) > 0.9 ? "bg-rose-500" : 
                          (barn.currentPigs / barn.capacity) > 0.7 ? "bg-amber-500" : "bg-emerald-600"
                        )} 
                        style={{ width: `${(barn.currentPigs / barn.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Activity size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Vệ sinh: {barn.lastCleaned}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsTransferModalOpen(true)}
                      className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Chuyển đàn"
                    >
                      <ArrowRightLeft size={18} />
                    </button>
                    <button 
                      onClick={() => openEditModal(barn)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(barn.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chuồng</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mật độ</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Môi trường</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vệ sinh</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((barn) => (
                <tr key={barn.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900 text-sm">{barn.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">ID: {barn.id}</p>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium">{barn.type}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-xs w-12">{Math.round((barn.currentPigs / barn.capacity) * 100)}%</span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full",
                            (barn.currentPigs / barn.capacity) > 0.9 ? "bg-rose-500" : "bg-emerald-600"
                          )} 
                          style={{ width: `${(barn.currentPigs / barn.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Thermometer size={14} className="text-slate-400" />
                        {barn.sensors[0].value}°C
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Droplets size={14} className="text-slate-400" />
                        {barn.sensors[1].value}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                      barn.status === "Khỏe mạnh" ? "bg-emerald-100 text-emerald-700" : 
                      barn.status === "Cần chú ý" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                    )}>
                      {barn.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-medium">{barn.lastCleaned}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setIsTransferModalOpen(true)}
                        className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Chuyển đàn"
                      >
                        <ArrowRightLeft size={18} />
                      </button>
                      <button 
                        onClick={() => openEditModal(barn)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(barn.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-lg shadow-emerald-900/20">
          <p className="text-emerald-100/60 text-[10px] uppercase font-bold tracking-widest mb-2">Tổng số chuồng</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-headline font-black">24</h3>
            <span className="text-emerald-400 text-xs font-bold">+2 mới</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">Mật độ trung bình</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-headline font-black text-slate-900">82%</h3>
            <span className="text-emerald-600 text-xs font-bold">Ổn định</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">Cảnh báo môi trường</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-headline font-black text-rose-600">03</h3>
            <AlertTriangle size={20} className="text-rose-500 animate-pulse" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">Lịch vệ sinh hôm nay</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-headline font-black text-slate-900">12</h3>
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
        </div>
      </div>
      {/* Transfer Modal */}
      <AnimatePresence>
        {isTransferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-headline font-black text-emerald-900">Chuyển đàn/Chuyển chuồng</h3>
                <button onClick={() => setIsTransferModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Chuồng nguồn</label>
                  <p className="font-bold text-slate-900">Chuồng A-01</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Chuồng đích</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none">
                    {items.map(b => <option key={b.id} value={b.id}>{b.name} ({b.type})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số lượng chuyển</label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="0" />
                </div>
                <button 
                  onClick={() => setIsTransferModalOpen(false)}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                >
                  Xác nhận chuyển
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sensor Config Modal */}
      <AnimatePresence>
        {isSensorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-headline font-black text-emerald-900">Cấu hình cảm biến</h3>
                <button onClick={() => setIsSensorModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Ngưỡng nhiệt độ tối đa</span>
                    <input type="number" className="w-20 px-3 py-1.5 bg-slate-50 border-none rounded-lg text-sm font-bold text-right" defaultValue={30} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Ngưỡng nhiệt độ tối thiểu</span>
                    <input type="number" className="w-20 px-3 py-1.5 bg-slate-50 border-none rounded-lg text-sm font-bold text-right" defaultValue={22} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Ngưỡng độ ẩm tối đa</span>
                    <input type="number" className="w-20 px-3 py-1.5 bg-slate-50 border-none rounded-lg text-sm font-bold text-right" defaultValue={80} />
                  </div>
                </div>
                <button 
                  onClick={() => setIsSensorModalOpen(false)}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                >
                  Lưu cấu hình
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
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
                  {editingBarn ? "Sửa thông tin chuồng" : "Thêm chuồng mới"}
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
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Tên chuồng</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ví dụ: Chuồng A-01"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Loại chuồng</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option>Sinh sản</option>
                      <option>Vỗ béo</option>
                      <option>Cai sữa</option>
                      <option>Cách ly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Sức chứa (con)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số lượng hiện tại</label>
                    <input 
                      type="number" 
                      required
                      value={formData.currentPigs}
                      onChange={(e) => setFormData({...formData, currentPigs: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Trạng thái</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option>Khỏe mạnh</option>
                      <option>Cần chú ý</option>
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
