"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  ChevronRight,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { InventoryModal } from "@/components/InventoryModal";
import { AlertCircle, Edit2, Trash2, DollarSign, Hash, Tag } from "lucide-react";

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
    lastUpdated: "2 giờ trước",
    image: "https://picsum.photos/seed/corn/400/300"
  },
  {
    id: "2",
    name: "Phân bón NPK 16-16-8",
    category: "Phân bón",
    stock: 120,
    unit: "bao",
    price: "850.000đ",
    status: "Sắp hết",
    lastUpdated: "5 giờ trước",
    image: "https://picsum.photos/seed/fertilizer/400/300"
  },
  {
    id: "3",
    name: "Thuốc trừ sâu sinh học",
    category: "Thuốc",
    stock: 15,
    unit: "chai",
    price: "120.000đ",
    status: "Hết hàng",
    lastUpdated: "1 ngày trước",
    image: "https://picsum.photos/seed/pesticide/400/300"
  },
  {
    id: "4",
    name: "Hạt giống lúa OM18",
    category: "Khác",
    stock: 2000,
    unit: "kg",
    price: "18.000đ",
    status: "Còn hàng",
    lastUpdated: "3 giờ trước",
    image: "https://picsum.photos/seed/rice/400/300"
  },
  {
    id: "5",
    name: "Cám gạo nguyên chất",
    category: "Thức ăn",
    stock: 800,
    unit: "kg",
    price: "12.000đ",
    status: "Còn hàng",
    lastUpdated: "6 giờ trước",
    image: "https://picsum.photos/seed/bran/400/300"
  },
  {
    id: "6",
    name: "Vôi bột nông nghiệp",
    category: "Phân bón",
    stock: 50,
    unit: "bao",
    price: "45.000đ",
    status: "Còn hàng",
    lastUpdated: "12 giờ trước",
    image: "https://picsum.photos/seed/lime/400/300"
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

      {/* Modals */}
      {/* Removed old modal call */}

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

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                    item.status === "Còn hàng" ? "bg-emerald-500/90 text-white" :
                    item.status === "Sắp hết" ? "bg-amber-500/90 text-white" : "bg-red-500/90 text-white"
                  )}>
                    {item.status}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditItem(item);
                    }}
                    className="p-2 bg-white/80 backdrop-blur-md rounded-xl text-blue-600 hover:bg-white transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteClick(item);
                    }}
                    className="p-2 bg-white/80 backdrop-blur-md rounded-xl text-red-600 hover:bg-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{item.category}</p>
                  <p className="text-[10px] font-medium text-gray-400">{item.lastUpdated}</p>
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-manrope mb-4 group-hover:text-[#006c49] transition-colors">{item.name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tồn kho</p>
                    <p className="text-lg font-bold text-gray-900">{item.stock} <span className="text-xs font-medium text-gray-500">{item.unit}</span></p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Đơn giá</p>
                    <p className="text-lg font-bold text-gray-900">{item.price}</p>
                  </div>
                </div>

                <Link 
                  href={`/inventory/${item.id}`}
                  className="mt-auto w-full py-3 bg-[#006c49]/5 text-[#006c49] rounded-2xl text-sm font-bold hover:bg-[#006c49] hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Xem chi tiết
                  <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
