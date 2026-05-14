import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Supply, SupplyLoss, MaterialType } from "../model/inventory.model";
import { inventoryService } from "../api/inventory.service";
import { staffService } from "@/modules/staff/api/staff.service";

export function useInventory() {
  const pathname = usePathname();
  const [supplies, setSuppliers] = useState<Supply[]>([]);
  const [lossHistory, setLossHistory] = useState<SupplyLoss[]>([]);
  const [receiptHistory, setReceiptHistory] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const activeTab = pathname.endsWith("/losses") ? "losses" : (pathname.endsWith("/receipts") ? "receipts" : "inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("Tất cả");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals Status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [isLossDetailModalOpen, setIsLossDetailModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);

  // Selected Data
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [selectedSupplyForDetail, setSelectedSupplyForDetail] = useState<Supply | null>(null);
  const [selectedSupplyForLoss, setSelectedSupplyForLoss] = useState<Supply | null>(null);
  const [selectedSupplyForDelete, setSelectedSupplyForDelete] = useState<Supply | null>(null);
  const [selectedLossForDetail, setSelectedLossForDetail] = useState<SupplyLoss | null>(null);
  const [selectedLossForVoid, setSelectedLossForVoid] = useState<SupplyLoss | null>(null);

  // Forms
  const [supplyForm, setSupplyForm] = useState<any>({ name: "", materialType: MaterialType.FEED, quantity: 0, unit: "Kg", description: "" });
  const [lossForm, setLossForm] = useState<any>({ loss_id: "", date: "", employee_id: "", quantity: 0, reason: "Hỏng hóc", note: "" });

  const fetchInventoryData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [resSupplies, resLosses, resReceipts, resEmployees] = await Promise.all([
        inventoryService.getSupplies(),
        inventoryService.getLossHistory(),
        inventoryService.getReceiptHistory(),
        staffService.getEmployees()
      ]);
      if (resSupplies.success) setSuppliers(resSupplies.data);
      if (resLosses.success) setLossHistory(resLosses.data);
      if (resReceipts.success) setReceiptHistory(resReceipts.data);
      if (resEmployees.success) setEmployees(resEmployees.data);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    const cached = inventoryService.getCachedSupplies();
    if (cached) {
      setSuppliers(cached);
      setLoading(false);
      fetchInventoryData(false);
    } else {
      fetchInventoryData(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Logic Handlers
  const handleSaveSupply = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = editingSupply 
      ? await inventoryService.updateSupply(editingSupply.id, supplyForm)
      : await inventoryService.createSupply(supplyForm);

    if (res.success) {
      fetchInventoryData(false);
      setIsModalOpen(false);
    } else alert(res.message);
  };

  const handleRecordLoss = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplyForLoss) return;
    const res = await inventoryService.recordLoss({ ...lossForm, supply_id: selectedSupplyForLoss.id });
    if (res.success) {
      setIsLossModalOpen(false);
      fetchInventoryData(false);
    } else alert(res.message);
  };

  const handleVoidLoss = async () => {
    if (!selectedLossForVoid) return;
    const res = await inventoryService.voidLoss(selectedLossForVoid);
    if (res.success) {
      fetchInventoryData(false);
      setIsVoidModalOpen(false);
    } else alert(res.message);
  };

  const confirmDelete = async () => {
    if (!selectedSupplyForDelete) return;
    const res = await inventoryService.deleteSupply(selectedSupplyForDelete.id);
    if (res.success) {
      fetchInventoryData(false);
      setIsDeleteModalOpen(false);
    } else alert(res.message);
  };

  // Filtered Data
  const filteredSupplies = useMemo(() => 
    supplies.filter(s => 
      (activeType === "Tất cả" || s.materialType === activeType) &&
      (s.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || s.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    ), [supplies, activeType, debouncedSearchTerm]
  );

  const filteredLosses = useMemo(() => 
    lossHistory.filter(l => {
      const dateMatch = (!dateRange.start || l.date >= dateRange.start) && (!dateRange.end || l.date <= dateRange.end);
      const searchMatch = !debouncedSearchTerm || l.supply_id?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return dateMatch && searchMatch;
    }), [lossHistory, debouncedSearchTerm, dateRange]
  );

  const filteredReceipts = useMemo(() => 
    receiptHistory.filter(r => 
      !debouncedSearchTerm || r.supply_id?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ), [receiptHistory, debouncedSearchTerm]
  );

  return {
    supplies, lossHistory, receiptHistory, employees, loading, activeTab,
    searchTerm, setSearchTerm, activeType, setActiveType, dateRange, setDateRange,
    currentPage, setCurrentPage, itemsPerPage,
    modals: {
      isModalOpen, setIsModalOpen, isDetailModalOpen, setIsDetailModalOpen,
      isLossModalOpen, setIsLossModalOpen, isLossDetailModalOpen, setIsLossDetailModalOpen,
      isAdjustmentModalOpen, setIsAdjustmentModalOpen, isDeleteModalOpen, setIsDeleteModalOpen,
      isVoidModalOpen, setIsVoidModalOpen
    },
    selected: {
      editingSupply, setEditingSupply, selectedSupplyForDetail, setSelectedSupplyForDetail,
      selectedSupplyForLoss, setSelectedSupplyForLoss, selectedSupplyForDelete, setSelectedSupplyForDelete,
      selectedLossForDetail, setSelectedLossForDetail, selectedLossForVoid, setSelectedLossForVoid
    },
    forms: { supplyForm, setSupplyForm, lossForm, setLossForm },
    handlers: { handleSaveSupply, handleRecordLoss, handleVoidLoss, confirmDelete, fetchInventoryData },
    filtered: { filteredSupplies, filteredLosses, filteredReceipts }
  };
}
