import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Supply, SupplyLoss, MaterialType, SupplyFormInput, LossFormInput, AdjustmentFormInput } from "../model/inventory.model";
import { Employee } from "@/modules/staff/model/staff.model";
import { inventoryService } from "../api/inventory.service";
import { staffService } from "@/modules/staff/api/staff.service";

export function useInventory() {
  const pathname = usePathname();
  const [supplies, setSuppliers] = useState<Supply[]>([]);
  const [lossHistory, setLossHistory] = useState<SupplyLoss[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTabState] = useState<"inventory" | "losses">(
    pathname.endsWith("/losses") ? "losses" : "inventory"
  );

  // Sync initial tab based on path
  useEffect(() => {
    setActiveTabState(pathname.endsWith("/losses") ? "losses" : "inventory");
  }, [pathname]);

  // Handle browser back/forward and custom tab events seamlessly
  useEffect(() => {
    const handlePopState = () => {
      const isLosses = window.location.pathname.endsWith("/losses");
      setActiveTabState(isLosses ? "losses" : "inventory");
    };
    const handleCustomTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const targetPath = customEvent.detail;
      const isLosses = targetPath.endsWith("/losses");
      setActiveTabState(isLosses ? "losses" : "inventory");
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("inventory-tab-change", handleCustomTabChange);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("inventory-tab-change", handleCustomTabChange);
    };
  }, []);

  const setActiveTab = (tab: "inventory" | "losses") => {
    setActiveTabState(tab);
    const newPath = tab === "losses" ? "/inventory/losses" : "/inventory";
    window.history.pushState(null, "", newPath);
  };

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
  const [selectedSupplyForAdjustment, setSelectedSupplyForAdjustment] = useState<Supply | null>(null);

  // Forms
  const [supplyForm, setSupplyForm] = useState<SupplyFormInput>({ name: "", materialType: MaterialType.FEED, quantity: 0, unit: "Kg", description: "" });
  const [lossForm, setLossForm] = useState<LossFormInput>({ loss_id: "", date: "", employee_id: "", quantity: 0, reason: "Hỏng hóc", note: "" });
  const [adjForm, setAdjForm] = useState<AdjustmentFormInput>({ quantity_change: "", reason: "", note: "" });

  // Reset page on tab/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedSearchTerm, activeType, dateRange]);

  const fetchInventoryData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [resSupplies, resLosses, resEmployees] = await Promise.all([
        inventoryService.getSupplies(),
        inventoryService.getLossHistory(),
        staffService.getEmployees()
      ]);
      if (resSupplies.success) setSuppliers(resSupplies.data);
      if (resLosses.success) setLossHistory(resLosses.data);
      if (resEmployees.success) setEmployees(resEmployees.data as Employee[]);
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
  const handleOpenCreateModal = () => {
    setEditingSupply(null);
    setSupplyForm({ name: "", materialType: MaterialType.FEED, quantity: 0, unit: "Kg", description: "" });
    setIsModalOpen(true);
  };

  const handleSaveSupply = async (e: React.FormEvent) => {

    e.preventDefault();
    const sanitizedForm = {
      ...supplyForm,
      quantity: supplyForm.quantity === "" ? 0 : Number(supplyForm.quantity)
    };
    const res = editingSupply 
      ? await inventoryService.updateSupply(editingSupply.id, sanitizedForm)
      : await inventoryService.createSupply(sanitizedForm);

    if (res.success) {
      fetchInventoryData(false);
      setIsModalOpen(false);
    } else alert(res.message);
  };

  const handleRecordLoss = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplyForLoss) return;
    const sanitizedLoss = {
      ...lossForm,
      supply_id: selectedSupplyForLoss.id,
      quantity: lossForm.quantity === "" ? 0 : Number(lossForm.quantity)
    };
    const res = await inventoryService.recordLoss(sanitizedLoss);
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

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplyForAdjustment) return;
    const change = Number(adjForm.quantity_change);
    if (isNaN(change) || change === 0) {
      alert("Vui lòng nhập số lượng thay đổi hợp lệ khác 0");
      return;
    }
    const newQty = Math.max(0, (selectedSupplyForAdjustment.quantity || 0) + change);
    const res = await inventoryService.updateSupply(selectedSupplyForAdjustment.id, {
      ...selectedSupplyForAdjustment,
      quantity: newQty,
      description: `${selectedSupplyForAdjustment.description || ""}\n[Điều chỉnh: ${change > 0 ? "+" : ""}${change} - Lý do: ${adjForm.reason}]`
    });

    if (res.success) {
      setIsAdjustmentModalOpen(false);
      fetchInventoryData(false);
    } else {
      alert(res.message);
    }
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
      const searchMatch = !debouncedSearchTerm || 
                         l.supply_id?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         l.loss_id?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return dateMatch && searchMatch;
    }), [lossHistory, debouncedSearchTerm, dateRange]
  );

  return {
    supplies, lossHistory, employees, loading, activeTab, setActiveTab,
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
      selectedLossForDetail, setSelectedLossForDetail, selectedLossForVoid, setSelectedLossForVoid,
      selectedSupplyForAdjustment, setSelectedSupplyForAdjustment
    },
    forms: { supplyForm, setSupplyForm, lossForm, setLossForm, adjForm, setAdjForm },
    handlers: { handleOpenCreateModal, handleSaveSupply, handleRecordLoss, handleVoidLoss, confirmDelete, handleAdjustStock, fetchInventoryData },
    filtered: { filteredSupplies, filteredLosses }
  };
}
