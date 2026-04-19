"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Edit2, 
  Trash2, 
  Download,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Supplier } from "@/shared/types";
import { supplierService } from "@/entities/supplier/api/supplier.service";

import { SupplierFormModal } from "@/features/suppliers/ui/SupplierFormModal";
import { SupplierTable } from "@/features/suppliers/ui/SupplierTable";

export default function SuppliersPage() {
// ... existing state ...
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("Tất cả");
  
  // Modals Status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Selected Data
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplierForDelete, setSelectedSupplierForDelete] = useState<Supplier | null>(null);

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
      if (response.success) setSuppliers(response.data);
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

  const confirmDelete = async () => {
    if (selectedSupplierForDelete) {
      try {
        await supplierService.deleteSupplier(selectedSupplierForDelete.id);
        await fetchSuppliers();
        setIsDeleteModalOpen(false);
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeType === "Tất cả" || s.type === activeType;
    return matchesSearch && matchesType;
  });

  const types = ["Tất cả", "Thức ăn", "Thuốc thú y", "Dụng cụ", "Con giống"];

  return (
    <div className="space-y-10 pb-20 bg-[#fbfcfd] min-h-screen -m-8 p-8 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-headline uppercase">Hợp tác Cung ứng</h1>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download size={18} /> Báo cáo NCC
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="px-8 py-3.5 bg-[#00a67d] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus size={18} /> Thêm nhà cung cấp
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {types.map((type) => (
            <button key={type} onClick={() => setActiveType(type)} className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap", activeType === type ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "text-slate-400 hover:text-slate-600")}>{type}</button>
          ))}
        </div>
        <div className="relative flex-1 lg:max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên, mã, SĐT, email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/10" 
          />
        </div>
      </div>

      {/* List Content */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <SupplierTable 
          suppliers={filteredSuppliers} 
          loading={loading}
          onEdit={(item) => handleOpenModal(item)}
          onDelete={(item) => { setSelectedSupplierForDelete(item); setIsDeleteModalOpen(true); }}
        />
      </div>

      {/* Feature Modals */}
      <SupplierFormModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} 
        editingSupplier={editingSupplier} formData={formData} setFormData={setFormData} 
      />

      {/* Confirm Delete */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedSupplierForDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-10 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Xác nhận xóa?</h3>
              <p className="text-slate-500 text-sm mt-3 mb-8 leading-relaxed">Bạn có chắc chắn muốn xóa đối tác <span className="font-bold text-slate-900">{selectedSupplierForDelete.name}</span> này không?</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest">Hủy bỏ</button>
                <button onClick={confirmDelete} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-900/10">Xác nhận xóa</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
