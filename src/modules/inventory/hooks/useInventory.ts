import { useState, useEffect, useMemo } from "react";
import { Supply, MaterialType, SupplyFormInput, ReceiptHistoryItem, SupplyLoss } from "../model/inventory.model";
import { inventoryService } from "../api/inventory.service";
import { staffService } from "@/modules/staff/api/staff.service";
import { Employee } from "@/shared/types";

type ModalMode = "create" | "edit" | "view";

export function useInventory() {
  const [supplies, setSuppliers] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("Tất cả");

  // Tab State
  const [activeTab, setActiveTab] = useState<"stock" | "import" | "export">("stock");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Unified Modals Status
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [supplyModalMode, setSupplyModalMode] = useState<ModalMode>("create");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // New Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [importModalMode, setImportModalMode] = useState<ModalMode>("create");
  const [exportModalMode, setExportModalMode] = useState<ModalMode>("create");

  // Histories
  const [receipts, setReceipts] = useState<ReceiptHistoryItem[]>([]);
  const [issues, setIssues] = useState<SupplyLoss[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Employee list for name lookup in tables
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Selected Data
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [selectedImportId, setSelectedImportId] = useState<string | null>(null);
  const [selectedExportId, setSelectedExportId] = useState<string | null>(null);
  
  // Unified Delete target for Custom ConfirmModal
  const [deleteTarget, setDeleteTarget] = useState<{ type: "supply" | "import" | "export"; id: string; name: string } | null>(null);

  // Forms
  const [supplyForm, setSupplyForm] = useState<SupplyFormInput>({ name: "", materialType: MaterialType.FEED, quantity: 0, unit: "Kg", description: "" });

  // Reset page on search/type change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, activeType]);

  // Load all data — supplies FIRST to populate cache, then history in parallel
  const fetchAllData = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
      setLoadingHistory(true);
    }
    try {
      // Step 1: populate inventoryCache so history resolves material names correctly
      const resSupplies = await inventoryService.getSupplies();
      if (resSupplies.success) setSuppliers(resSupplies.data);

      // Step 2: fetch history + employees in parallel (cache is now ready)
      const [resReceipts, resIssues, resEmployees] = await Promise.all([
        inventoryService.getReceiptHistory(),
        inventoryService.getLossHistory(),
        staffService.getEmployees(),
      ]);
      if (resReceipts.success) setReceipts(resReceipts.data || []);
      if (resIssues.success) setIssues(resIssues.data || []);
      if (resEmployees.success) setEmployees(resEmployees.data || []);
    } finally {
      if (showLoading) {
        setLoading(false);
        setLoadingHistory(false);
      }
    }
  };

  useEffect(() => {
    // First load with visual loader
    fetchAllData(true);
  }, []);

  // Listen to URL search param changes to sync TopBar tabs click with page activeTab
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "import") {
        setActiveTab("import");
      } else if (tab === "export") {
        setActiveTab("export");
      } else {
        setActiveTab("stock");
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("inventory-tab-change", handleUrlChange);
    
    // Initial check
    handleUrlChange();

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("inventory-tab-change", handleUrlChange);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const feedOptions = useMemo(() => {
    return supplies.filter(
      (s) => s.materialType === MaterialType.FEED
    );
  }, [supplies]);

  // Logic Handlers
  const handleOpenCreateModal = () => {
    setSelectedSupply(null);
    setSupplyForm({ name: "", materialType: MaterialType.FEED, quantity: 0, unit: "Kg", description: "" });
    setSupplyModalMode("create");
    setIsSupplyModalOpen(true);
  };

  const handleSaveSupply = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedForm = {
      ...supplyForm,
      quantity: supplyForm.quantity === "" ? 0 : Number(supplyForm.quantity)
    };
    const res = selectedSupply 
      ? await inventoryService.updateSupply(selectedSupply.id, sanitizedForm)
      : await inventoryService.createSupply(sanitizedForm);

    if (res.success) {
      fetchAllData(false);
      setIsSupplyModalOpen(false);
    } else alert(res.message);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    let res;
    if (deleteTarget.type === "supply") {
      res = await inventoryService.deleteSupply(deleteTarget.id);
    } else if (deleteTarget.type === "import") {
      res = await inventoryService.deleteImport(deleteTarget.id);
    } else {
      res = await inventoryService.deleteExport(deleteTarget.id);
    }

    if (res.success) {
      fetchAllData(false);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } else {
      alert(res.message);
    }
  };

  // Import/Export Handlers
  const handleOpenImportCreate = () => {
    setSelectedImportId(null);
    setImportModalMode("create");
    setIsImportModalOpen(true);
  };

  const handleOpenImportView = (id: string) => {
    setSelectedImportId(id);
    setImportModalMode("view");
    setIsImportModalOpen(true);
  };

  const handleOpenImportEdit = (id: string) => {
    setSelectedImportId(id);
    setImportModalMode("edit");
    setIsImportModalOpen(true);
  };

  const handleDeleteImport = (id: string) => {
    setDeleteTarget({ type: "import", id, name: id.slice(0, 8) });
    setIsDeleteModalOpen(true);
  };

  const handleOpenExportCreate = () => {
    setSelectedExportId(null);
    setExportModalMode("create");
    setIsExportModalOpen(true);
  };

  const handleOpenExportView = (id: string) => {
    setSelectedExportId(id);
    setExportModalMode("view");
    setIsExportModalOpen(true);
  };

  const handleOpenExportEdit = (id: string) => {
    setSelectedExportId(id);
    setExportModalMode("edit");
    setIsExportModalOpen(true);
  };

  const handleDeleteExport = (id: string) => {
    setDeleteTarget({ type: "export", id, name: id.slice(0, 8) });
    setIsDeleteModalOpen(true);
  };

  // Filtered Data
  const filteredSupplies = useMemo(() => 
    supplies.filter(s => 
      (activeType === "Tất cả" || s.materialType === activeType) &&
      (s.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || s.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    ), [supplies, activeType, debouncedSearchTerm]
  );

  return {
    supplies, loading,
    employees,
    searchTerm, setSearchTerm, activeType, setActiveType,
    currentPage, setCurrentPage, itemsPerPage,
    activeTab, setActiveTab,
    receipts, issues, loadingHistory,
    selectedImportId, selectedExportId,
    importModalMode, exportModalMode,
    deleteTarget, setDeleteTarget,
    modals: {
      isSupplyModalOpen, setIsSupplyModalOpen,
      supplyModalMode, setSupplyModalMode,
      isDeleteModalOpen, setIsDeleteModalOpen,
      isImportModalOpen, setIsImportModalOpen,
      isExportModalOpen, setIsExportModalOpen
    },
    selected: {
      selectedSupply, setSelectedSupply
    },
    forms: { supplyForm, setSupplyForm },
    handlers: { 
      handleOpenCreateModal, 
      handleSaveSupply, 
      confirmDelete, 
      fetchAllData,
      handleOpenImportCreate,
      handleOpenImportView,
      handleOpenImportEdit,
      handleDeleteImport,
      handleOpenExportCreate,
      handleOpenExportView,
      handleOpenExportEdit,
      handleDeleteExport
    },
    filtered: { filteredSupplies },
    feedOptions
  };
}
