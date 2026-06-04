"use client";

import React from "react";
import {
  Package, Calendar, Truck, ShieldAlert, AlertTriangle,
  Eye, Pencil, Trash2, Tag, ArrowDownToLine, ArrowUpFromLine, Archive,
} from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { Supply, MaterialType, ReceiptHistoryItem, SupplyLoss } from "../../model/inventory.model";
import { Employee } from "@/shared/types";
import { TableSkeleton } from "@/shared/components/TableSkeleton";

// ── Material type helpers ────────────────────────────────────────────────────
const TYPE_LABEL: Record<string, string> = {
  [MaterialType.FEED]: "Thức ăn",
  [MaterialType.VACCINE]: "Vaccine",
  [MaterialType.MEDICINE]: "Thuốc",
};

const TYPE_STYLE: Record<string, string> = {
  [MaterialType.FEED]: "bg-amber-50 text-amber-600 border-amber-100/60",
  [MaterialType.VACCINE]: "bg-violet-50 text-violet-600 border-violet-100/60",
  [MaterialType.MEDICINE]: "bg-sky-50 text-sky-600 border-sky-100/60",
};

// ── Shared cell/row primitives ───────────────────────────────────────────────
function BadgeIcon({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center font-black text-[10px] shadow-sm shrink-0", color)}>
      {children}
    </div>
  );
}

function ActionBtn({
  onClick, icon: Icon, hoverColor, title,
}: {
  onClick: () => void;
  icon: React.ElementType;
  hoverColor: string;
  title: string;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      className={cn(
        "p-1.5 text-slate-400 rounded-lg transition-colors",
        hoverColor,
      )}
    >
      <Icon size={14} />
    </button>
  );
}

// ── TABLE HEADER shared util ─────────────────────────────────────────────────
function TH({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none whitespace-nowrap", className)}>
      {children}
    </th>
  );
}
function TD({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn("px-6 py-[18px] align-middle", className)}>
      {children}
    </td>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  STOCK TAB
// ────────────────────────────────────────────────────────────────────────────
interface StockTableProps {
  supplies: Supply[];
  loading: boolean;
  onView: (item: Supply) => void;
  onEdit: (item: Supply) => void;
  onDelete: (item: Supply) => void;
}

function StockRows({ supplies, onView, onEdit, onDelete }: Omit<StockTableProps, "loading">) {
  if (supplies.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="py-20 text-center">
          <Archive size={40} className="mx-auto text-slate-200 mb-3" />
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Kho trống — chưa có vật tư nào</p>
        </td>
      </tr>
    );
  }

  return (
    <>
      {supplies.map((item) => {
        const low = item.quantity < 10;
        return (
          <tr
            key={item.id}
            onClick={() => onView(item)}
            className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
          >
            <TD>
              <div className="flex items-center gap-3.5">
                <BadgeIcon color={low ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"}>
                  {item.name?.charAt(0).toUpperCase() || "V"}
                </BadgeIcon>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-emerald-600 transition-colors">{item.name}</p>
                  {item.description && (
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 max-w-[200px] truncate">{item.description}</p>
                  )}
                </div>
              </div>
            </TD>

            <TD>
              <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", TYPE_STYLE[item.materialType] || "bg-slate-50 text-slate-500 border-slate-100")}>
                {TYPE_LABEL[item.materialType] || item.materialType}
              </span>
            </TD>

            <TD className="text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5">
                  {low && <AlertTriangle size={13} className="text-rose-400 animate-pulse" />}
                  <span className={cn("text-lg font-black tracking-tight", low ? "text-rose-500" : "text-slate-800")}>
                    {item.quantity.toLocaleString()}
                  </span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.unit}</span>
              </div>
            </TD>

            <TD>
              <p className="text-xs text-slate-500 font-medium max-w-[180px] truncate">{item.description || "—"}</p>
            </TD>

            <TD className="text-right">
              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                <ActionBtn onClick={() => onView(item)} icon={Eye} hoverColor="hover:bg-blue-50 hover:text-blue-500" title="Xem chi tiết" />
                <ActionBtn onClick={() => onEdit(item)} icon={Pencil} hoverColor="hover:bg-amber-50 hover:text-amber-500" title="Chỉnh sửa" />
                <ActionBtn onClick={() => onDelete(item)} icon={Trash2} hoverColor="hover:bg-rose-50 hover:text-rose-500" title="Xóa vật tư" />
              </div>
            </TD>
          </tr>
        );
      })}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  IMPORT TAB
// ────────────────────────────────────────────────────────────────────────────
interface ReceiptTableProps {
  receipts: ReceiptHistoryItem[];
  loading: boolean;
  supplies: Supply[];          // for material name resolution
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function ReceiptRows({ receipts, supplies, onView, onEdit, onDelete }: Omit<ReceiptTableProps, "loading">) {
  // resolve material name: supply_id might be UUID (cache miss) or name (cache hit)
  const resolveMaterialName = (supplyId: string) => {
    const found = supplies.find((s) => s.id === supplyId || s.name === supplyId);
    return found?.name ?? supplyId;
  };
  if (receipts.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="py-20 text-center">
          <ArrowDownToLine size={40} className="mx-auto text-slate-200 mb-3" />
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Chưa có phiếu nhập kho nào</p>
        </td>
      </tr>
    );
  }

  return (
    <>
      {receipts.map((rec) => (
        <tr
          key={rec.id}
          onClick={() => onView(rec.receipt_id)}
          className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
        >
          <TD>
            <div className="flex items-center gap-3.5">
              <BadgeIcon color="bg-blue-50 text-blue-500">
                <ArrowDownToLine size={14} />
              </BadgeIcon>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {resolveMaterialName(rec.supply_id)}
                </p>
              </div>
            </div>
          </TD>

          <TD className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-500">
              <Calendar size={12} />
              <span className="text-xs font-bold">{new Date(rec.date).toLocaleDateString("vi-VN")}</span>
            </div>
          </TD>

          <TD>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 shrink-0">
                <Truck size={11} />
              </div>
              <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{rec.supplier || "—"}</span>
            </div>
          </TD>

          <TD className="text-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-[11px] font-black rounded-xl border border-blue-100/50">
              {rec.quantity.toLocaleString()}
              <span className="text-[9px] opacity-70">{rec.unit}</span>
            </span>
          </TD>

          <TD className="text-right">
            <div className="flex items-center justify-end gap-0.5 text-emerald-600 font-black">
              <span className="text-sm">{(rec.price || 0).toLocaleString("vi-VN")}</span>
              <span className="text-[9px] font-bold text-emerald-500/70">đ</span>
            </div>
          </TD>

          <TD className="text-right">
            <div className="flex justify-end gap-1">
              <ActionBtn onClick={() => onView(rec.receipt_id)} icon={Eye} hoverColor="hover:bg-blue-50 hover:text-blue-500" title="Xem chi tiết" />
              <ActionBtn onClick={() => onEdit(rec.receipt_id)} icon={Pencil} hoverColor="hover:bg-amber-50 hover:text-amber-500" title="Chỉnh sửa" />
              <ActionBtn onClick={() => onDelete(rec.receipt_id)} icon={Trash2} hoverColor="hover:bg-rose-50 hover:text-rose-500" title="Hủy phiếu" />
            </div>
          </TD>
        </tr>
      ))}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  EXPORT TAB
// ────────────────────────────────────────────────────────────────────────────
interface IssueTableProps {
  issues: SupplyLoss[];
  loading: boolean;
  supplies: Supply[];          // for material name resolution
  employees: Employee[];       // for employee name resolution
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function IssueRows({ issues, supplies, employees, onView, onEdit, onDelete }: Omit<IssueTableProps, "loading">) {
  const resolveMaterialName = (supplyId: string) => {
    const found = supplies.find((s) => s.id === supplyId || s.name === supplyId);
    return found?.name ?? supplyId;
  };

  const resolveEmployeeName = (empId: string) => {
    if (!empId || empId === "N/A") return "N/A";
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return empId;
    return emp.fullName || `${emp.firstName} ${emp.lastName}`.trim();
  };
  if (issues.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="py-20 text-center">
          <ArrowUpFromLine size={40} className="mx-auto text-slate-200 mb-3" />
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Chưa có phiếu xuất kho nào</p>
        </td>
      </tr>
    );
  }

  return (
    <>
      {issues.map((issue) => (
        <tr
          key={issue.id}
          onClick={() => onView(issue.loss_id)}
          className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
        >
          <TD>
            <div className="flex items-center gap-3.5">
              <BadgeIcon color="bg-rose-50 text-rose-500">
                <ArrowUpFromLine size={14} />
              </BadgeIcon>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                  {resolveMaterialName(issue.supply_id)}
                </p>
              </div>
            </div>
          </TD>

          <TD className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-500">
              <Calendar size={12} />
              <span className="text-xs font-bold">{new Date(issue.date).toLocaleDateString("vi-VN")}</span>
            </div>
          </TD>

          <TD>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert size={11} />
              </div>
              <span className="text-xs font-bold text-slate-600 max-w-[160px] truncate">{issue.reason || "Không có lý do"}</span>
            </div>
          </TD>

          <TD className="text-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-600 text-[11px] font-black rounded-xl border border-rose-100/50">
              {issue.quantity.toLocaleString()}
            </span>
          </TD>

          <TD>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Tag size={12} />
              <span className="text-xs font-medium">{resolveEmployeeName(issue.employee_id)}</span>
            </div>
          </TD>

          <TD className="text-right">
            <div className="flex justify-end gap-1">
              <ActionBtn onClick={() => onView(issue.loss_id)} icon={Eye} hoverColor="hover:bg-blue-50 hover:text-blue-500" title="Xem chi tiết" />
              <ActionBtn onClick={() => onEdit(issue.loss_id)} icon={Pencil} hoverColor="hover:bg-amber-50 hover:text-amber-500" title="Chỉnh sửa" />
              <ActionBtn onClick={() => onDelete(issue.loss_id)} icon={Trash2} hoverColor="hover:bg-rose-50 hover:text-rose-500" title="Hủy phiếu" />
            </div>
          </TD>
        </tr>
      ))}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  MAIN EXPORT — unified wrapper
// ────────────────────────────────────────────────────────────────────────────
type Tab = "stock" | "import" | "export";

interface InventoryDataTableProps {
  activeTab: Tab;
  // stock
  supplies?: Supply[];
  loadingStock?: boolean;
  onViewSupply?: (item: Supply) => void;
  onEditSupply?: (item: Supply) => void;
  onDeleteSupply?: (item: Supply) => void;
  // import
  receipts?: ReceiptHistoryItem[];
  loadingReceipts?: boolean;
  onViewReceipt?: (id: string) => void;
  onEditReceipt?: (id: string) => void;
  onDeleteReceipt?: (id: string) => void;
  // export
  issues?: SupplyLoss[];
  loadingIssues?: boolean;
  onViewIssue?: (id: string) => void;
  onEditIssue?: (id: string) => void;
  onDeleteIssue?: (id: string) => void;
  // shared data for name resolution
  employees?: Employee[];
}

const TAB_META: Record<Tab, { label: string; color: string; icon: React.ElementType; columns: string[] }> = {
  stock: {
    label: "Danh mục vật tư",
    color: "text-emerald-600",
    icon: Package,
    columns: ["Vật tư", "Phân loại", "Số lượng", "Mô tả", "Thao tác"],
  },
  import: {
    label: "Nhật ký phiếu nhập kho",
    color: "text-blue-600",
    icon: ArrowDownToLine,
    columns: ["Vật tư", "Ngày nhập", "Nhà cung cấp", "Số lượng", "Đơn giá", "Thao tác"],
  },
  export: {
    label: "Nhật ký phiếu xuất kho",
    color: "text-rose-600",
    icon: ArrowUpFromLine,
    columns: ["Vật tư", "Ngày xuất", "Lý do", "Số lượng", "Nhân viên", "Thao tác"],
  },
};

export function InventoryDataTable({
  activeTab,
  supplies = [], loadingStock = false,
  onViewSupply, onEditSupply, onDeleteSupply,
  receipts = [], loadingReceipts = false,
  onViewReceipt, onEditReceipt, onDeleteReceipt,
  issues = [], loadingIssues = false,
  onViewIssue, onEditIssue, onDeleteIssue,
  employees = [],
}: InventoryDataTableProps) {
  const meta = TAB_META[activeTab];
  const TabIcon = meta.icon;

  const isLoading =
    (activeTab === "stock" && loadingStock) ||
    (activeTab === "import" && loadingReceipts) ||
    (activeTab === "export" && loadingIssues);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-50">
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50", meta.color)}>
          <TabIcon size={16} />
        </div>
        <h2 className="text-base font-black text-slate-800 uppercase tracking-widest">{meta.label}</h2>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="p-8">
          <TableSkeleton />
        </div>
      )}

      {/* Table — always rendered (hidden while loading to keep layout stable) */}
      {!isLoading && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/40 border-b border-slate-100/60">
              <tr>
                {meta.columns.map((col, i) => (
                  <TH
                    key={col}
                    className={cn(
                      i === meta.columns.length - 1 ? "text-right" : "",
                      i === 2 || (activeTab !== "stock" && i === 3) ? "text-center" : ""
                    )}
                  >
                    {col}
                  </TH>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeTab === "stock" && (
                <StockRows
                  supplies={supplies}
                  onView={onViewSupply!}
                  onEdit={onEditSupply!}
                  onDelete={onDeleteSupply!}
                />
              )}
              {activeTab === "import" && (
                <ReceiptRows
                  receipts={receipts}
                  supplies={supplies}
                  onView={onViewReceipt!}
                  onEdit={onEditReceipt!}
                  onDelete={onDeleteReceipt!}
                />
              )}
              {activeTab === "export" && (
                <IssueRows
                  issues={issues}
                  supplies={supplies}
                  employees={employees}
                  onView={onViewIssue!}
                  onEdit={onEditIssue!}
                  onDelete={onDeleteIssue!}
                />
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
