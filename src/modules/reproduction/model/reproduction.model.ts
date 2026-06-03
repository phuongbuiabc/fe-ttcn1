import { ReproductionCycle } from '@/shared/enums/reproductioncycle.enum';

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
  totalBoars: number;
  pregnantSows: number;
  farrowingSoon: number;
  monthlyLitters: number;
  conceptionRate: number;
}

export interface ReproductionCycleStatusRequest {
  id: string;
  status: ReproductionCycle;
}

export interface FarrowingRecordRequest {
  id: string;
  actualFarrowDate: string;
  status: ReproductionCycle.FARROWED;
  bornCount: number;
  aliveCount: number;
  deadCount: number;
  crushedCount: number;
  deformedCount: number;
  averageWeight: number;
}
