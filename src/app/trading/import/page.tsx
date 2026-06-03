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
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";

// API services
import { importService } from "@/modules/trading/api/import.service";
import { supplierService } from "@/modules/supplier/api/supplier.service";
import { breedService } from "@/modules/breed/api/breed.service";
import { penService } from "@/modules/pens/api/pen.service";
import { pigService } from "@/modules/pig/api/pig.service";
import { growthTrackingService } from "@/modules/growth/api/growthtracking.service";

// Shared components
import { BaseModal } from "@/shared/components/ui/BaseModal";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { CustomSelect } from "@/shared/components/ui/CustomSelect";

// Models & Enums
import { PigType } from "@/shared/enums/pig.enum";
import { 
  PigImportInvoiceResponse, 
  CreatePigImportInvoiceRequest,
  CreatePigImportInvoiceDetailRequest
} from "@/modules/trading/model/import.model";
import { Supplier } from "@/modules/supplier/model/supplier.model";
import { BreedResponse } from "@/modules/breed/model/breed.model";
import { PenResponse } from "@/modules/pens/model/pen.model";

// --- Types ---
interface InvoiceDetailInput {
  breedId: string;
  breedName: string;
  type: string;
  quantity: number;
  unitPrice: number;
}

interface PigInput {
  detailIndex: number;
  breedId: string;
  breedName: string;
  type: string;
  earTag: string;
  nippleCount: number;
  birthWeight: number;
  currentWeight: number;
  birthDate: string;
  penId: string;
}

interface Step1Errors {
  supplier?: string;
  importDate?: string;
  details?: Record<number, { breedId?: string; quantity?: string; unitPrice?: string }>;
}

interface PigError {
  earTag?: string;
  penId?: string;
  birthWeight?: string;
  currentWeight?: string;
}

export default function ImportPage() {
  const [invoices, setInvoices] = useState<PigImportInvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Catalogs
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [breeds, setBreeds] = useState<BreedResponse[]>([]);
  const [pens, setPens] = useState<PenResponse[]>([]);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Selections
  const [selectedInvoice, setSelectedInvoice] = useState<PigImportInvoiceResponse | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<PigImportInvoiceResponse | null>(null);

  // Form State
  const [step, setStep] = useState(1);
  const [invoiceCode, setInvoiceCode] = useState("");
  const [supplierSelection, setSupplierSelection] = useState("");
  const [manualSupplierName, setManualSupplierName] = useState("");
  const [importDate, setImportDate] = useState("");
  const [details, setDetails] = useState<InvoiceDetailInput[]>([]);
  const [pigInputs, setPigInputs] = useState<PigInput[]>([]);

  // Validation Errors State
  const [step1Errors, setStep1Errors] = useState<Step1Errors>({});
  const [step2Errors, setStep2Errors] = useState<Record<number, PigError>>({});

  // Fetch all initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, supRes, breedRes, penRes] = await Promise.all([
        importService.getInvoices(),
        supplierService.getSuppliers(),
        breedService.getAll(),
        penService.getAll()
      ]);

      if (invRes.success) {
        setInvoices(invRes.data || []);
      }
      if (supRes.success) {
        setSuppliers(supRes.data || []);
      }
      if (breedRes.success) {
        setBreeds(breedRes.data || []);
      }
      if (penRes.success) {
        setPens(penRes.data || []);
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format Helper
  const formatCurrency = (amount: number | string) => {
    const num = Number(amount);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num).replace('₫', 'đ');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  // Stats
  const totalAmountMonth = invoices
    .filter(inv => {
      const date = new Date(inv.importDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalQuantityAll = invoices.reduce((sum, inv) => sum + inv.totalQuantity, 0);
  const totalInvoicesCount = invoices.length;

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Modal Open Handlers
  const handleOpenAddModal = () => {
    const today = new Date().toISOString().split('T')[0];
    const timestamp = Date.now().toString().slice(-4);
    const code = `PI-${today.replace(/-/g, "")}-${timestamp}`;

    setStep(1);
    setInvoiceCode(code);
    setSupplierSelection("");
    setManualSupplierName("");
    setImportDate(today);
    setDetails([{ breedId: "", breedName: "", type: PigType.NAI, quantity: 1, unitPrice: 0 }]);
    setPigInputs([]);
    setStep1Errors({});
    setStep2Errors({});
    setIsModalOpen(true);
  };

  const handleOpenDetailModal = async (id: string) => {
    try {
      const res = await importService.getInvoiceById(id);
      if (res.success) {
        setSelectedInvoice(res.data);
        setIsDetailModalOpen(true);
      } else {
        alert(res.message || "Không thể tải chi tiết hóa đơn");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối hệ thống");
    }
  };

  const handleOpenDeleteModal = (invoice: PigImportInvoiceResponse) => {
    setInvoiceToDelete(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      const res = await importService.deleteInvoice(invoiceToDelete.id);
      if (res.success) {
        setInvoices(invoices.filter(i => i.id !== invoiceToDelete.id));
        setIsDeleteModalOpen(false);
      } else {
        alert(res.message || "Xóa hóa đơn thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối khi xóa");
    }
  };

  // Step 1 Detail Row Operations
  const handleAddDetailRow = () => {
    setDetails([...details, { breedId: "", breedName: "", type: PigType.NAI, quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveDetailRow = (idx: number) => {
    if (details.length === 1) return;
    setDetails(details.filter((_, i) => i !== idx));

    // Also remove row validation errors if any
    if (step1Errors.details) {
      const updatedDetailsErrors = { ...step1Errors.details };
      delete updatedDetailsErrors[idx];
      setStep1Errors({ ...step1Errors, details: updatedDetailsErrors });
    }
  };

  const handleDetailChange = (idx: number, field: keyof InvoiceDetailInput, val: any) => {
    const updated = [...details];
    if (field === 'breedId') {
      const selectedBreed = breeds.find(b => b.id === val);
      updated[idx].breedId = val;
      updated[idx].breedName = selectedBreed ? selectedBreed.name : "";
    } else {
      updated[idx] = { ...updated[idx], [field]: val };
    }
    setDetails(updated);
  };

  // Calculate Invoice Total Money
  const calculateInvoiceTotal = () => {
    return details.reduce((sum, d) => sum + (d.quantity * d.unitPrice), 0);
  };

  // Step 1 Inline Validation
  const validateStep1 = (): boolean => {
    const newErrors: Step1Errors = {};
    
    // Validate Supplier
    const supplierName = supplierSelection === "manual" ? manualSupplierName.trim() : suppliers.find(s => s.id === supplierSelection)?.name;
    if (!supplierSelection) {
      newErrors.supplier = "Vui lòng chọn nhà cung cấp";
    } else if (supplierSelection === "manual" && !manualSupplierName.trim()) {
      newErrors.supplier = "Vui lòng nhập tên nhà cung cấp";
    }

    // Validate Date
    if (!importDate) {
      newErrors.importDate = "Vui lòng chọn ngày nhập";
    }

    // Validate Details
    const detailsErrors: Record<number, { breedId?: string; quantity?: string; unitPrice?: string }> = {};
    let hasDetailsErrors = false;

    details.forEach((d, idx) => {
      const rowErrors: { breedId?: string; quantity?: string; unitPrice?: string } = {};
      let hasRowErrors = false;

      if (!d.breedId) {
        rowErrors.breedId = "Vui lòng chọn giống";
        hasRowErrors = true;
      }
      if (d.quantity <= 0) {
        rowErrors.quantity = "Số lượng phải > 0";
        hasRowErrors = true;
      }
      if (d.unitPrice < 0) {
        rowErrors.unitPrice = "Đơn giá phải >= 0";
        hasRowErrors = true;
      }

      if (hasRowErrors) {
        detailsErrors[idx] = rowErrors;
        hasDetailsErrors = true;
      }
    });

    if (hasDetailsErrors) {
      newErrors.details = detailsErrors;
    }

    setStep1Errors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1 Proceed
  const handleProceedToStep2 = async () => {
    if (!validateStep1()) {
      return;
    }

    setLoading(true);
    let existingEarTags: string[] = [];
    try {
      const res = await pigService.getAll();
      if (res.success && res.data) {
        existingEarTags = res.data
          .map(p => p.earTag || "")
          .filter(t => t.trim() !== "");
      }
    } catch (err) {
      console.error("Failed to fetch existing ear tags:", err);
    } finally {
      setLoading(false);
    }

    // Helper to generate next ear tags sequentially
    const generateNextTags = (tags: string[], count: number): string[] => {
      let maxNumber = 0;
      let prefix = "LT-";
      let padLen = 3;

      const numericTags = tags
        .map(tag => {
          const match = tag.match(/^(.*?)(\d+)$/);
          if (match) {
            return {
              prefix: match[1],
              num: parseInt(match[2], 10),
              length: match[2].length
            };
          }
          return null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);

      if (numericTags.length > 0) {
        // Sort descending by number to find the highest tag
        numericTags.sort((a, b) => b.num - a.num);
        const highest = numericTags[0];
        maxNumber = highest.num;
        prefix = highest.prefix;
        padLen = highest.length;
      }

      const results: string[] = [];
      for (let i = 0; i < count; i++) {
        const nextNum = maxNumber + 1 + i;
        const numStr = String(nextNum).padStart(padLen, '0');
        results.push(`${prefix}${numStr}`);
      }
      return results;
    };

    // Calculate total quantity of pigs to import
    const totalPigsCount = details.reduce((sum, d) => sum + d.quantity, 0);
    const nextTags = generateNextTags(existingEarTags, totalPigsCount);

    // Initialize/sync pig details inputs for Step 2
    const inputs: PigInput[] = [];
    let tagIndex = 0;
    details.forEach((d, dIdx) => {
      for (let i = 0; i < d.quantity; i++) {
        inputs.push({
          detailIndex: dIdx,
          breedId: d.breedId,
          breedName: d.breedName,
          type: d.type,
          earTag: nextTags[tagIndex] || "",
          nippleCount: 12,
          birthWeight: 1.5,
          currentWeight: 1.5,
          birthDate: importDate,
          penId: ""
        });
        tagIndex++;
      }
    });

    setPigInputs(inputs);
    setStep2Errors({});
    setStep(2);
  };

  // Step 2 Pig Fields Change
  const handlePigInputChange = (idx: number, field: keyof PigInput, val: any) => {
    const updated = [...pigInputs];
    updated[idx] = { ...updated[idx], [field]: val };
    setPigInputs(updated);
  };

  // Step 2 Inline Validation
  const validateStep2 = (): boolean => {
    const newErrors: Record<number, PigError> = {};
    let hasErrors = false;

    // Ear tags array to check duplicates
    const earTags = pigInputs.map(p => p.earTag.trim());

    pigInputs.forEach((p, idx) => {
      const rowErrors: PigError = {};
      let hasRowErrors = false;

      if (!p.earTag.trim()) {
        rowErrors.earTag = "Vui lòng nhập mã tai";
        hasRowErrors = true;
      } else {
        // Check duplicate in current list
        const firstIndex = earTags.indexOf(p.earTag.trim());
        const lastIndex = earTags.lastIndexOf(p.earTag.trim());
        if (firstIndex !== lastIndex) {
          rowErrors.earTag = "Mã số tai bị trùng lặp";
          hasRowErrors = true;
        }
      }

      if (!p.penId) {
        rowErrors.penId = "Vui lòng chọn chuồng";
        hasRowErrors = true;
      }

      if (p.birthWeight <= 0) {
        rowErrors.birthWeight = "Cân nặng phải > 0";
        hasRowErrors = true;
      }

      if (p.currentWeight <= 0) {
        rowErrors.currentWeight = "Cân nặng phải > 0";
        hasRowErrors = true;
      }

      if (hasRowErrors) {
        newErrors[idx] = rowErrors;
        hasErrors = true;
      }
    });

    setStep2Errors(newErrors);
    return !hasErrors;
  };

  // Final Submission
  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    const supplierId = supplierSelection === "manual" ? null : supplierSelection;
    const supplierName = supplierSelection === "manual" ? manualSupplierName.trim() : (suppliers.find(s => s.id === supplierSelection)?.name || "");

    const payload: CreatePigImportInvoiceRequest = {
      invoiceCode: invoiceCode.trim(),
      supplierId,
      supplierName,
      importDate,
      details: details.map((d, dIdx) => ({
        breedId: d.breedId,
        breedName: d.breedName,
        type: d.type,
        quantity: d.quantity,
        unitPrice: d.unitPrice,
        pigs: pigInputs
          .filter(p => p.detailIndex === dIdx)
          .map(p => ({
            earTag: p.earTag.trim(),
            nippleCount: Number(p.nippleCount),
            birthWeight: Number(p.birthWeight),
            birthDate: p.birthDate,
            penId: p.penId
          }))
      }))
    };

    setLoading(true);
    try {
      const res = await importService.createInvoice(payload);
      if (res.success) {
        try {
          const createdPigs: { pigId: string; earTag: string }[] = [];
          res.data?.details?.forEach(d => {
            d.pigs?.forEach(p => {
              if (p.pigId && p.earTag) {
                createdPigs.push({ pigId: p.pigId, earTag: p.earTag });
              }
            });
          });

          const growthRequests = pigInputs
            .map(input => {
              const matchedPig = createdPigs.find(cp => cp.earTag.trim() === input.earTag.trim());
              if (matchedPig) {
                return {
                  pigId: matchedPig.pigId,
                  trackingDate: importDate,
                  litterLength: 0,
                  chestGirth: 0,
                  weight: Number(input.currentWeight),
                  growthRate: 0,
                  adg: 0,
                  fcr: 0,
                  note: "Cân nặng lúc nhập hóa đơn"
                };
              }
              return null;
            })
            .filter((req): req is NonNullable<typeof req> => req !== null);

          if (growthRequests.length > 0) {
            await growthTrackingService.create(growthRequests);
          }
        } catch (growthErr) {
          console.error("Failed to create growth tracking records on import:", growthErr);
        }

        setIsModalOpen(false);
        fetchData();
      } else {
        alert(res.message || "Tạo hóa đơn nhập thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi hệ thống khi gửi dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Helper mapping UUID to Pen Name
  const getPenName = (penId: string) => {
    const pen = pens.find(p => p.id === penId);
    return pen ? pen.name : "Chưa chọn chuồng";
  };

  // Supplier Options
  const supplierOptions = [
    { value: "manual", label: "--- Nhập thủ công ---" },
    ...suppliers.map(s => ({ value: s.id, label: s.name }))
  ];

  // Pig Type Options
  const pigTypeOptions = [
    { value: PigType.NAI, label: "Lợn Nái (NAI)" },
    { value: PigType.NOC, label: "Lợn Nọc (NOC)" },
    { value: PigType.THIT, label: "Lợn Thịt (THIT)" }
  ];

  // Pen Options
  const penOptions = pens.map(p => ({ value: p.id, label: p.name }));

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Hóa đơn nhập lợn</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý hóa đơn nhập heo giống, heo đực và heo thịt từ các nhà cung cấp.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleOpenAddModal}
            className="px-6 py-2.5 bg-gradient-to-br from-[#006c49] to-[#10b981] text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus size={18} /> Thêm hóa đơn nhập
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Package size={64} className="text-emerald-600" />
          </div>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">Tổng chi phí nhập tháng này</p>
          <h3 className="text-3xl font-headline font-black text-slate-900">{formatCurrency(totalAmountMonth)}</h3>
          <div className="mt-4 h-1 w-12 rounded-full bg-emerald-500" />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <CheckCircle2 size={64} className="text-blue-500" />
          </div>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">Tổng số lượng heo nhập</p>
          <h3 className="text-3xl font-headline font-black text-slate-900">{totalQuantityAll} con</h3>
          <div className="mt-4 h-1 w-12 rounded-full bg-blue-500" />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <FileText size={64} className="text-amber-500" />
          </div>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">Tổng số hóa đơn nhập</p>
          <h3 className="text-3xl font-headline font-black text-slate-900">{totalInvoicesCount} đơn</h3>
          <div className="mt-4 h-1 w-12 rounded-full bg-amber-500" />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo mã hóa đơn, nhà cung cấp..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && invoices.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-sm">Đang tải dữ liệu hóa đơn nhập...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-bold text-sm">
            Không tìm thấy hóa đơn nhập lợn nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã hóa đơn</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày nhập</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đơn vị cung cấp</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Tổng số lượng</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Tổng tiền</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 text-sm">{record.invoiceCode}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(record.importDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <Truck size={14} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm truncate max-w-[200px]" title={record.supplierName}>
                          {record.supplierName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{record.totalQuantity} con</td>
                    <td className="px-6 py-4 text-sm font-black text-emerald-700 text-right">{formatCurrency(record.totalAmount)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenDetailModal(record.id)}
                          className="p-2 text-slate-400 hover:text-[#006c49] transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(record)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Xóa hóa đơn"
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
        )}
      </div>

      {/* CREATE MODAL (2 Steps) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="text-2xl font-headline font-black text-emerald-900">
                    Tạo Hóa đơn Nhập lợn mới
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                      step === 1 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    )}>
                      Bước 1: Hóa đơn
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                      step === 2 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    )}>
                      Bước 2: Thông tin lợn
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              {step === 1 && (
                <div className="flex-1 overflow-y-auto p-8 pb-40 space-y-6">
                  {/* Step 1 Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mã hóa đơn nhập (Mã tự sinh)</label>
                      <input 
                        type="text" 
                        readOnly
                        value={invoiceCode}
                        className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-bold text-slate-500 outline-none cursor-not-allowed opacity-75"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn vị cung cấp (Nguồn gốc) *</label>
                      <CustomSelect 
                        value={supplierSelection}
                        onChange={(v) => {
                          setSupplierSelection(v);
                          if (step1Errors.supplier) {
                            setStep1Errors({ ...step1Errors, supplier: undefined });
                          }
                        }}
                        options={supplierOptions}
                        placeholder="Chọn nhà cung cấp..."
                        error={!!step1Errors.supplier}
                      />
                      {step1Errors.supplier && (
                        <p className="text-[10px] font-bold text-rose-500 mt-1">{step1Errors.supplier}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày nhập *</label>
                      <input 
                        type="date" 
                        required
                        value={importDate}
                        onChange={(e) => {
                          setImportDate(e.target.value);
                          if (step1Errors.importDate) {
                            setStep1Errors({ ...step1Errors, importDate: undefined });
                          }
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none",
                          step1Errors.importDate && "border-rose-500 bg-rose-50/20 focus:ring-rose-500/20"
                        )}
                      />
                      {step1Errors.importDate && (
                        <p className="text-[10px] font-bold text-rose-500 mt-1">{step1Errors.importDate}</p>
                      )}
                    </div>
                  </div>

                  {supplierSelection === "manual" && (
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 space-y-2 max-w-md">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800">Nhập tên nhà cung cấp thủ công *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nhập tên đơn vị cung cấp..."
                        value={manualSupplierName}
                        onChange={(e) => {
                          setManualSupplierName(e.target.value);
                          if (step1Errors.supplier) {
                            setStep1Errors({ ...step1Errors, supplier: undefined });
                          }
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none",
                          step1Errors.supplier && "border-rose-500 bg-rose-50/20"
                        )}
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Chi tiết hóa đơn nhập (CTHDN)</h4>
                      <button
                        type="button"
                        onClick={handleAddDetailRow}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
                      >
                        <PlusCircle size={14} /> Thêm dòng
                      </button>
                    </div>

                    <div className="border border-slate-100 rounded-2xl">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider">Giống *</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[200px]">Loại lợn *</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[100px] text-right">Số lượng *</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[160px] text-right">Đơn giá (đ) *</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[160px] text-right">Thành tiền</th>
                            <th className="px-4 py-2.5 w-[50px]"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {details.map((detail, idx) => (
                            <tr key={idx}>
                              <td className="px-3 py-2">
                                <CustomSelect
                                  value={detail.breedId}
                                  onChange={(val) => {
                                    handleDetailChange(idx, 'breedId', val);
                                    if (step1Errors.details?.[idx]?.breedId) {
                                      const updatedDetailsErrors = { ...step1Errors.details };
                                      if (updatedDetailsErrors[idx]) {
                                        delete updatedDetailsErrors[idx].breedId;
                                      }
                                      setStep1Errors({ ...step1Errors, details: updatedDetailsErrors });
                                    }
                                  }}
                                  options={breeds.map(b => ({ value: b.id, label: b.name }))}
                                  placeholder="Chọn giống..."
                                  size="sm"
                                  error={!!step1Errors.details?.[idx]?.breedId}
                                />
                                {step1Errors.details?.[idx]?.breedId && (
                                  <p className="text-[9px] font-bold text-rose-500 mt-1">{step1Errors.details[idx].breedId}</p>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <CustomSelect
                                  value={detail.type}
                                  onChange={(val) => handleDetailChange(idx, 'type', val)}
                                  options={pigTypeOptions}
                                  placeholder="Chọn loại lợn..."
                                  size="sm"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input 
                                  type="number" 
                                  min="1"
                                  required
                                  value={detail.quantity}
                                  onChange={(e) => {
                                    handleDetailChange(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 0));
                                    if (step1Errors.details?.[idx]?.quantity) {
                                      const updatedDetailsErrors = { ...step1Errors.details };
                                      if (updatedDetailsErrors[idx]) {
                                        delete updatedDetailsErrors[idx].quantity;
                                      }
                                      setStep1Errors({ ...step1Errors, details: updatedDetailsErrors });
                                    }
                                  }}
                                  className={cn(
                                    "w-full px-3 py-2 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-right focus:ring-2 focus:ring-emerald-500/20 outline-none",
                                    step1Errors.details?.[idx]?.quantity && "border-rose-500 bg-rose-50/20 focus:border-rose-500"
                                  )}
                                />
                                {step1Errors.details?.[idx]?.quantity && (
                                  <p className="text-[9px] font-bold text-rose-500 mt-1">{step1Errors.details[idx].quantity}</p>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <input 
                                  type="number" 
                                  min="0"
                                  required
                                  value={detail.unitPrice}
                                  onChange={(e) => {
                                    handleDetailChange(idx, 'unitPrice', Math.max(0, parseInt(e.target.value) || 0));
                                    if (step1Errors.details?.[idx]?.unitPrice) {
                                      const updatedDetailsErrors = { ...step1Errors.details };
                                      if (updatedDetailsErrors[idx]) {
                                        delete updatedDetailsErrors[idx].unitPrice;
                                      }
                                      setStep1Errors({ ...step1Errors, details: updatedDetailsErrors });
                                    }
                                  }}
                                  className={cn(
                                    "w-full px-3 py-2 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-right focus:ring-2 focus:ring-emerald-500/20 outline-none",
                                    step1Errors.details?.[idx]?.unitPrice && "border-rose-500 bg-rose-50/20"
                                  )}
                                />
                                {step1Errors.details?.[idx]?.unitPrice && (
                                  <p className="text-[9px] font-bold text-rose-500 mt-1">{step1Errors.details[idx].unitPrice}</p>
                                )}
                              </td>
                              <td className="px-3 py-2 text-right text-xs font-bold text-slate-700">
                                {formatCurrency(detail.quantity * detail.unitPrice)}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  disabled={details.length === 1}
                                  onClick={() => handleRemoveDetailRow(idx)}
                                  className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end p-4 bg-slate-50/50 rounded-2xl">
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng tiền hóa đơn</span>
                        <h4 className="text-2xl font-black text-[#006c49] mt-0.5">{formatCurrency(calculateInvoiceTotal())}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 shrink-0">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button 
                      type="button"
                      onClick={handleProceedToStep2}
                      className="px-8 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
                    >
                      Xác nhận & Nhập chi tiết lợn
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSaveInvoice} className="flex-1 overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-y-auto p-8 pb-48 space-y-6">
                    <div className="border border-slate-100 rounded-2xl">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[50px]">STT</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[130px]">Giống & Loại</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[140px]">Mã số tai *</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[70px] text-right">Số vú</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[100px] text-right">CN sơ sinh (kg) *</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[100px] text-right">CN hiện tại (kg) *</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[180px]">Chuồng chỉ định *</th>
                            <th className="px-4 py-2.5 text-[9px] uppercase font-black text-slate-500 tracking-wider w-[110px]">Ngày sinh</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {pigInputs.map((pig, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-4 py-2 text-xs font-bold text-slate-400 text-center">
                                {idx + 1}
                              </td>
                              <td className="px-4 py-2">
                                <div className="space-y-0.5">
                                  <p className="text-xs font-bold text-slate-900 leading-none">{pig.breedName}</p>
                                  <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase mt-1 tracking-wider leading-none">
                                    {pig.type}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 py-1.5">
                                <input 
                                  type="text" 
                                  required
                                  placeholder="Ví dụ: LT-001"
                                  value={pig.earTag}
                                  onChange={(e) => {
                                    handlePigInputChange(idx, 'earTag', e.target.value);
                                    if (step2Errors[idx]?.earTag) {
                                      const updatedPigErrors = { ...step2Errors };
                                      delete updatedPigErrors[idx].earTag;
                                      setStep2Errors(updatedPigErrors);
                                    }
                                  }}
                                  className={cn(
                                    "w-full px-3 py-1.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none",
                                    step2Errors[idx]?.earTag && "border-rose-500 bg-rose-50/20 focus:border-rose-500"
                                  )}
                                />
                                {step2Errors[idx]?.earTag && (
                                  <p className="text-[9px] font-bold text-rose-500 mt-1">{step2Errors[idx].earTag}</p>
                                )}
                              </td>
                              <td className="px-3 py-1.5">
                                <input 
                                  type="number" 
                                  min="0"
                                  max="24"
                                  required
                                  value={pig.nippleCount}
                                  onChange={(e) => handlePigInputChange(idx, 'nippleCount', parseInt(e.target.value) || 0)}
                                  className="w-full px-3 py-1.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-right focus:ring-1 focus:ring-emerald-500 outline-none"
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <input 
                                  type="number" 
                                  step="0.1"
                                  min="0.1"
                                  required
                                  value={pig.birthWeight}
                                  onChange={(e) => {
                                    handlePigInputChange(idx, 'birthWeight', parseFloat(e.target.value) || 0);
                                    if (step2Errors[idx]?.birthWeight) {
                                      const updatedPigErrors = { ...step2Errors };
                                      delete updatedPigErrors[idx].birthWeight;
                                      setStep2Errors(updatedPigErrors);
                                    }
                                  }}
                                  className={cn(
                                    "w-full px-3 py-1.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-right focus:ring-2 focus:ring-emerald-500/20 outline-none",
                                    step2Errors[idx]?.birthWeight && "border-rose-500 bg-rose-50/20 focus:border-rose-500"
                                  )}
                                />
                                {step2Errors[idx]?.birthWeight && (
                                  <p className="text-[9px] font-bold text-rose-500 mt-1">{step2Errors[idx].birthWeight}</p>
                                )}
                              </td>
                              <td className="px-3 py-1.5">
                                <input 
                                  type="number" 
                                  step="0.1"
                                  min="0.1"
                                  required
                                  value={pig.currentWeight}
                                  onChange={(e) => {
                                    handlePigInputChange(idx, 'currentWeight', parseFloat(e.target.value) || 0);
                                    if (step2Errors[idx]?.currentWeight) {
                                      const updatedPigErrors = { ...step2Errors };
                                      delete updatedPigErrors[idx].currentWeight;
                                      setStep2Errors(updatedPigErrors);
                                    }
                                  }}
                                  className={cn(
                                    "w-full px-3 py-1.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-right focus:ring-2 focus:ring-emerald-500/20 outline-none",
                                    step2Errors[idx]?.currentWeight && "border-rose-500 bg-rose-50/20 focus:border-rose-500"
                                  )}
                                />
                                {step2Errors[idx]?.currentWeight && (
                                  <p className="text-[9px] font-bold text-rose-500 mt-1">{step2Errors[idx].currentWeight}</p>
                                )}
                              </td>
                              <td className="px-3 py-1.5">
                                <CustomSelect
                                  value={pig.penId}
                                  onChange={(val) => {
                                    handlePigInputChange(idx, 'penId', val);
                                    if (step2Errors[idx]?.penId) {
                                      const updatedPigErrors = { ...step2Errors };
                                      delete updatedPigErrors[idx].penId;
                                      setStep2Errors(updatedPigErrors);
                                    }
                                  }}
                                  options={penOptions}
                                  placeholder="Chọn chuồng..."
                                  size="sm"
                                  error={!!step2Errors[idx]?.penId}
                                />
                                {step2Errors[idx]?.penId && (
                                  <p className="text-[9px] font-bold text-rose-500 mt-1">{step2Errors[idx].penId}</p>
                                )}
                              </td>
                              <td className="px-3 py-1.5">
                                <input 
                                  type="date" 
                                  required
                                  value={pig.birthDate}
                                  onChange={(e) => handlePigInputChange(idx, 'birthDate', e.target.value)}
                                  className="w-full px-2 py-1.5 bg-slate-50 border-none rounded-xl text-[11px] font-bold focus:ring-1 focus:ring-emerald-500 outline-none"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-8 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Quay lại
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "px-8 py-2.5 bg-[#006c49] text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center gap-2",
                        loading && "opacity-50 animate-pulse"
                      )}
                    >
                      {loading ? "Đang lưu..." : "Hoàn tất nhập hóa đơn"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* READ-ONLY DETAIL VIEW MODAL */}
      <AnimatePresence>
        {isDetailModalOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="text-xl font-black text-emerald-900 uppercase font-headline">
                    Hóa đơn nhập: {selectedInvoice.invoiceCode}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">Ngày lập hóa đơn: {formatDate(selectedInvoice.importDate)}</p>
                </div>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn vị cung cấp</span>
                    <p className="font-bold text-slate-800 text-sm mt-1">{selectedInvoice.supplierName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng số lượng nhập</span>
                    <p className="font-bold text-slate-800 text-sm mt-1">{selectedInvoice.totalQuantity} con lợn</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng giá trị đơn hàng</span>
                    <p className="font-black text-emerald-700 text-base mt-1">{formatCurrency(selectedInvoice.totalAmount)}</p>
                  </div>
                </div>

                {/* Details Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Bản kê chi tiết (CTHDN)</h4>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã giống</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tên giống</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phân loại</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Số lượng</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Đơn giá</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {selectedInvoice.details.map((detail) => (
                          <tr key={detail.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-3 text-slate-500 font-mono text-[11px]">{detail.breedId}</td>
                            <td className="px-6 py-3 font-bold text-slate-700">{detail.breedName}</td>
                            <td className="px-6 py-3 font-bold text-slate-500">{detail.type}</td>
                            <td className="px-6 py-3 font-bold text-slate-900 text-right">{detail.quantity} con</td>
                            <td className="px-6 py-3 font-bold text-slate-700 text-right">{formatCurrency(detail.unitPrice)}</td>
                            <td className="px-6 py-3 font-black text-slate-900 text-right">{formatCurrency(detail.lineTotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pigs list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Danh sách lợn đã nhập kèm theo</h4>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">STT</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã lợn (ID)</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Số tai</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chuồng được xếp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {selectedInvoice.details.flatMap(d => d.pigs).map((pig, idx) => (
                          <tr key={pig.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-3 text-slate-400 text-center font-bold">{idx + 1}</td>
                            <td className="px-6 py-3 text-slate-500 font-mono text-[11px]">{pig.pigId}</td>
                            <td className="px-6 py-3 font-bold text-emerald-700">{pig.earTag}</td>
                            <td className="px-6 py-3 font-bold text-slate-700">{getPenName(pig.penId)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50 shrink-0">
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-8 py-2.5 bg-[#006c49] text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-900/10 hover:brightness-110 active:scale-95 transition-all"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen && !!invoiceToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa hóa đơn?"
        description={`Bạn có chắc chắn muốn xóa hóa đơn nhập lợn "${invoiceToDelete?.invoiceCode || ""}" từ nhà cung cấp "${invoiceToDelete?.supplierName || ""}"? Thao tác này không thể phục hồi.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        type="danger"
      />
    </div>
  );
}
