"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Truck, 
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Trash2,
  X,
  Save,
  Tag,
  Download,
  MoreVertical
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Supplier } from "@/shared/types";
import { supplierService } from "@/entities/supplier/api/supplier.service";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    supplierCode: "",
    name: "",
    type: "Thức ăn",
    address: "",
    phone: "",
    email: ""
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getSuppliers();
      if (response.success) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenModal = (supplier: Supplier | null = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        supplierCode: supplier.supplierCode,
        name: supplier.name,
        type: supplier.type,
        address: supplier.address,
        phone: supplier.phone,
        email: supplier.email
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        supplierCode: `NCC${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        type: "Thức ăn",
        address: "",
        phone: "",
        email: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await supplierService.updateSupplier(editingSupplier.id, formData);
      } else {
        await supplierService.createSupplier(formData);
      }
      await fetchSuppliers();
      setIsModalOpen(false);
    } catch (error) {
      alert("Lưu thất bại!");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        await supplierService.deleteSupplier(id);
        await fetchSuppliers();
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Đối tác Nhà cung cấp</h1>
          <p className="text-slate-500 mt-1 font-medium">Quản lý mạng lưới cung ứng vật tư trang trại.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
            <Download size={18} />
            Xuất báo cáo
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Thêm nhà cung cấp
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group w-full lg:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo mã, tên hoặc loại nhà cung cấp..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-slate-700 font-medium"
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <button className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold ring-1 ring-emerald-100">Tất cả</button>
          <button className="px-4 py-3 bg-slate-50 text-slate-500 rounded-2xl text-sm font-bold hover:bg-slate-100">Thức ăn</button>
          <button className="px-4 py-3 bg-slate-50 text-slate-500 rounded-2xl text-sm font-bold hover:bg-slate-100">Thuốc</button>
          <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Suppliers Table Section */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nhà cung cấp</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loại</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thông tin liên hệ</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Địa chỉ</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                      <p className="text-slate-400 mt-4 font-medium">Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <p className="text-slate-400 font-medium">Không tìm thấy nhà cung cấp nào.</p>
                    </td>
                  </tr>
                ) : filteredSuppliers.map((supplier, i) => (
                  <motion.tr 
                    key={supplier.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50/50 group transition-all duration-300"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-lg ring-2 ring-emerald-100/50 group-hover:ring-emerald-200 transition-all">
                          <Truck size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{supplier.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">{supplier.supplierCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        supplier.type === "Thức ăn" ? "bg-emerald-50 text-emerald-600" :
                        supplier.type === "Thuốc thú y" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
                      )}>
                        {supplier.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-600">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-slate-300" />
                          <span>{supplier.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-300" />
                          <span>{supplier.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-600 italic">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-300 flex-shrink-0" />
                        <span className="line-clamp-1">{supplier.address}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(supplier)}
                          className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(supplier.id)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSave} className="p-8">
                <div className="flex items-center justify-between mb-8 text-emerald-600">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {editingSupplier ? "Cập nhật Nhà cung cấp" : "Thêm Nhà cung cấp mới"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Vui lòng nhập đầy đủ thông tin đối tác.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mã nhà cung cấp</label>
                    <input 
                      type="text"
                      required
                      value={formData.supplierCode}
                      onChange={(e) => setFormData({...formData, supplierCode: e.target.value})}
                      placeholder="NCC001"
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Loại nhà cung cấp</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none"
                    >
                      <option>Thức ăn</option>
                      <option>Thuốc thú y</option>
                      <option>Dụng cụ</option>
                      <option>Con giống</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên nhà cung cấp</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Công ty CP Việt Nam"
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số điện thoại</label>
                    <input 
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="024 123 456"
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email liên hệ</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="info@ncc.vn"
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Địa chỉ trụ sở</label>
                    <input 
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="KCN Đông Anh, Hà Nội"
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {editingSupplier ? "Cập nhật" : "Lưu đối tác"}
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
