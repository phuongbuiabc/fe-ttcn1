export enum MaterialType {
  FEED = "FEED",
  VACCINE = "VACCINE",
  MEDICINE = "MEDICINE"
}

export interface LivestockMaterial {
  id: string;
  name: string;
  unit: string;
  materialType: MaterialType | string;
  quantity: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

// Keeping Supply alias for backward compatibility during migration
export type Supply = LivestockMaterial;

export interface SupplyLoss {
  id: string;
  loss_id: string;
  supply_id: string;
  employee_id: string;
  date: string;
  quantity: number;
  reason: string;
  note: string;
}

export interface SupplyFormInput {
  name: string;
  materialType: MaterialType | string;
  quantity: number | "";
  unit: string;
  description: string;
}

export interface LossFormInput {
  loss_id: string;
  date: string;
  employee_id: string;
  quantity: number | "";
  reason: string;
  note: string;
}

export interface AdjustmentFormInput {
  quantity_change: number | "";
  reason: string;
  note: string;
}

// API entities for livestock management
export interface MaterialIssue {
  id: string;
  issueDate: string;
  employeeId: string;
  reason: string;
  notes: string;
}

export interface MaterialIssueDetail {
  id: string;
  issueId: string;
  itemId: string;
  quantity: number;
  unit: string;
}

export interface MaterialReceipt {
  id: string;
  receiptDate: string;
  supplierName: string;
}

export interface MaterialReceiptDetail {
  id: string;
  receiptId: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export interface ReceiptHistoryItem {
  id: string;
  receipt_id: string;
  supply_id: string;
  date: string;
  supplier: string;
  quantity: number;
  price: number;
  unit: string;
}

