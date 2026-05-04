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

