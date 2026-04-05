"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  ChevronRight,
  Truck,
  Download,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

import { SupplierModal } from "@/components/SupplierModal";
import { SupplierDetailModal } from "@/components/SupplierDetailModal";
import { AlertCircle, Edit2, Trash2 } from "lucide-react";

const suppliers = [
  {
    id: "1",
    name: "Công ty Thức ăn Chăn nuôi CP",
    contact: "Lê Minh Tâm",
    email: "tam.lm@cp.com.vn",
    phone: "028 3844 1122",
    address: "KCN Biên Hòa 2, Đồng Nai",
    category: "Thức ăn",
    status: "Tin cậy",
    totalPurchased: "4.5B đ",
    lastOrder: "02/04/2024"
  },
  {
    id: "2",
    name: "Tập đoàn De Heus",
    contact: "Nguyễn Thu Hà",
    email: "ha.nt@deheus.com",
    phone: "0274 3745 678",
    address: "KCN Sóng Thần, Bình Dương",
    category: "Thức ăn",
    status: "Hoạt động",
    totalPurchased: "2.8B đ",
    lastOrder: "28/03/2024"
  },
  {
    id: "3",
    name: "Công ty Thuốc Thú y Bayer",
    contact: "Trần Quốc Bảo",
    email: "bao.tq@bayer.com",
    phone: "028 3910 0200",
    address: "Quận 1, TP. HCM",
    category: "Thuốc",
    status: "Tin cậy",
    totalPurchased: "1.2B đ",
    lastOrder: "15/03/2024"
  },
  {
    id: "4",
    name: "Phân bón Bình Điền",
    contact: "Võ Văn Thắng",
    email: "thang.vv@binhdien.com",
    phone: "028 3756 1234",
    address: "Bình Chánh, TP. HCM",
    category: "Phân bón",
    status: "Hoạt động",
    totalPurchased: "850M đ",
    lastOrder: "10/03/2024"
  },
  {
    id: "5",
    name: "Hạt giống Lộc Trời",
    contact: "Đặng Thị Mai",
    email: "mai.dt@loctroi.vn",
    phone: "0296 3841 234",
    address: "Long Xuyên, An Giang",
    category: "Hạt giống",
    status: "Hoạt động",
    totalPurchased: "1.5B đ",
    lastOrder: "05/04/2024"
  }
];

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [selectedSupplierForDetail, setSelectedSupplierForDetail] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<any>(null);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleViewDetail = (supplier: any) => {
    setSelectedSupplierForDetail(supplier);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (supplier: any) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-10">
      <SupplierModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        supplier={selectedSupplier}
      />

      <SupplierDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        supplier={selectedSupplierForDetail}
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
                Bạn có chắc chắn muốn xóa nhà cung cấp <span className="font-bold text-slate-900">{supplierToDelete?.name}</span>? Hành động này không thể hoàn tác.
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
          <h2 className="text-3xl font-bold text-gray-900 font-manrope tracking-tight">Nhà cung cấp</h2>
          <p className="text-gray-500 mt-2 font-medium">Quản lý các đối tác cung ứng vật tư và dịch vụ.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
            <Download size={18} />
            Xuất báo cáo
          </button>
          <button 
            onClick={handleAddSupplier}
            className="px-6 py-3 bg-[#006c49] text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
          >
            <Plus size={18} />
            Thêm nhà cung cấp
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex gap-2">
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-50 text-[#006c49] ring-1 ring-emerald-100">Tất cả</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Thức ăn</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Thuốc</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Khác</button>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên công ty, người liên hệ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>
          <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Suppliers List */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nhà cung cấp</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Liên hệ</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lĩnh vực</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tổng mua hàng</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredSuppliers.map((supplier, i) => (
                  <motion.tr 
                    key={supplier.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleViewDetail(supplier)}
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-bold text-sm ring-2 ring-emerald-100/50 group-hover:ring-emerald-200 transition-all">
                          <Truck size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{supplier.name}</p>
                          <p className="text-xs font-medium text-gray-400 mt-0.5 flex items-center gap-1">
                            <MapPin size={10} />
                            {supplier.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-1.5">
                        <p className="text-sm font-bold text-gray-700">{supplier.contact}</p>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <Phone size={12} className="text-emerald-600" />
                          {supplier.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        supplier.category === "Thức ăn" ? "bg-amber-50 text-amber-600" :
                        supplier.category === "Thuốc" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {supplier.category}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{supplier.totalPurchased}</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-0.5">Lần cuối: {supplier.lastOrder}</p>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={cn(
                        "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
                        supplier.status === "Tin cậy" ? "text-emerald-600" : "text-blue-600"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", supplier.status === "Tin cậy" ? "bg-emerald-600" : "bg-blue-600")} />
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSupplier(supplier);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(supplier);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={20} />
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
    </div>
  );
}
