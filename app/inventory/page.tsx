"use client";

import React, { useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  AlertTriangle, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ClipboardList,
  Tag,
  Layers,
  Archive,
  X,
  Edit,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// --- Types ---

interface InventoryItem {
  id: string;
  name: string;
  category: "Thức ăn" | "Thuốc thú y" | "Công cụ" | "Khác";
  stock: number;
  unit: string;
  minStock: number;
  lastRestocked: string;
  status: "Đủ hàng" | "Sắp hết" | "Hết hàng";
  price: string;
}

// --- Mock Data ---

const inventoryItems: InventoryItem[] = [
  {
    id: "INV-001",
    name: "Cám hỗn hợp lợn thịt (Giai đoạn 1)",
    category: "Thức ăn",
    stock: 1250,
    unit: "kg",
    minStock: 500,
    lastRestocked: "15/05/2026",
    status: "Đủ hàng",
    price: "12,500đ/kg"
  },
  {
    id: "INV-002",
    name: "Cám hỗn hợp lợn nái nuôi con",
    category: "Thức ăn",
    stock: 320,
    unit: "kg",
    minStock: 400,
    lastRestocked: "10/05/2026",
    status: "Sắp hết",
    price: "14,200đ/kg"
  },
  {
    id: "INV-003",
    name: "Vaccine FMD-Vac (Lở mồm long móng)",
    category: "Thuốc thú y",
    stock: 45,
    unit: "liều",
    minStock: 100,
    lastRestocked: "05/05/2026",
    status: "Hết hàng",
    price: "45,000đ/liều"
  },
  {
    id: "INV-004",
    name: "Sát trùng chuồng trại (Can 5L)",
    category: "Thuốc thú y",
    stock: 12,
    unit: "can",
    minStock: 5,
    lastRestocked: "20/05/2026",
    status: "Đủ hàng",
    price: "350,000đ/can"
  },
  {
    id: "INV-005",
    name: "Kìm bấm tai lợn",
    category: "Công cụ",
    stock: 8,
    unit: "cái",
    minStock: 2,
    lastRestocked: "01/01/2026",
    status: "Đủ hàng",
    price: "120,000đ/cái"
  }
];

const categories = ["Tất cả", "Thức ăn", "Thuốc thú y", "Công cụ", "Khác"];

export default function InventoryPage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    id: "",
    name: "",
    category: "Thức ăn",
    stock: 0,
    unit: "kg",
    minStock: 0,
    lastRestocked: new Date().toLocaleDateString("vi-VN"),
    status: "Đủ hàng",
    price: ""
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      id: `INV-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      category: "Thức ăn",
      stock: 0,
      unit: "kg",
      minStock: 100,
      lastRestocked: new Date().toLocaleDateString("vi-VN"),
      status: "Đủ hàng",
      price: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa vật tư này không?")) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const status = (formData.stock || 0) <= 0 ? "Hết hàng" : 
                  (formData.stock || 0) <= (formData.minStock || 0) ? "Sắp hết" : "Đủ hàng";
    
    const newItem = { ...formData, status } as InventoryItem;

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? newItem : i));
    } else {
      setItems([newItem, ...items]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Quản lý Vật tư</h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi tồn kho, cảnh báo vật tư sắp hết và lịch sử nhập/xuất kho.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-all active:scale-95">
            <History size={16} /> Lịch sử kho
          </button>
          <button 
            onClick={openAddModal}
            className="px-6 py-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={18} /> Nhập kho mới
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Tổng mặt hàng</p>
          </div>
          <h3 className="text-3xl font-headline font-black text-slate-900">142</h3>
          <p className="text-xs text-slate-400 mt-1">4 danh mục chính</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Cảnh báo hết hàng</p>
          </div>
          <h3 className="text-3xl font-headline font-black text-rose-600">08</h3>
          <p className="text-xs text-rose-400 mt-1">Cần nhập hàng ngay</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Đang đặt hàng</p>
          </div>
          <h3 className="text-3xl font-headline font-black text-blue-600">03</h3>
          <p className="text-xs text-blue-400 mt-1">Dự kiến giao: 22/05</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Tag size={20} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Giá trị tồn kho</p>
          </div>
          <h3 className="text-3xl font-headline font-black text-slate-900">1.2B</h3>
          <p className="text-xs text-slate-400 mt-1">Ước tính theo giá nhập</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm tên vật tư, mã kho..." 
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
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  activeCategory === cat ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-emerald-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vật tư</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Tồn kho</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Định mức tối thiểu</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cập nhật cuối</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        {item.category === "Thức ăn" ? <Package size={18} /> : 
                         item.category === "Thuốc thú y" ? <ClipboardList size={18} /> : <Tag size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">ID: {item.id} • {item.price}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{item.category}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-black text-slate-900">{item.stock} {item.unit}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-xs font-bold text-slate-400">{item.minStock} {item.unit}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit",
                      item.status === "Đủ hàng" ? "bg-emerald-50 text-emerald-600" : 
                      item.status === "Sắp hết" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {item.status === "Đủ hàng" ? <ArrowDownLeft size={12} /> : 
                       item.status === "Sắp hết" ? <AlertTriangle size={12} /> : <ArrowUpRight size={12} />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-medium">{item.lastRestocked}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
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
        </div>

        <div className="px-6 py-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">Hiển thị 5 trong số 142 mặt hàng</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-900/20">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
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
                  {editingItem ? "Sửa thông tin vật tư" : "Thêm vật tư mới"}
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
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Tên vật tư</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ví dụ: Cám lợn thịt"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Danh mục</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    >
                      <option>Thức ăn</option>
                      <option>Thuốc thú y</option>
                      <option>Công cụ</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số lượng tồn</label>
                    <input 
                      type="number" 
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Đơn vị</label>
                    <input 
                      type="text" 
                      required
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      placeholder="kg, liều, cái..."
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Định mức tối thiểu</label>
                    <input 
                      type="number" 
                      required
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Đơn giá</label>
                    <input 
                      type="text" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Ví dụ: 15,000đ/kg"
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
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
