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
  UserPlus,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

import { CustomerModal } from "@/components/CustomerModal";
import { AlertCircle, Edit2, Trash2 } from "lucide-react";

const customers = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "vana@gmail.com",
    phone: "0901 234 567",
    address: "Cần Thơ",
    type: "Đại lý",
    status: "Hoạt động",
    totalOrders: 45,
    totalSpent: "1.2B đ",
    avatar: "NV"
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "thib@gmail.com",
    phone: "0902 345 678",
    address: "Vĩnh Long",
    type: "Cá nhân",
    status: "Hoạt động",
    totalOrders: 12,
    totalSpent: "250M đ",
    avatar: "TB"
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "vanc@gmail.com",
    phone: "0903 456 789",
    address: "Đồng Tháp",
    type: "Đại lý",
    status: "Tạm ngưng",
    totalOrders: 8,
    totalSpent: "180M đ",
    avatar: "LC"
  },
  {
    id: "4",
    name: "Phạm Minh D",
    email: "minhd@gmail.com",
    phone: "0904 567 890",
    address: "An Giang",
    type: "Cá nhân",
    status: "Hoạt động",
    totalOrders: 24,
    totalSpent: "560M đ",
    avatar: "PD"
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "vane@gmail.com",
    phone: "0905 678 901",
    address: "Tiền Giang",
    type: "Đại lý",
    status: "Hoạt động",
    totalOrders: 31,
    totalSpent: "890M đ",
    avatar: "HE"
  }
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<any>(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (customer: any) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-10">
      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        customer={selectedCustomer}
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
                Bạn có chắc chắn muốn xóa khách hàng <span className="font-bold text-slate-900">{customerToDelete?.name}</span>? Hành động này không thể hoàn tác.
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
          <h2 className="text-3xl font-bold text-gray-900 font-manrope tracking-tight">Danh sách Khách hàng</h2>
          <p className="text-gray-500 mt-2 font-medium">Quản lý thông tin và lịch sử giao dịch của khách hàng.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
            <Download size={18} />
            Xuất dữ liệu
          </button>
          <button 
            onClick={handleAddCustomer}
            className="px-6 py-3 bg-[#006c49] text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
          >
            <UserPlus size={18} />
            Thêm khách hàng
          </button>
        </div>
      </div>

      {/* Modals */}
      {/* Removed old modal call */}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex gap-2">
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-50 text-[#006c49] ring-1 ring-emerald-100">Tất cả</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Đại lý</button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Cá nhân</button>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên, email, số điện thoại..." 
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

      {/* Customers List */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Liên hệ</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phân loại</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tổng chi tiêu</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredCustomers.map((customer, i) => (
                  <motion.tr 
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-bold text-sm ring-2 ring-emerald-100/50 group-hover:ring-emerald-200 transition-all">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{customer.name}</p>
                          <p className="text-xs font-medium text-gray-400 mt-0.5">{customer.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <Mail size={12} className="text-emerald-600" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <Phone size={12} className="text-emerald-600" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        customer.type === "Đại lý" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      )}>
                        {customer.type}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{customer.totalSpent}</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-0.5">{customer.totalOrders} đơn hàng</p>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={cn(
                        "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
                        customer.status === "Hoạt động" ? "text-emerald-600" : "text-amber-600"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", customer.status === "Hoạt động" ? "bg-emerald-600" : "bg-amber-600")} />
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/customers/${customer.id}`}
                          className="p-2 text-gray-400 hover:text-[#006c49] hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <ChevronRight size={20} />
                        </Link>
                        <button 
                          onClick={() => handleEditCustomer(customer)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(customer)}
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
