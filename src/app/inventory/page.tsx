"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  History,
  AlertTriangle,
  User,
  Tag,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";
import { usePathname } from "next/navigation";
import { getPageTitle } from "@/shared/utils/getPageTitle";
import { Supply, SupplyLoss, MaterialType } from "@/modules/inventory/model/inventory.model";



import { inventoryService } from "@/modules/inventory/api/inventory.service";

import { SupplyFormModal } from "@/modules/inventory/ui/SupplyFormModal";
import { SupplyDetailModal } from "@/modules/inventory/ui/SupplyDetailModal";
import { LossModal } from "@/modules/inventory/ui/LossModal";
import { AdjustmentModal } from "@/modules/inventory/ui/AdjustmentModal";
import { InventoryTable } from "@/modules/inventory/ui/InventoryTable";

export default function InventoryPage() {
  const pathname = usePathname();

  const [supplies, setSuppliers] = useState<Supply[]>([]);
  const [lossHistory, setLossHistory] = useState<SupplyLoss[]>([]);
  const [loading, setLoading] = useState(true);

  const activeTab = pathname.endsWith("/losses") ? "losses" : "inventory";
  const [searchTerm, setSearchTerm] = useState("");


  const [activeType, setActiveType] = useState("Tất cả");


  // Modals Status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected Data
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [selectedSupplyForDetail, setSelectedSupplyForDetail] = useState<Supply | null>(null);
  const [selectedSupplyForLoss, setSelectedSupplyForLoss] = useState<Supply | null>(null);
  const [selectedSupplyForAdj, setSelectedSupplyForAdj] = useState<Supply | null>(null);
  const [selectedSupplyForDelete, setSelectedSupplyForDelete] = useState<Supply | null>(null);

  // Forms
  const [supplyForm, setSupplyForm] = useState<any>({ name: "", materialType: MaterialType.FEED, quantity: 0, unit: "Kg", description: "" });

  const [lossForm, setLossForm] = useState<any>({ loss_id: "", date: "", employee_id: "", quantity: 0, reason: "Hỏng hóc", note: "" });
  const [adjForm, setAdjForm] = useState<any>({ quantity_change: 0, reason: "", note: "" });


  const fetchInventoryData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [resSupplies, resLosses] = await Promise.all([
        inventoryService.getSupplies(),
        inventoryService.getLossHistory()
      ]);
      if (resSupplies.success) setSuppliers(resSupplies.data);
      if (resLosses.success) setLossHistory(resLosses.data);
    } finally {
      if (showLoading) setLoading(false);
    }
  };


  useEffect(() => {
    const cached = inventoryService.getCachedSupplies();
    if (cached) {
      setSuppliers(cached);
      setLoading(false);
      fetchInventoryData(false); // Background update
    } else {
      fetchInventoryData(true);
    }
  }, []);


  const handleOpenAddModal = () => {
    setEditingSupply(null);
    setSupplyForm({ name: "", materialType: MaterialType.FEED, quantity: 0, unit: "Kg", description: "" });
    setIsModalOpen(true);
  };



  const handleOpenEditModal = (e: any, supply: Supply) => {
    if (e) e.stopPropagation();
    setEditingSupply(supply);
    setSupplyForm({ ...supply });
    setIsModalOpen(true);
  };

  const handleSaveSupply = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    if (editingSupply) {
      res = await inventoryService.updateSupply(editingSupply.id, supplyForm);
    } else {
      res = await inventoryService.createSupply(supplyForm);
    }

    if (res.success) {
      fetchInventoryData(false);
      setIsModalOpen(false);
    } else {

      alert(res.message || "Có lỗi xảy ra");
    }
  };


  const handleRecordLoss = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLossModalOpen(false);
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdjustmentModalOpen(false);
  };

  const confirmDelete = async () => {
    if (selectedSupplyForDelete) {
      const res = await inventoryService.deleteSupply(selectedSupplyForDelete.id);
      if (res.success) {
        fetchInventoryData(false);
        setIsDeleteModalOpen(false);
      } else {

        alert(res.message || "Không thể xóa vật tư");
      }
    }
  };


  const filteredSupplies = supplies.filter(s =>
    (activeType === "Tất cả" || s.materialType === activeType) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-headline uppercase">
            {getPageTitle(pathname)}
          </h1>
        </div>

        <button onClick={handleOpenAddModal} className="px-6 py-2.5 bg-[#00a67d] text-white rounded-full text-xs font-bold shadow-lg shadow-emerald-900/10 flex items-center gap-2 active:scale-95 transition-all">
          <Plus size={16} /> Nhập kho mới
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-[1.75rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-start items-center gap-4">
          <div className="relative flex-1 w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm tên vật tư, mã..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#00a67d]/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
            {[
              { label: "Tất cả", value: "Tất cả" },
              { label: "Thức ăn", value: MaterialType.FEED },
              { label: "Vaccine", value: MaterialType.VACCINE },
              { label: "Thuốc", value: MaterialType.MEDICINE }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setActiveType(type.value)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeType === type.value
                    ? "bg-[#00a67d] text-white shadow-lg shadow-emerald-900/10"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>

        </div>
      </div>


      {/* Main Content */}

      <div className="space-y-6">
        {activeTab === "inventory" ? (
          <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm overflow-hidden">
            <InventoryTable
              supplies={filteredSupplies}
              loading={loading}
              onView={(item) => { setSelectedSupplyForDetail(item); setIsDetailModalOpen(true); }}
              onEdit={(item) => handleOpenEditModal(null, item)}
              onDelete={(item) => { setSelectedSupplyForDelete(item); setIsDeleteModalOpen(true); }}
            />

          </div>
        ) : (
          <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {lossHistory.map((loss, idx) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><AlertTriangle size={64} className="text-rose-500" /></div>
                <div className="flex justify-between items-start mb-4"><span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">-{loss.quantity}</span><span className="text-[10px] font-black text-slate-400">{loss.date}</span></div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2">Vật tư: {loss.supply_id}</h4>

                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><User size={12} /> {loss.employee_id} • <Tag size={12} /> {loss.reason}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature Modals */}
      <SupplyFormModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSupply}
        editingSupply={editingSupply} supplyForm={supplyForm} setSupplyForm={setSupplyForm}
      />

      <SupplyDetailModal
        isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}
        supply={selectedSupplyForDetail}
        onEdit={(s) => {
          setIsDetailModalOpen(false);
          handleOpenEditModal(null, s);
        }}
      />


      <LossModal
        isOpen={isLossModalOpen} onClose={() => setIsLossModalOpen(false)} onSave={handleRecordLoss}
        supply={selectedSupplyForLoss} lossForm={lossForm} setLossForm={setLossForm}
      />

      <AdjustmentModal
        isOpen={isAdjustmentModalOpen} onClose={() => setIsAdjustmentModalOpen(false)} onSave={handleAdjustStock}
        supply={selectedSupplyForAdj} adjForm={adjForm} setAdjForm={setAdjForm}
      />

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedSupplyForDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-10 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
              <p className="text-xl font-bold text-slate-800 uppercase">Xác nhận xóa?</p>
              <p className="text-slate-500 text-sm mt-2 mb-8 leading-relaxed">Vật tư <span className="font-bold text-slate-900">{selectedSupplyForDelete.name}</span> sẽ bị xóa vĩnh viễn.</p>

              <div className="flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold">Hủy</button>
                <button onClick={confirmDelete} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-rose-900/10 active:scale-95 transition-all">Xác nhận xóa</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

