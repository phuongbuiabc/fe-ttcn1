export interface Supply {
  id: string;
  supply_id: string;
  supply_name: string;
  quantity: number;
  unit: string;
  supply_type: string;
  description: string;
}

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
