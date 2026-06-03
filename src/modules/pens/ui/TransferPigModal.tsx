"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Check, ChevronDown, Loader2, MoveRight, PawPrint, Search, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { penService } from "@/modules/pens/api/pen.service";
import { PenDetailResponse, PenResponse, PenPigSummary, PenPigletHerdSummary } from "@/modules/pens/model/pen.model";
import { penPigService } from "@/modules/penpig/api/penpig.service";
import { TransferPenPigRequest } from "@/modules/penpig/model/penpig.model";
import { AreaResponse } from "@/modules/area/model/area.model";

interface TransferPigModalProps {
  isOpen: boolean;
  onClose: () => void;
  pens: PenResponse[];
  areas?: AreaResponse[];
  onTransferred?: (sourcePenId: string) => void | Promise<void>;
}

type ActiveTab = "pigs" | "herds";

const PIGS_PAGE_SIZE = 8;
const HERDS_PAGE_SIZE = 8;

const formatWeight = (value?: number) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${value} kg`;
};

const getPenCode = (pen: PenResponse) => {
  const fallbackPen = pen as PenResponse & { penCode?: string; code?: string; penName?: string };
  return fallbackPen.penCode || fallbackPen.code || fallbackPen.penName || pen.name;
};

const getPenLabel = (pen: PenResponse, areaName?: string) =>
  areaName ? `${pen.name} · ${areaName}` : pen.name;

const includesText = (value: string | undefined, search: string) =>
  (value || "").toLowerCase().includes(search);

export function TransferPigModal({ isOpen, onClose, pens, areas: propAreas, onTransferred }: TransferPigModalProps) {
  const [sourcePenId, setSourcePenId] = useState("");
  const [sourceAreaId, setSourceAreaId] = useState("");
  const [selectedTab, setSelectedTab] = useState<ActiveTab>("pigs");
  const [searchTerm, setSearchTerm] = useState("");
  const [targetAreaId, setTargetAreaId] = useState("");
  const [targetPenCode, setTargetPenCode] = useState("");
  const [sourcePenDetail, setSourcePenDetail] = useState<PenDetailResponse | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPigs, setSelectedPigs] = useState<Record<string, PenPigSummary>>({});
  const [selectedHerds, setSelectedHerds] = useState<Record<string, PenPigletHerdSummary>>({});

  const areas = useMemo(() => {
    if (propAreas && propAreas.length > 0) {
      return propAreas.map((area) => ({ id: area.id, name: area.name }));
    }

    const map = new Map<string, string>();
    pens.forEach((pen) => {
      if (pen.areaId) map.set(pen.areaId, pen.areaId);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [pens, propAreas]);

  const areaMap = useMemo(() => {
    const map: Record<string, string> = {};
    areas.forEach((area) => {
      map[area.id] = area.name;
    });
    return map;
  }, [areas]);

  const sourcePens = useMemo(() => {
    return pens.filter((pen) => {
      if (!sourceAreaId) return true;
      return pen.areaId === sourceAreaId;
    });
  }, [pens, sourceAreaId]);

  const filteredPens = useMemo(() => {
    return pens.filter((pen) => {
      if (pen.id === sourcePenId) return false;
      if (!targetAreaId) return true;
      return pen.areaId === targetAreaId;
    });
  }, [pens, sourcePenId, targetAreaId]);

  const sourcePigs = useMemo(() => sourcePenDetail?.pigs || [], [sourcePenDetail]);
  const sourceHerds = useMemo(() => sourcePenDetail?.pigletHerds || [], [sourcePenDetail]);

  const filteredPigs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return sourcePigs.filter((pig) => {
      if (!term) return true;
      return (
        includesText(pig.pigId, term) ||
        includesText(pig.earTag, term) ||
        includesText(pig.type, term)
      );
    });
  }, [searchTerm, sourcePigs]);

  const filteredHerds = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return sourceHerds.filter((herd) => {
      if (!term) return true;
      return (
        includesText(herd.id, term) ||
        includesText(herd.herdCode, term) ||
        includesText(herd.herdName, term)
      );
    });
  }, [searchTerm, sourceHerds]);

  const filteredDisplayedPigs = useMemo(() => filteredPigs.slice(0, PIGS_PAGE_SIZE), [filteredPigs]);
  const filteredDisplayedHerds = useMemo(() => filteredHerds.slice(0, HERDS_PAGE_SIZE), [filteredHerds]);

  const allVisiblePigIds = useMemo(() => filteredDisplayedPigs.map((pig) => pig.pigId), [filteredDisplayedPigs]);
  const allVisibleHerdIds = useMemo(() => filteredDisplayedHerds.map((herd) => herd.id), [filteredDisplayedHerds]);

  const selectedPigItems = Object.values(selectedPigs);
  const selectedHerdItems = Object.values(selectedHerds);

  const allSelectedCount = selectedPigItems.length + selectedHerdItems.length;

  const currentTargetPens = useMemo(() => {
    return filteredPens;
  }, [filteredPens]);

  useEffect(() => {
    if (!isOpen) return;

    const initialPen = pens[0];
    setSourcePenId(initialPen?.id || "");
    setSourceAreaId(initialPen?.areaId || "");
    setSelectedTab("pigs");
    setSearchTerm("");
    setTargetAreaId("");
    setTargetPenCode("");
    setSelectedPigs({});
    setSelectedHerds({});
  }, [isOpen, pens]);

  useEffect(() => {
    if (!sourcePens.length) {
      setSourcePenId("");
      return;
    }

    const exists = sourcePens.some((pen) => pen.id === sourcePenId);
    if (!exists) {
      setSourcePenId(sourcePens[0].id);
    }
  }, [sourcePens, sourcePenId]);

  useEffect(() => {
    if (!isOpen || !sourcePenId) {
      setSourcePenDetail(null);
      return;
    }

    let active = true;
    const loadDetail = async () => {
      setIsLoadingDetail(true);
      try {
        const res = await penService.getDetail(sourcePenId);
        if (!active) return;
        setSourcePenDetail(res.success ? res.data ?? null : null);
      } catch {
        if (active) setSourcePenDetail(null);
      } finally {
        if (active) setIsLoadingDetail(false);
      }
    };

    loadDetail();

    return () => {
      active = false;
    };
  }, [isOpen, sourcePenId]);

  useEffect(() => {
    setSelectedPigs({});
    setSelectedHerds({});
  }, [sourcePenId]);

  if (!isOpen) return null;

  const togglePig = (pig: PenPigSummary) => {
    setSelectedPigs((prev) => {
      if (prev[pig.pigId]) {
        const next = { ...prev };
        delete next[pig.pigId];
        return next;
      }

      return { ...prev, [pig.pigId]: pig };
    });
  };

  const toggleHerd = (herd: PenPigletHerdSummary) => {
    setSelectedHerds((prev) => {
      if (prev[herd.id]) {
        const next = { ...prev };
        delete next[herd.id];
        return next;
      }

      return { ...prev, [herd.id]: herd };
    });
  };

  const toggleSelectAllPigs = () => {
    const visibleSelected = allVisiblePigIds.every((id) => selectedPigs[id]);

    if (visibleSelected) {
      setSelectedPigs((prev) => {
        const next = { ...prev };
        allVisiblePigIds.forEach((id) => delete next[id]);
        return next;
      });
      return;
    }

    setSelectedPigs((prev) => {
      const next = { ...prev };
      filteredDisplayedPigs.forEach((pig) => {
        next[pig.pigId] = pig;
      });
      return next;
    });
  };

  const toggleSelectAllHerds = () => {
    const visibleSelected = allVisibleHerdIds.every((id) => selectedHerds[id]);

    if (visibleSelected) {
      setSelectedHerds((prev) => {
        const next = { ...prev };
        allVisibleHerdIds.forEach((id) => delete next[id]);
        return next;
      });
      return;
    }

    setSelectedHerds((prev) => {
      const next = { ...prev };
      filteredDisplayedHerds.forEach((herd) => {
        next[herd.id] = herd;
      });
      return next;
    });
  };

  const isPigAllChecked = allVisiblePigIds.length > 0 && allVisiblePigIds.every((id) => selectedPigs[id]);
  const isPigIndeterminate = allVisiblePigIds.some((id) => selectedPigs[id]) && !isPigAllChecked;
  const isHerdAllChecked = allVisibleHerdIds.length > 0 && allVisibleHerdIds.every((id) => selectedHerds[id]);
  const isHerdIndeterminate = allVisibleHerdIds.some((id) => selectedHerds[id]) && !isHerdAllChecked;

  const clearSelections = () => {
    setSelectedPigs({});
    setSelectedHerds({});
  };

  const handleConfirm = async () => {
    if (!targetPenCode || isSubmitting || allSelectedCount === 0) return;

    const payloads: TransferPenPigRequest[] = [
      ...selectedPigItems.map((pig) => ({ pigId: pig.pigId, targetPenCode })),
      ...selectedHerdItems.map((herd) => ({ herdId: herd.id, targetPenCode })),
    ];

    setIsSubmitting(true);
    try {
      for (const payload of payloads) {
        await penPigService.transfer(payload);
      }

      await onTransferred?.(sourcePenId);
      clearSelections();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          className="flex max-h-[94vh] w-full max-w-[1440px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-6 py-5 text-white">
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight">Điều chuyển lợn</h3>
            </div>

            <button
              onClick={onClose}
              className="rounded-full border border-white/20 bg-white/10 p-2.5 transition hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 gap-4 overflow-hidden p-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-4">
                <div className="grid gap-3 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Khu vực</label>
                    <div className="relative">
                      <select
                        value={sourceAreaId}
                        onChange={(e) => setSourceAreaId(e.target.value)}
                        className="w-full appearance-none bg-transparent pr-8 text-sm font-semibold text-slate-900 outline-none"
                      >
                        <option value="">Tất cả khu vực</option>
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Chuồng hiện tại</label>
                    <div className="relative">
                      <select
                        value={sourcePenId}
                        onChange={(e) => setSourcePenId(e.target.value)}
                        className="w-full appearance-none bg-transparent pr-8 text-sm font-semibold text-slate-900 outline-none"
                      >
                        {sourcePens.map((pen) => (
                          <option key={pen.id} value={pen.id}>
                            {getPenLabel(pen, areaMap[pen.areaId])}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Tìm nhanh</label>
                    <div className="flex items-center gap-2">
                      <Search size={14} className="text-slate-400" />
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Mã lợn, mã tai, mã đàn"
                        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 bg-white px-4 py-3">
                <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                  <button
                    onClick={() => setSelectedTab("pigs")}
                    className={`inline-flex min-w-[110px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${selectedTab === "pigs" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}
                  >
                    <PawPrint size={15} /> Lợn
                  </button>
                  <button
                    onClick={() => setSelectedTab("herds")}
                    className={`inline-flex min-w-[110px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${selectedTab === "herds" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}
                  >
                    <Users size={15} /> Đàn con
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-auto">
                {selectedTab === "pigs" ? (
                  <BulkTransferTable
                    title="Danh sách lợn"
                    loading={isLoadingDetail}
                    items={filteredDisplayedPigs}
                    totalCount={filteredPigs.length}
                    selectedCount={selectedPigItems.length}
                    allChecked={isPigAllChecked}
                    indeterminate={isPigIndeterminate}
                    onToggleAll={toggleSelectAllPigs}
                    onToggleItem={(pig) => togglePig(pig)}
                    isSelected={(pig) => Boolean(selectedPigs[pig.pigId])}
                    emptyText="Chuồng này chưa có lợn phù hợp với bộ lọc"
                    columns={["Mã tai", "Loại", "Cân nặng"]}
                    renderRow={(pig) => [pig.earTag || "--", pig.type || "--", formatWeight(pig.currentWeight)]}
                  />
                ) : (
                  <BulkTransferTable
                    title="Danh sách đàn con"
                    loading={isLoadingDetail}
                    items={filteredDisplayedHerds}
                    totalCount={filteredHerds.length}
                    selectedCount={selectedHerdItems.length}
                    allChecked={isHerdAllChecked}
                    indeterminate={isHerdIndeterminate}
                    onToggleAll={toggleSelectAllHerds}
                    onToggleItem={(herd) => toggleHerd(herd)}
                    isSelected={(herd) => Boolean(selectedHerds[herd.id])}
                    emptyText="Chuồng này chưa có đàn con phù hợp với bộ lọc"
                    columns={["Tên đàn", "Số lượng", "Cân nặng TB"]}
                    renderRow={(herd) => [herd.herdName || "--", String(herd.quantity ?? "--"), formatWeight(herd.averageWeight)]}
                  />
                )}
              </div>
            </div>

            <div className="flex min-h-0 flex-col gap-4 overflow-auto">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Chuồng Đích</p>
                    <h4 className="text-lg font-black text-slate-900">Thiết lập điểm đến</h4>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">Khu vực</label>
                    <div className="relative">
                      <select
                        value={targetAreaId}
                        onChange={(e) => {
                          setTargetAreaId(e.target.value);
                          setTargetPenCode("");
                        }}
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      >
                        <option value="">Chọn khu vực</option>
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">Chuồng đích</label>
                    <div className="relative">
                      <select
                        value={targetPenCode}
                        onChange={(e) => setTargetPenCode(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      >
                        <option value="">Chọn chuồng đích</option>
                        {currentTargetPens.map((pen) => (
                          <option key={pen.id} value={getPenCode(pen)}>
                            {getPenLabel(pen, areaMap[pen.areaId])}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tổng hợp chọn</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <SummaryBox label="Tổng số lợn đã chọn" value={selectedPigItems.length} tone="emerald" />
                  <SummaryBox label="Tổng số đàn đã chọn" value={selectedHerdItems.length} tone="blue" />
                  <SummaryBox label="Tổng số cá thể điều chuyển" value={selectedPigItems.length + selectedHerdItems.reduce((sum, herd) => sum + (herd.quantity || 0), 0)} tone="amber" className="col-span-2" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm font-semibold text-slate-600">
                Đã chọn {allSelectedCount} đối tượng để điều chuyển.
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!targetPenCode || allSelectedCount === 0 || isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <MoveRight size={16} />}
                  Xác Nhận Điều Chuyển
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function BulkTransferTable<T extends { [key: string]: any }>({
  title,
  loading,
  items,
  totalCount,
  selectedCount,
  allChecked,
  indeterminate,
  onToggleAll,
  onToggleItem,
  isSelected,
  emptyText,
  columns,
  renderRow,
}: {
  title: string;
  loading: boolean;
  items: T[];
  totalCount: number;
  selectedCount: number;
  allChecked: boolean;
  indeterminate: boolean;
  onToggleAll: () => void;
  onToggleItem: (item: T) => void;
  isSelected: (item: T) => boolean;
  emptyText: string;
  columns: string[];
  renderRow: (item: T) => string[];
}) {
  const headerRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, items]);

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.16em] text-slate-900">{title}</h4>
          <p className="mt-1 text-xs text-slate-500">
            {selectedCount}/{totalCount} đã chọn
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {items.length} hiển thị
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 px-4 py-8 text-sm text-slate-500">
          <Loader2 size={14} className="animate-spin" /> Đang tải dữ liệu...
        </div>
      ) : items.length === 0 ? (
        <div className="px-4 py-8 text-sm text-slate-400">{emptyText}</div>
      ) : (
        <div className="min-h-0 overflow-auto">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  <label className="inline-flex items-center gap-2">
                    <input ref={headerRef} type="checkbox" checked={allChecked} onChange={onToggleAll} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    Chọn tất cả
                  </label>
                </th>
                {columns.map((column) => (
                  <th key={column} className="border-b border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const cells = renderRow(item);

                return (
                  <tr key={index} className={`transition ${isSelected(item) ? 'bg-emerald-50/70' : 'hover:bg-slate-50'}`}>
                    <td className="border-b border-slate-100 px-4 py-3 align-top">
                      <input
                        type="checkbox"
                        checked={isSelected(item)}
                        onChange={() => onToggleItem(item)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </td>
                    {cells.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border-b border-slate-100 px-4 py-3 align-top text-sm text-slate-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryBox({
  label,
  value,
  tone,
  className,
}: {
  label: string;
  value: number;
  tone: 'emerald' | 'blue' | 'amber';
  className?: string;
}) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  } as const;

  return (
    <div className={`rounded-2xl border px-4 py-3 ${tones[tone]} ${className || ''}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-80">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

