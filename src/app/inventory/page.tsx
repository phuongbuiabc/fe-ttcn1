"use client";

import React, { useMemo } from "react";
import { Plus, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

// Hooks & Service
import { useInventory } from "@/modules/inventory/hooks/useInventory";

// Components
import { InventoryDashboard } from "@/modules/inventory/ui/components/InventoryDashboard";
import { InventoryFilters } from "@/modules/inventory/ui/components/InventoryFilters";
import { InventoryDataTable } from "@/modules/inventory/ui/components/InventoryDataTable";
import { Pagination } from "@/shared/components/Pagination";

// Modals
import { SupplyModal } from "@/modules/inventory/ui/modals/SupplyModal";
import { ImportModal } from "@/modules/inventory/ui/modals/ImportModal";
import { ExportModal } from "@/modules/inventory/ui/modals/ExportModal";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";

export default function InventoryPage() {
  const {
    supplies, loading,
    employees,
    searchTerm, setSearchTerm, activeType, setActiveType,
    currentPage, setCurrentPage, itemsPerPage,
    activeTab,
    receipts, issues, loadingHistory,
    selectedImportId, selectedExportId,
    importModalMode, exportModalMode,
    deleteTarget, setDeleteTarget,
    modals, selected, forms, handlers, filtered,
  } = useInventory();

  // ── filtered receipts / issues ─────────────────────────────────────────────
  const filteredReceipts = useMemo(() => {
    return receipts.filter((rec) => {
      const matchedSupply = supplies.find((s) => s.name === rec.supply_id || s.id === rec.supply_id);
      const matchesType = activeType === "Tất cả" || (matchedSupply && matchedSupply.materialType === activeType);
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        rec.receipt_id.toLowerCase().includes(q) ||
        rec.supplier.toLowerCase().includes(q) ||
        rec.supply_id.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [receipts, supplies, activeType, searchTerm]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchedSupply = supplies.find((s) => s.name === issue.supply_id || s.id === issue.supply_id);
      const matchesType = activeType === "Tất cả" || (matchedSupply && matchedSupply.materialType === activeType);
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        issue.loss_id.toLowerCase().includes(q) ||
        issue.reason.toLowerCase().includes(q) ||
        issue.supply_id.toLowerCase().includes(q) ||
        (issue.employee_id && issue.employee_id.toLowerCase().includes(q));
      return matchesType && matchesSearch;
    });
  }, [issues, supplies, activeType, searchTerm]);

  // ── pagination (stock only) ────────────────────────────────────────────────
  const totalSupplyPages = Math.ceil(filtered.filteredSupplies.length / itemsPerPage);
  const paginatedSupplies = filtered.filteredSupplies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // ── header CTA button ──────────────────────────────────────────────────────
  const headerButton = {
    stock: (
      <button
        onClick={handlers.handleOpenCreateModal}
        className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
      >
        <Plus size={14} /> Đăng ký vật tư mới
      </button>
    ),
    import: (
      <button
        onClick={handlers.handleOpenImportCreate}
        className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
      >
        <ArrowDownToLine size={14} /> Nhập kho vật tư
      </button>
    ),
    export: (
      <button
        onClick={handlers.handleOpenExportCreate}
        className="flex items-center gap-2 px-5 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
      >
        <ArrowUpFromLine size={14} /> Xuất kho vật tư
      </button>
    ),
  }[activeTab];

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-6">

      {/* Page Header — title + CTA only (tabs live in TopBar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100/80">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight uppercase">
            Quản lý kho vật tư
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Hệ thống theo dõi &amp; Điều phối tài sản nông trại
          </p>
        </div>
        {headerButton}
      </div>

      {/* Dashboard Stats */}
      <InventoryDashboard supplies={supplies} />

      {/* Search & Type Filters */}
      <InventoryFilters
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        activeType={activeType} setActiveType={setActiveType}
      />

      {/* ── Unified Data Table ── */}
      <InventoryDataTable
        activeTab={activeTab}
        employees={employees}
        /* stock */
        supplies={paginatedSupplies}
        loadingStock={loading}
        onViewSupply={(item) => {
          selected.setSelectedSupply(item);
          modals.setSupplyModalMode("view");
          modals.setIsSupplyModalOpen(true);
        }}
        onEditSupply={(item) => {
          selected.setSelectedSupply(item);
          forms.setSupplyForm({ ...item });
          modals.setSupplyModalMode("edit");
          modals.setIsSupplyModalOpen(true);
        }}
        onDeleteSupply={(item) => {
          setDeleteTarget({ type: "supply", id: item.id, name: item.name });
          modals.setIsDeleteModalOpen(true);
        }}
        /* import history */
        receipts={filteredReceipts}
        loadingReceipts={loadingHistory}
        onViewReceipt={handlers.handleOpenImportView}
        onEditReceipt={handlers.handleOpenImportEdit}
        onDeleteReceipt={handlers.handleDeleteImport}
        /* export history */
        issues={filteredIssues}
        loadingIssues={loadingHistory}
        onViewIssue={handlers.handleOpenExportView}
        onEditIssue={handlers.handleOpenExportEdit}
        onDeleteIssue={handlers.handleDeleteExport}
      />

      {/* Pagination — only for stock tab */}
      {activeTab === "stock" && totalSupplyPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalSupplyPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* ── Modals ── */}
      <SupplyModal
        isOpen={modals.isSupplyModalOpen}
        mode={modals.supplyModalMode}
        setMode={modals.setSupplyModalMode}
        onClose={() => modals.setIsSupplyModalOpen(false)}
        onSave={handlers.handleSaveSupply}
        supply={selected.selectedSupply}
        supplyForm={forms.supplyForm}
        setSupplyForm={forms.setSupplyForm}
      />

      <ImportModal
        isOpen={modals.isImportModalOpen}
        mode={importModalMode}
        selectedId={selectedImportId || undefined}
        onClose={() => modals.setIsImportModalOpen(false)}
        onSuccess={() => handlers.fetchAllData(false)}
      />

      <ExportModal
        isOpen={modals.isExportModalOpen}
        mode={exportModalMode}
        selectedId={selectedExportId || undefined}
        onClose={() => modals.setIsExportModalOpen(false)}
        onSuccess={() => handlers.fetchAllData(false)}
      />

      <ConfirmModal
        isOpen={modals.isDeleteModalOpen}
        onClose={() => {
          modals.setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handlers.confirmDelete}
        title="Xác nhận xóa?"
        description={
          deleteTarget?.type === "supply"
            ? `Vật tư "${deleteTarget.name}" sẽ bị xóa khỏi danh mục kho.`
            : deleteTarget?.type === "import"
            ? `Phiếu nhập "${deleteTarget.name}" sẽ bị hủy và tồn kho sẽ được trừ tương ứng.`
            : deleteTarget?.type === "export"
            ? `Phiếu xuất "${deleteTarget.name}" sẽ bị hủy và tồn kho sẽ được hoàn trả.`
            : ""
        }
        type="danger"
        confirmText="Xác nhận xóa"
      />
    </div>
  );
}
