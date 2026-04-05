"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronRight,
  Package,
  Edit2,
  Trash2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { InventoryModal } from "@/components/InventoryModal";

const categories = ["Tất cả", "Thức ăn", "Phân bón", "Thuốc", "Khác"];

const inventoryItems = [
  {
    id: "1",
    name: "Bột bắp cao cấp",
    category: "Thức ăn",
    stock: 450,
    unit: "kg",
    price: "25.000đ",
    status: "Còn hàng",
    lastUpdated: "2 giờ trước"
  },
  {
    id: "2",
    name: "Phân bón NPK 16-16-8",
    category: "Phân bón",
    stock: 120,
    unit: "bao",
    price: "850.000đ",
    status: "Sắp hết",
    lastUpdated: "5 giờ trước"
  },
  {
    id: "3",
    name: "Thuốc trừ sâu sinh học",
    category: "Thuốc",
    stock: 15,
    unit: "chai",
    price: "120.000đ",
    status: "Hết hàng",
    lastUpdated: "1 ngày trước"
  },
  {
    id: "4",
    name: "Hạt giống lúa OM18",
    category: "Khác",
    stock: 2000,
    unit: "kg",
    price: "18.000đ",
    status: "Còn hàng",
    lastUpdated: "3 giờ trước"
  },
  {
    id: "5",
    name: "Cám gạo nguyên chất",
    category: "Thức ăn",
    stock: 800,
    unit: "kg",
    price: "12.000đ",
    status: "Còn hàng",
    lastUpdated: "6 giờ trước"
  },
  {
    id: "6",
    name: "Vôi bột nông nghiệp",
    category: "Phân bón",
    stock: 50,
    unit: "bao",
    price: "45.000đ",
    status: "Còn hàng",
    lastUpdated: "12 giờ trước"
  }
];

export default function InventoryPage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const filteredItems = activeCategory === "Tất cả" 
    ? inventoryItems 
    : inventoryItems.filter(item => item.category === activeCategory);

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-10">
      <InventoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Xác nhận xóa?</h3>
              <p className="text-slate-500 mb-8">
                Bạn có chắc chắn muốn xóa vật tư <span className="font-bold text-slate-900">{itemToDelete?.name}</span>? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-manrope tracking-tight">Quản lý Kho Vật tư</h2>
          <p className="text-gray-500 mt-2 font-medium">Theo dõi và quản lý nguồn cung ứng nông nghiệp của bạn.</p>
        </div>
        <button 
          onClick={handleAddItem}
          className="px-6 py-3 bg-[#006c49] text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
        >
          <Plus size={18} />
          Nhập kho mới
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-emerald-50 text-[#006c49] ring-1 ring-emerald-100" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm vật tư..." 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>
          <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vật tư</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Danh mục</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tồn kho</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đơn giá</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-sm ring-2 ring-emerald-100/50">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.name}</p>
                          <p className="text-[10px] font-medium text-gray-400 mt-0.5">Cập nhật: {item.lastUpdated}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        item.category === "Thức ăn" ? "bg-amber-50 text-amber-600" :
                        item.category === "Thuốc" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-gray-900">{item.stock} <span className="text-xs font-medium text-gray-400">{item.unit}</span></p>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-gray-900">{item.price}</p>
                    </td>
                    <td className="px-10 py-6">
                      <span className={cn(
                        "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
                        item.status === "Còn hàng" ? "text-emerald-600" :
                        item.status === "Sắp hết" ? "text-amber-600" : "text-red-600"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          item.status === "Còn hàng" ? "bg-emerald-600" :
                          item.status === "Sắp hết" ? "bg-amber-600" : "bg-red-600"
                        )} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/inventory/${item.id}`}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <ChevronRight size={20} />
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditItem(item);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteClick(item);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-[#006c49] rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-900/40">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <Package size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-manrope">Tổng quan Kho hàng</h3>
            <p className="text-emerald-100/80 mt-1">Bạn có 2 vật tư sắp hết hàng và cần nhập thêm.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-6 border-r border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 mb-1">Tổng giá trị</p>
            <p className="text-2xl font-bold">450M</p>
          </div>
          <div className="text-center px-6 border-r border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 mb-1">Mặt hàng</p>
            <p className="text-2xl font-bold">42</p>
          </div>
          <div className="text-center px-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 mb-1">Cảnh báo</p>
            <p className="text-2xl font-bold text-amber-300">02</p>
          </div>
        </div>
      </div>
    </div>
  );
}
