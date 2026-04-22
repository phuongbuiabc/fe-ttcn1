export interface Pig {
  id: string;
  pigCode: string;
  type?: string;
  breed: string;
  weight: number;
  healthStatus: string;
  status: string;
  statusColor?: string;
  pen: string;
  penId?: string;
  penName?: string;
  birthDate: string;
  date?: string;
  entryDate: string;
  growth?: string;
  ageDays?: number;
  lastWeightUpdate?: string;
}

export interface Litter {
  id: string;
  motherId: string;
  birthDate: string;
  count: number;
  status: string;
  pen: string;
}

export interface PigStats {
  total: number;
  healthy: number;
  sick: number;
  treating: number;
  growthRate: number;
}
