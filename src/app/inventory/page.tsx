"use client";

import React from "react";
import { Plus, Trash2, AlertTriangle, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/utils/utils";
import { useRouter } from "next/navigation";

// Hooks & Service
import { useInventory } from "@/modules/inventory/hooks/useInventory";

// Components
import { InventoryDashboard } from "@/modules/inventory/ui/InventoryDashboard";
import { InventoryFilters } from "@/modules/inventory/ui/InventoryFilters";
import { InventoryTable } from "@/modules/inventory/ui/InventoryTable";
import { LossTable } from "@/modules/inventory/ui/LossTable";
import { TableSkeleton } from "@/modules/inventory/ui/TableSkeleton";
import { Pagination } from "@/shared/components/Pagination";

// Modals
import { SupplyFormModal } from "@/modules/inventory/ui/SupplyFormModal";
import { SupplyDetailModal } from "@/modules/inventory/ui/SupplyDetailModal";
import { LossModal } from "@/modules/inventory/ui/LossModal";
import { LossDetailModal } from "@/modules/inventory/ui/LossDetailModal";
import { AdjustmentModal } from "@/modules/inventory/ui/AdjustmentModal";

export default function InventoryPage() {
  const router = useRouter();
  const {
    supplies, lossHistory, employees, loading, activeTab,
    searchTerm, setSearchTerm, activeType, setActiveType, dateRange, setDateRange,
    currentPage, setCurrentPage, itemsPerPage,
    modals, selected, forms, handlers, filtered
  } = useInventory();

  // Export Logic (Keep here as it's page specific or move to a helper)
  const exportLossHistory = () => {
    const headers = ["ID Phiếu", "Vật tư", "Ngày", "Nhân viên", "Số lượng", "Lý do", "Ghi chú"];
    const csvContent = [
      headers.join(","),
      ...lossHistory.map(l => [l.loss_id, l.supply_id, l.date, l.employee_id, l.quantity, l.reason, `"${l.note || ''}"`].join(","))
    ].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bao-cao-hao-hut-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalSupplyPages = Math.ceil(filtered.filteredSupplies.length / itemsPerPage);
  const paginatedSupplies = filtered.filteredSupplies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalLossPages = Math.ceil(filtered.filteredLosses.length / itemsPerPage);
  const paginatedLosses = filtered.filteredLosses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-headline uppercase">Quản lý kho vật tư</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Hệ thống theo dõi & Điều phối tài sản nông trại</p>
        </div>
        <button 
          onClick={() => { selected.setEditingSupply(null); modals.setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
        >
          <Plus size={16} /> Nhập kho mới
        </button>
      </div>

      {/* Dashboard Stats */}
      <InventoryDashboard supplies={supplies} lossHistory={lossHistory} />

      {/* Search & Filters */}
      <InventoryFilters 
        activeTab={activeTab}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        activeType={activeType} setActiveType={setActiveType}
        dateRange={dateRange} setDateRange={setDateRange}
      />

      {/* Main Content Table */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-20">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex gap-4">
            <button onClick={() => router.push('/inventory')} className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 transition-all", activeTab === "inventory" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-slate-400")}>Kho hàng</button>
            <button onClick={() => router.push('/inventory/losses')} className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-1 transition-all", activeTab === "losses" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-slate-400")}>Lịch sử hao hụt</button>
          </div>
          {activeTab === "losses" && lossHistory.length > 0 && (
            <button onClick={exportLossHistory} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase transition-all">
              <Download size={14} /> Xuất báo cáo
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-8"><TableSkeleton /></div>
        ) : activeTab === "inventory" ? (
          <>
            <InventoryTable 
              supplies={paginatedSupplies} loading={false} 
              onView={(item) => { selected.setSelectedSupplyForDetail(item); modals.setIsDetailModalOpen(true); }}
              onEdit={(item) => { selected.setEditingSupply(item); forms.setSupplyForm({...item}); modals.setIsModalOpen(true); }}
              onDelete={(item) => { selected.setSelectedSupplyForDelete(item); modals.setIsDeleteModalOpen(true); }}
              onLoss={(item) => { selected.setSelectedSupplyForLoss(item); modals.setIsLossModalOpen(true); }}
            />
            <Pagination currentPage={currentPage} totalPages={totalSupplyPages} onPageChange={setCurrentPage} />
          </>
        ) : activeTab === "losses" ? (
          <>
            <LossTable 
              losses={paginatedLosses} employees={employees} loading={false} 
              onView={(loss) => { selected.setSelectedLossForDetail(loss); modals.setIsLossDetailModalOpen(true); }}
              onVoid={(loss) => { selected.setSelectedLossForVoid(loss); modals.setIsVoidModalOpen(true); }}
            />
            <Pagination currentPage={currentPage} totalPages={totalLossPages} onPageChange={setCurrentPage} />
          </>
        ) : null}
      </motion.div>

      {/* Modals Section */}
      <SupplyFormModal isOpen={modals.isModalOpen} onClose={() => modals.setIsModalOpen(false)} onSave={handlers.handleSaveSupply} editingSupply={selected.editingSupply} supplyForm={forms.supplyForm} setSupplyForm={forms.setSupplyForm} />
      <SupplyDetailModal isOpen={modals.isDetailModalOpen} onClose={() => modals.setIsDetailModalOpen(false)} supply={selected.selectedSupplyForDetail} onEdit={(s) => { modals.setIsDetailModalOpen(false); selected.setEditingSupply(s); forms.setSupplyForm({...s}); modals.setIsModalOpen(true); }} />
      <LossModal isOpen={modals.isLossModalOpen} onClose={() => modals.setIsLossModalOpen(false)} onSave={handlers.handleRecordLoss} supply={selected.selectedSupplyForLoss} lossForm={forms.lossForm} setLossForm={forms.setLossForm} employees={employees} />
      <AdjustmentModal isOpen={modals.isAdjustmentModalOpen} onClose={() => modals.setIsAdjustmentModalOpen(false)} onSave={() => {}} supply={null} adjForm={{}} setAdjForm={() => {}} />
      <LossDetailModal isOpen={modals.isLossDetailModalOpen} onClose={() => modals.setIsLossDetailModalOpen(false)} loss={selected.selectedLossForDetail} />

      <AnimatePresence>
        {modals.isDeleteModalOpen && selected.selectedSupplyForDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 size={32} /></div>
              <p className="text-xl font-bold uppercase">Xác nhận xóa?</p>
              <p className="text-slate-500 text-sm mt-2 mb-8 italic">"{selected.selectedSupplyForDelete.name}" sẽ bị xóa khỏi kho.</p>
              <div className="flex gap-4">
                <button onClick={() => modals.setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest">Hủy</button>
                <button onClick={handlers.confirmDelete} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-900/10">Xác nhận xóa</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modals.isVoidModalOpen && selected.selectedLossForVoid && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><AlertTriangle size={32} /></div>
              <p className="text-xl font-bold uppercase">Hủy phiếu hao hụt?</p>
              <p className="text-slate-500 text-sm mt-2 mb-8 leading-relaxed italic">Hệ thống sẽ cộng lại <span className="text-emerald-600 font-bold">{selected.selectedLossForVoid.quantity} đơn vị</span> vào kho.</p>
              <div className="flex gap-4">
                <button onClick={() => modals.setIsVoidModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest">Quay lại</button>
                <button onClick={handlers.handleVoidLoss} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-900/10">Xác nhận hủy</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
