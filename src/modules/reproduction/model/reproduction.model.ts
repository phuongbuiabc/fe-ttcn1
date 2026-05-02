export interface SowRecord {
  id: string;
  earTag?: string;
  breed: string;
  pen: string;
  status: 'OPEN' | 'BRED' | 'PREGNANT' | 'FARROWING' | 'LACTATING' | 'WEANED';
  matingDate?: string;
  expectedFarrowDate?: string;
  progress?: number;
  daysInStatus?: number;
}

export interface ReproductionStats {
  totalSows: number;
  pregnantSows: number;
  farrowingSoon: number;
  monthlyLitters: number;
  conceptionRate: number;
}
