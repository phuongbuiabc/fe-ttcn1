"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Calendar,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  FileText,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  AlertCircle,
  Download,
  TrendingUp,
  Scale,
  DollarSign,
  Edit,
  User,
  Mail,
  Phone,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";

// Shared components
import { BaseModal } from "@/shared/components/ui/BaseModal";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { CustomSelect } from "@/shared/components/ui/CustomSelect";

// --- Types ---
interface ExportInvoiceDetail {
  id: string;
  subjectType: "Lợn" | "Con";
  pigId: string | null;     // null if subjectType = "Con"
  herdId: string | null;    // null if subjectType = "Lợn"
  herdName?: string;        // Name of the piglet herd
  quantity: number;         // weight (kg) for Lợn, quantity of piglets for Con
  unitPrice: number;        // vnđ/kg for Lợn, vnđ/con for Con
  offset: number;           // offset amount (for Con only)
  totalAmount: number;      // quantity * unitPrice + offset (offset = 0 for Lợn)
}

interface ExportInvoice {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  status: "Đã thanh toán" | "Chờ thanh toán" | "Đã xuất kho";
  pigCount: number;         // count of adult pigs sold
  pigletCount: number;      // count of piglets sold
  totalPrice: number;       // total price
  details: ExportInvoiceDetail[];
}

// --- Mock Data ---
const DEFAULT_INVOICES: ExportInvoice[] = [
  {
    id: "EXP-2026-001",
    customerName: "Lò mổ Xuyên Á",
    phone: "0987654321",
    email: "xuyena@gmail.com",
    date: "03/06/2026",
    status: "Đã thanh toán",
    pigCount: 2,
    pigletCount: 0,
    totalPrice: 13200000,
    details: [
      {
        id: "DET-001",
        subjectType: "Lợn",
        pigId: "L-001",
        herdId: null,
        quantity: 110,
        unitPrice: 60000,
        offset: 0,
        totalAmount: 6600000
      },
      {
        id: "DET-002",
        subjectType: "Lợn",
        pigId: "L-002",
        herdId: null,
        quantity: 115,
        unitPrice: 57391,
        offset: 0,
        totalAmount: 6600000
      }
    ]
  },
  {
    id: "EXP-2026-002",
    customerName: "Trang trại Hợp Nhất",
    phone: "0912345678",
    email: "hopnhatfarm@gmail.com",
    date: "02/06/2026",
    status: "Chờ thanh toán",
    pigCount: 0,
    pigletCount: 25,
    totalPrice: 38000000,
    details: [
      {
        id: "DET-003",
        subjectType: "Con",
        pigId: null,
        herdId: "H-001",
        herdName: "Đàn lợn con chuồng 01 - 25 con",
        quantity: 25,
        unitPrice: 1500000,
        offset: 500000,
        totalAmount: 38000000
      }
    ]
  },
  {
    id: "EXP-2026-003",
    customerName: "Đại lý Thực phẩm Maocao",
    phone: "0909090909",
    email: "maocao@gmail.com",
    date: "01/06/2026",
    status: "Đã xuất kho",
    pigCount: 1,
    pigletCount: 15,
    totalPrice: 28350000,
    details: [
      {
        id: "DET-004",
        subjectType: "Lợn",
        pigId: "L-003",
        herdId: null,
        quantity: 105,
        unitPrice: 59000,
        offset: 0,
        totalAmount: 6195000
      },
      {
        id: "DET-005",
        subjectType: "Con",
        pigId: null,
        herdId: "H-002",
        herdName: "Đàn lợn con chuồng 03 - 18 con",
        quantity: 15,
        unitPrice: 1450000,
        offset: 400000,
        totalAmount: 22150000
      }
    ]
  }
];

const AVAILABLE_PIGS = [
  { value: "L-001", label: "L-001 (Lợn nái - 110 kg)", weight: 110 },
  { value: "L-002", label: "L-002 (Lợn thịt - 115 kg)", weight: 115 },
  { value: "L-003", label: "L-003 (Lợn nọc - 105 kg)", weight: 105 },
  { value: "L-004", label: "L-004 (Lợn thịt - 98 kg)", weight: 98 },
  { value: "L-005", label: "L-005 (Lợn nái - 120 kg)", weight: 120 },
  { value: "L-006", label: "L-006 (Lợn thịt - 102 kg)", weight: 102 },
  { value: "L-007", label: "L-007 (Lợn thịt - 95 kg)", weight: 95 }
];

const AVAILABLE_HERDS = [
  { value: "H-001", label: "H-001 (Đàn con chuồng 01 - 25 con)", name: "Đàn lợn con chuồng 01 - 25 con", count: 25 },
  { value: "H-002", label: "H-002 (Đàn con chuồng 03 - 18 con)", name: "Đàn lợn con chuồng 03 - 18 con", count: 18 },
  { value: "H-003", label: "H-003 (Đàn con chuồng 05 - 30 con)", name: "Đàn lợn con chuồng 05 - 30 con", count: 30 },
  { value: "H-004", label: "H-004 (Đàn con chuồng 08 - 22 con)", name: "Đàn lợn con chuồng 08 - 22 con", count: 22 }
];

// Helper to format currency
const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function ExportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [records, setRecords] = useState<ExportInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selections
  const [selectedInvoice, setSelectedInvoice] = useState<ExportInvoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<ExportInvoice | null>(null);
  const [editingRecord, setEditingRecord] = useState<ExportInvoice | null>(null);

  // Form State
  const [formStep, setFormStep] = useState<"customer" | "details">("customer");
  const [invoiceCode, setInvoiceCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [exportDate, setExportDate] = useState("");
  const [status, setStatus] = useState<"Đã thanh toán" | "Chờ thanh toán" | "Đã xuất kho">("Chờ thanh toán");

  // Dynamic lists in form
  const [pigLines, setPigLines] = useState<{
    id: string;
    pigId: string;
    weight: number;
    unitPrice: number;
  }[]>([]);

  const [pigletLines, setPigletLines] = useState<{
    id: string;
    herdId: string;
    quantity: number;
    unitPrice: number;
    offset: number;
  }[]>([]);

  // Validation errors
  const [errors, setErrors] = useState<{
    customerName?: string;
    phone?: string;
    exportDate?: string;
    lines?: string;
    pigLines?: Record<string, { pigId?: string; weight?: string; unitPrice?: string }>;
    pigletLines?: Record<string, { herdId?: string; quantity?: string; unitPrice?: string; offset?: string }>;
  }>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mdfarm_export_invoices");
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse export invoices from localStorage", e);
        setRecords(DEFAULT_INVOICES);
        localStorage.setItem("mdfarm_export_invoices", JSON.stringify(DEFAULT_INVOICES));
      }
    } else {
      setRecords(DEFAULT_INVOICES);
      localStorage.setItem("mdfarm_export_invoices", JSON.stringify(DEFAULT_INVOICES));
    }
    setLoading(false);
  }, []);

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.phone.includes(searchTerm);
    const matchesStatus = filterStatus === "Tất cả" || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate dynamic stats
  const totalRevenue = filteredRecords.reduce((sum, r) => sum + r.totalPrice, 0);
  const totalPigsSold = filteredRecords.reduce((sum, r) => sum + r.pigCount, 0);
  const totalPigletsSold = filteredRecords.reduce((sum, r) => sum + r.pigletCount, 0);

  const stats = [
    { label: "Doanh thu xuất bán", value: formatVND(totalRevenue), icon: DollarSign, color: "emerald" },
    { label: "Tổng số lợn lớn bán", value: `${totalPigsSold} con`, icon: Scale, color: "blue" },
    { label: "Tổng số lợn con bán", value: `${totalPigletsSold} con`, icon: TrendingUp, color: "amber" }
  ];

  // Open creation modal
  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setFormStep("customer");
    setInvoiceCode(`EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setCustomerName("");
    setPhone("");
    setEmail("");
    setExportDate(new Date().toLocaleDateString("vi-VN"));
    setStatus("Chờ thanh toán");
    setPigLines([]);
    setPigletLines([]);
    setErrors({});
    setIsFormModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (invoice: ExportInvoice) => {
    setEditingRecord(invoice);
    setFormStep("customer");
    setInvoiceCode(invoice.id);
    setCustomerName(invoice.customerName);
    setPhone(invoice.phone);
    setEmail(invoice.email);
    setExportDate(invoice.date);
    setStatus(invoice.status);

    // Map details to lines
    const pigs = invoice.details
      .filter(d => d.subjectType === "Lợn")
      .map(d => ({
        id: d.id,
        pigId: d.pigId || "",
        weight: d.quantity,
        unitPrice: d.unitPrice
      }));

    const piglets = invoice.details
      .filter(d => d.subjectType === "Con")
      .map(d => ({
        id: d.id,
        herdId: d.herdId || "",
        quantity: d.quantity,
        unitPrice: d.unitPrice,
        offset: d.offset
      }));

    setPigLines(pigs);
    setPigletLines(piglets);
    setErrors({});
    setIsFormModalOpen(true);
  };

  // Delete handler
  const handleOpenDeleteModal = (invoice: ExportInvoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!invoiceToDelete) return;
    const updated = records.filter(r => r.id !== invoiceToDelete.id);
    setRecords(updated);
    localStorage.setItem("mdfarm_export_invoices", JSON.stringify(updated));
    setIsDeleteModalOpen(false);
    setInvoiceToDelete(null);

    // Send action event
    window.dispatchEvent(new CustomEvent("mdfarm-notifications-updated"));
  };

  // View details handler
  const handleOpenDetailModal = (invoice: ExportInvoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  // Form lines management
  const addPigLine = () => {
    setPigLines([
      ...pigLines,
      {
        id: Math.random().toString(36).substring(2, 9),
        pigId: "",
        weight: 0,
        unitPrice: 60000
      }
    ]);
  };

  const removePigLine = (id: string) => {
    setPigLines(pigLines.filter(line => line.id !== id));
  };

  const updatePigLine = (id: string, field: "pigId" | "weight" | "unitPrice", value: any) => {
    setPigLines(pigLines.map(line => {
      if (line.id === id) {
        let updated = { ...line, [field]: value };
        if (field === "pigId") {
          const selectedPig = AVAILABLE_PIGS.find(p => p.value === value);
          if (selectedPig) {
            updated.weight = selectedPig.weight;
          }
        }
        return updated;
      }
      return line;
    }));
  };

  const addPigletLine = () => {
    setPigletLines([
      ...pigletLines,
      {
        id: Math.random().toString(36).substring(2, 9),
        herdId: "",
        quantity: 0,
        unitPrice: 1500000,
        offset: 0
      }
    ]);
  };

  const removePigletLine = (id: string) => {
    setPigletLines(pigletLines.filter(line => line.id !== id));
  };

  const updatePigletLine = (id: string, field: "herdId" | "quantity" | "unitPrice" | "offset", value: any) => {
    setPigletLines(pigletLines.map(line => {
      if (line.id === id) {
        let updated = { ...line, [field]: value };
        if (field === "herdId") {
          const selectedHerd = AVAILABLE_HERDS.find(h => h.value === value);
          if (selectedHerd) {
            updated.quantity = selectedHerd.count;
          }
        }
        return updated;
      }
      return line;
    }));
  };

  // Validation
  const validateCustomerStep = () => {
    const tempErrors: typeof errors = {};
    if (!customerName.trim()) {
      tempErrors.customerName = "Vui lòng nhập tên khách hàng";
    }
    if (!phone.trim()) {
      tempErrors.phone = "Vui lòng nhập số điện thoại liên hệ";
    } else if (!/^[0-9+ ]{9,13}$/.test(phone.trim())) {
      tempErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!exportDate.trim()) {
      tempErrors.exportDate = "Vui lòng chọn ngày xuất hàng";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateLinesStep = () => {
    const tempErrors: typeof errors = { pigLines: {}, pigletLines: {} };
    let isValid = true;

    if (pigLines.length === 0 && pigletLines.length === 0) {
      tempErrors.lines = "Vui lòng thêm ít nhất một dòng chi tiết bán lợn hoặc bán lợn con";
      isValid = false;
    }

    pigLines.forEach(line => {
      const lineErrors: { pigId?: string; weight?: string; unitPrice?: string } = {};
      if (!line.pigId) {
        lineErrors.pigId = "Vui lòng chọn mã lợn";
        isValid = false;
      }
      if (line.weight <= 0) {
        lineErrors.weight = "Cân nặng phải lớn hơn 0";
        isValid = false;
      }
      if (line.unitPrice <= 0) {
        lineErrors.unitPrice = "Đơn giá phải lớn hơn 0";
        isValid = false;
      }
      if (Object.keys(lineErrors).length > 0) {
        tempErrors.pigLines![line.id] = lineErrors;
      }
    });

    pigletLines.forEach(line => {
      const lineErrors: { herdId?: string; quantity?: string; unitPrice?: string; offset?: string } = {};
      if (!line.herdId) {
        lineErrors.herdId = "Vui lòng chọn đàn lợn con";
        isValid = false;
      }
      if (line.quantity <= 0) {
        lineErrors.quantity = "Số lượng phải lớn hơn 0";
        isValid = false;
      }
      if (line.unitPrice <= 0) {
        lineErrors.unitPrice = "Đơn giá phải lớn hơn 0";
        isValid = false;
      }
      if (Object.keys(lineErrors).length > 0) {
        tempErrors.pigletLines![line.id] = lineErrors;
      }
    });

    setErrors(tempErrors);
    return isValid;
  };

  // Submit invoice
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCustomerStep()) return;
    if (formStep === "customer") {
      setFormStep("details");
      return;
    }
    if (!validateLinesStep()) return;

    // Build details payload
    const detailsPayload: ExportInvoiceDetail[] = [
      ...pigLines.map(line => ({
        id: line.id,
        subjectType: "Lợn" as const,
        pigId: line.pigId,
        herdId: null,
        quantity: line.weight,
        unitPrice: line.unitPrice,
        offset: 0,
        totalAmount: line.weight * line.unitPrice
      })),
      ...pigletLines.map(line => {
        const herdObj = AVAILABLE_HERDS.find(h => h.value === line.herdId);
        return {
          id: line.id,
          subjectType: "Con" as const,
          pigId: null,
          herdId: line.herdId,
          herdName: herdObj ? herdObj.name : "Đàn lợn con",
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          offset: line.offset,
          totalAmount: line.quantity * line.unitPrice + line.offset
        };
      })
    ];

    const pigCount = pigLines.length;
    const pigletCount = pigletLines.reduce((sum, line) => sum + line.quantity, 0);
    const totalPrice = detailsPayload.reduce((sum, line) => sum + line.totalAmount, 0);

    const newInvoice: ExportInvoice = {
      id: invoiceCode,
      customerName,
      phone,
      email: email || "Chưa cập nhật",
      date: exportDate,
      status,
      pigCount,
      pigletCount,
      totalPrice,
      details: detailsPayload
    };

    let updatedRecords: ExportInvoice[];
    if (editingRecord) {
      updatedRecords = records.map(r => r.id === editingRecord.id ? newInvoice : r);
    } else {
      updatedRecords = [newInvoice, ...records];
    }

    setRecords(updatedRecords);
    localStorage.setItem("mdfarm_export_invoices", JSON.stringify(updatedRecords));
    setIsFormModalOpen(false);

    // Send action event
    window.dispatchEvent(new CustomEvent("mdfarm-notifications-updated"));
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Xuất lợn</h1>
          <p className="text-slate-500 text-sm mt-1"></p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white text-slate-600 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-50 border border-slate-100 transition-all active:scale-95">
            <Download size={16} /> Xuất báo cáo Excel
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-2 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={18} /> Tạo đơn bán mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <stat.icon size={64} className={cn(
                stat.color === "emerald" ? "text-emerald-600" :
                  stat.color === "amber" ? "text-amber-500" : "text-blue-500"
              )} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-3xl font-headline font-black text-slate-900">{stat.value}</h3>
            <div className={cn(
              "mt-4 h-1 w-12 rounded-full",
              stat.color === "emerald" ? "bg-emerald-500" :
                stat.color === "amber" ? "bg-amber-500" : "bg-blue-500"
            )} />
          </div>
        ))}
      </div>

      {/* Table & Filtering */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm mã đơn, tên khách hàng, số điện thoại..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-slate-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {["Tất cả", "Chờ thanh toán", "Đã thanh toán", "Đã xuất kho"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={cn(
                  "px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider",
                  filterStatus === st ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-emerald-700"
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices List */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold">Đang tải danh sách hóa đơn...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold flex flex-col items-center justify-center gap-3">
              <FileText size={48} className="text-slate-300" />
              <span>Không tìm thấy hóa đơn nào phù hợp.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã hóa đơn</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày xuất</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Lợn lớn</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Lợn con</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tổng tiền</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRecords.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() => handleOpenDetailModal(invoice)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <span className="font-black text-slate-900 text-sm">{invoice.id}</span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 font-bold">{invoice.date}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 shadow-sm shrink-0">
                          <User size={15} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-none">{invoice.customerName}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 leading-none">{invoice.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-slate-700 text-right">{invoice.pigCount} con</td>
                    <td className="px-6 py-5 text-sm font-black text-slate-700 text-right">{invoice.pigletCount} con</td>
                    <td className="px-6 py-5 text-sm font-black text-emerald-700 text-right">{formatVND(invoice.totalPrice)}</td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit shadow-sm",
                        invoice.status === "Đã thanh toán" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          invoice.status === "Đã xuất kho" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                      )}>
                        {invoice.status === "Đã thanh toán" ? <CheckCircle2 size={12} /> :
                          invoice.status === "Đã xuất kho" ? <Package size={12} /> : <Clock size={12} />}
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenDetailModal(invoice); }}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEditModal(invoice); }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal(invoice); }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Xóa đơn hàng"
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

        {/* Table footer / pagination */}
        <div className="px-6 py-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-bold">Hiển thị {filteredRecords.length} trong số {records.length} đơn xuất bán</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-600 text-white text-xs font-black shadow-lg shadow-emerald-900/20">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <BaseModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="CHI TIẾT HÓA ĐƠN XUẤT LỢN"
        subtitle={selectedInvoice ? `Mã hóa đơn: ${selectedInvoice.id}` : ""}
        className="max-w-3xl"
      >
        {selectedInvoice && (
          <div className="space-y-8">
            {/* Customer Details Block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</p>
                <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  {selectedInvoice.customerName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Điện thoại / Email</p>
                <p className="text-xs font-bold text-slate-600 flex flex-col gap-0.5">
                  <span className="flex items-center gap-2"><Phone size={12} className="text-slate-400" /> {selectedInvoice.phone}</span>
                  {selectedInvoice.email && <span className="flex items-center gap-2"><Mail size={12} className="text-slate-400" /> {selectedInvoice.email}</span>}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày xuất / Trạng thái</p>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-2"><Calendar size={12} className="text-slate-400" /> {selectedInvoice.date}</span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 w-fit shadow-inner",
                    selectedInvoice.status === "Đã thanh toán" ? "bg-emerald-100 text-emerald-800" :
                      selectedInvoice.status === "Đã xuất kho" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                  )}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Adult Pigs Details Table */}
            {selectedInvoice.details.filter(d => d.subjectType === "Lợn").length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1">
                  <div className="w-1 h-4 rounded-full bg-emerald-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Chi tiết bán lợn lớn</h4>
                </div>
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Mã lợn / Số tai</th>
                        <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Cân nặng (kg)</th>
                        <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Đơn giá (vnđ/kg)</th>
                        <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {selectedInvoice.details.filter(d => d.subjectType === "Lợn").map((detail) => (
                        <tr key={detail.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-black text-slate-800">{detail.pigId}</td>
                          <td className="px-4 py-3 font-bold text-slate-600 text-right">{detail.quantity} kg</td>
                          <td className="px-4 py-3 font-bold text-slate-600 text-right">{formatVND(detail.unitPrice)}</td>
                          <td className="px-4 py-3 font-black text-emerald-700 text-right">{formatVND(detail.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Piglet Herds Details Table */}
            {selectedInvoice.details.filter(d => d.subjectType === "Con").length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 ml-1">
                  <div className="w-1 h-4 rounded-full bg-amber-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Chi tiết bán lợn con</h4>
                </div>
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Tên đàn con</th>
                        <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Số lượng (con)</th>
                        <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Đơn giá (vnđ/con)</th>
                        <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Phát sinh (vnđ)</th>
                        <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {selectedInvoice.details.filter(d => d.subjectType === "Con").map((detail) => (
                        <tr key={detail.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-black text-slate-800">{detail.herdName || detail.herdId}</td>
                          <td className="px-4 py-3 font-bold text-slate-600 text-right">{detail.quantity} con</td>
                          <td className="px-4 py-3 font-bold text-slate-600 text-right">{formatVND(detail.unitPrice)}</td>
                          <td className="px-4 py-3 font-bold text-rose-600 text-right">+{formatVND(detail.offset)}</td>
                          <td className="px-4 py-3 font-black text-emerald-700 text-right">{formatVND(detail.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Total invoice block */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 p-6 rounded-3xl">
              <div className="flex gap-6 text-xs font-bold text-slate-500">
                <p>Tổng lợn lớn: <span className="text-slate-800 font-black">{selectedInvoice.pigCount} con</span></p>
                <p>Tổng lợn con: <span className="text-slate-800 font-black">{selectedInvoice.pigletCount} con</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tổng cộng thành tiền</p>
                <p className="text-2xl font-black text-emerald-700 mt-1">{formatVND(selectedInvoice.totalPrice)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </BaseModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa hóa đơn bán"
        description={invoiceToDelete ? `Bạn có chắc chắn muốn xóa hóa đơn xuất lợn ${invoiceToDelete.id}? Hành động này không thể hoàn tác.` : ""}
        type="danger"
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
      />

      {/* Creation / Editing Modal Wizard */}
      <BaseModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingRecord ? "CẬP NHẬT HÓA ĐƠN BÁN" : "TẠO HÓA ĐƠN BÁN MỚI"}
        subtitle={`Mã đơn hàng: ${invoiceCode}`}
        className="max-w-4xl"
      >
        <form onSubmit={handleSaveInvoice} className="space-y-8">
          {/* Step tabs header */}
          <div className="flex border-b border-slate-100 p-1 bg-slate-50 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                if (formStep === "details" && !validateCustomerStep()) return;
                setFormStep("customer");
              }}
              className={cn(
                "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                formStep === "customer"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              1. Thông tin khách hàng
            </button>
            <button
              type="button"
              onClick={() => {
                if (validateCustomerStep()) {
                  setFormStep("details");
                }
              }}
              className={cn(
                "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                formStep === "details"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              2. Chi tiết xuất bán
            </button>
          </div>

          {/* Form Content body */}
          {formStep === "customer" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tên khách hàng</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors({ ...errors, customerName: undefined });
                    }}
                    placeholder="Nhập tên đại lý, lò mổ, khách hàng..."
                    className={cn(
                      "w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white outline-none transition-all",
                      errors.customerName && "border-rose-500 bg-rose-50/10 focus:border-rose-500"
                    )}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-rose-500 font-bold flex items-center gap-1"><AlertCircle size={12} /> {errors.customerName}</p>
                  )}
                </div>

                {/* Customer Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số điện thoại</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder="Nhập SĐT khách hàng..."
                    className={cn(
                      "w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white outline-none transition-all",
                      errors.phone && "border-rose-500 bg-rose-50/10 focus:border-rose-500"
                    )}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-500 font-bold flex items-center gap-1"><AlertCircle size={12} /> {errors.phone}</p>
                  )}
                </div>

                {/* Customer Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email (Không bắt buộc)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="khachhang@example.com"
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white outline-none transition-all"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày xuất hàng</label>
                  <input
                    type="text"
                    value={exportDate}
                    onChange={(e) => {
                      setExportDate(e.target.value);
                      if (errors.exportDate) setErrors({ ...errors, exportDate: undefined });
                    }}
                    placeholder="DD/MM/YYYY"
                    className={cn(
                      "w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:border-emerald-500/20 focus:bg-white outline-none transition-all",
                      errors.exportDate && "border-rose-500 bg-rose-50/10 focus:border-rose-500"
                    )}
                  />
                  {errors.exportDate && (
                    <p className="text-xs text-rose-500 font-bold flex items-center gap-1"><AlertCircle size={12} /> {errors.exportDate}</p>
                  )}
                </div>

                {/* Invoice Status */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái thanh toán</label>
                  <CustomSelect
                    value={status}
                    onChange={(val) => setStatus(val as any)}
                    options={[
                      { value: "Chờ thanh toán", label: "Chờ thanh toán" },
                      { value: "Đã thanh toán", label: "Đã thanh toán" },
                      { value: "Đã xuất kho", label: "Đã xuất kho" }
                    ]}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
              {errors.lines && (
                <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2 border border-rose-100 shadow-sm">
                  <AlertCircle size={16} />
                  {errors.lines}
                </div>
              )}

              {/* SECTION A: Adult Pigs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 rounded-full bg-emerald-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">1. Danh sách bán lợn lớn (Theo Cân nặng)</h4>
                  </div>
                  <button
                    type="button"
                    onClick={addPigLine}
                    className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm"
                  >
                    <Plus size={12} /> Thêm lợn lớn
                  </button>
                </div>

                {pigLines.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium bg-slate-50 border border-slate-100 rounded-2xl italic">
                    Chưa có lợn lớn nào được thêm vào hóa đơn.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pigLines.map((line, idx) => {
                      const lineErr = errors.pigLines?.[line.id];
                      return (
                        <div key={line.id} className="p-4 bg-white border border-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center shadow-sm relative group">
                          {/* Pig tag select */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Chọn mã lợn</label>
                            <CustomSelect
                              value={line.pigId}
                              onChange={(val) => updatePigLine(line.id, "pigId", val)}
                              options={AVAILABLE_PIGS}
                              size="sm"
                              error={!!lineErr?.pigId}
                            />
                            {lineErr?.pigId && (
                              <p className="text-[10px] text-rose-500 font-bold leading-none mt-1">{lineErr.pigId}</p>
                            )}
                          </div>

                          {/* Weight */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Cân nặng (kg)</label>
                            <input
                              type="number"
                              value={line.weight || ""}
                              onChange={(e) => updatePigLine(line.id, "weight", parseFloat(e.target.value) || 0)}
                              placeholder="kg"
                              className={cn(
                                "w-full px-3 py-2 bg-slate-50 border-2 border-transparent rounded-xl text-xs font-bold focus:bg-white outline-none focus:border-emerald-500/20",
                                lineErr?.weight && "border-rose-500 bg-rose-50/10 focus:border-rose-500"
                              )}
                            />
                            {lineErr?.weight && (
                              <p className="text-[10px] text-rose-500 font-bold leading-none mt-1">{lineErr.weight}</p>
                            )}
                          </div>

                          {/* Price/kg */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Đơn giá (vnđ/kg)</label>
                            <input
                              type="number"
                              value={line.unitPrice || ""}
                              onChange={(e) => updatePigLine(line.id, "unitPrice", parseInt(e.target.value) || 0)}
                              placeholder="đ/kg"
                              className={cn(
                                "w-full px-3 py-2 bg-slate-50 border-2 border-transparent rounded-xl text-xs font-bold focus:bg-white outline-none focus:border-emerald-500/20",
                                lineErr?.unitPrice && "border-rose-500 bg-rose-50/10 focus:border-rose-500"
                              )}
                            />
                            {lineErr?.unitPrice && (
                              <p className="text-[10px] text-rose-500 font-bold leading-none mt-1">{lineErr.unitPrice}</p>
                            )}
                          </div>

                          {/* Total and delete */}
                          <div className="flex items-center justify-between pl-2">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Thành tiền</p>
                              <p className="text-sm font-black text-emerald-700 mt-1">{formatVND(line.weight * line.unitPrice)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePigLine(line.id)}
                              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION B: Piglet Herds */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 rounded-full bg-amber-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">2. Danh sách bán đàn lợn con (Theo Con + Phát sinh)</h4>
                  </div>
                  <button
                    type="button"
                    onClick={addPigletLine}
                    className="px-3.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm"
                  >
                    <Plus size={12} /> Thêm đàn con
                  </button>
                </div>

                {pigletLines.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium bg-slate-50 border border-slate-100 rounded-2xl italic">
                    Chưa có đàn lợn con nào được thêm vào hóa đơn.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pigletLines.map((line, idx) => {
                      const lineErr = errors.pigletLines?.[line.id];
                      return (
                        <div key={line.id} className="p-4 bg-white border border-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-5 gap-4 items-center shadow-sm relative group">
                          {/* Herd select */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Chọn đàn lợn con</label>
                            <CustomSelect
                              value={line.herdId}
                              onChange={(val) => updatePigletLine(line.id, "herdId", val)}
                              options={AVAILABLE_HERDS}
                              size="sm"
                              error={!!lineErr?.herdId}
                            />
                            {lineErr?.herdId && (
                              <p className="text-[10px] text-rose-500 font-bold leading-none mt-1">{lineErr.herdId}</p>
                            )}
                          </div>

                          {/* Count */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Số lượng (con)</label>
                            <input
                              type="number"
                              value={line.quantity || ""}
                              onChange={(e) => updatePigletLine(line.id, "quantity", parseInt(e.target.value) || 0)}
                              placeholder="Số lượng"
                              className={cn(
                                "w-full px-3 py-2 bg-slate-50 border-2 border-transparent rounded-xl text-xs font-bold focus:bg-white outline-none focus:border-emerald-500/20",
                                lineErr?.quantity && "border-rose-500 bg-rose-50/10 focus:border-rose-500"
                              )}
                            />
                            {lineErr?.quantity && (
                              <p className="text-[10px] text-rose-500 font-bold leading-none mt-1">{lineErr.quantity}</p>
                            )}
                          </div>

                          {/* Price/con */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Đơn giá (đ/con)</label>
                            <input
                              type="number"
                              value={line.unitPrice || ""}
                              onChange={(e) => updatePigletLine(line.id, "unitPrice", parseInt(e.target.value) || 0)}
                              placeholder="đ/con"
                              className={cn(
                                "w-full px-3 py-2 bg-slate-50 border-2 border-transparent rounded-xl text-xs font-bold focus:bg-white outline-none focus:border-emerald-500/20",
                                lineErr?.unitPrice && "border-rose-500 bg-rose-50/10 focus:border-rose-500"
                              )}
                            />
                            {lineErr?.unitPrice && (
                              <p className="text-[10px] text-rose-500 font-bold leading-none mt-1">{lineErr.unitPrice}</p>
                            )}
                          </div>

                          {/* Offset (phát sinh) */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Phát sinh (đ)</label>
                              <div className="group/tooltip relative inline-block cursor-help text-slate-400 hover:text-slate-600">
                                <Info size={11} />
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/tooltip:block w-48 p-2 bg-slate-900 text-white text-[9px] font-bold rounded-lg shadow-xl leading-normal text-center z-50">
                                  Khoản bù chênh lệch cân nặng/phí phát sinh khác (ví dụ: lợn quá cân).
                                </span>
                              </div>
                            </div>
                            <input
                              type="number"
                              value={line.offset || ""}
                              onChange={(e) => updatePigletLine(line.id, "offset", parseInt(e.target.value) || 0)}
                              placeholder="Phát sinh (+/-)"
                              className="w-full px-3 py-2 bg-slate-50 border-2 border-transparent rounded-xl text-xs font-bold focus:bg-white outline-none focus:border-emerald-500/20"
                            />
                          </div>

                          {/* Total and delete */}
                          <div className="flex items-center justify-between pl-2">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Thành tiền</p>
                              <p className="text-sm font-black text-emerald-700 mt-1">{formatVND(line.quantity * line.unitPrice + line.offset)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePigletLine(line.id)}
                              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form calculations summary box (always displayed) */}
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl grid grid-cols-3 gap-6 text-center shadow-inner">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tổng số lợn lớn</p>
              <p className="text-lg font-black text-slate-800 mt-1">{pigLines.length} con</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tổng số lợn con</p>
              <p className="text-lg font-black text-slate-800 mt-1">
                {pigletLines.reduce((sum, line) => sum + line.quantity, 0)} con
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tổng cộng tiền</p>
              <p className="text-lg font-black text-emerald-700 mt-1">
                {formatVND(
                  pigLines.reduce((sum, l) => sum + l.weight * l.unitPrice, 0) +
                  pigletLines.reduce((sum, l) => sum + l.quantity * l.unitPrice + l.offset, 0)
                )}
              </p>
            </div>
          </div>

          {/* Wizard Navigation Footer */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            {formStep === "details" ? (
              <button
                type="button"
                onClick={() => setFormStep("customer")}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
              >
                Quay lại
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
              >
                Hủy bỏ
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3.5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/25 active:scale-95 flex items-center justify-center gap-2"
            >
              {formStep === "customer" ? "Tiếp tục thiết lập" : "Lưu hóa đơn đơn hàng"}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
