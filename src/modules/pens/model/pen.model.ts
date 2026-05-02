import { PigType, PigStatus } from '@/shared/enums/pig.enum';

export interface PenResponse {
  id: string;
  name: string;
  area: number;
  areaId: string;
  penType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PenPigSummary {
  pigId: string;
  earTag: string;
  currentWeight: number;
  type: PigType;
  status: PigStatus;
}

export interface PenPigletHerdSummary {
  id: string;
  herdCode: string;
  herdName: string;
  quantity: number;
  averageWeight: number;
}

export interface PenDetailResponse {
  id: string;
  name: string;
  areaId: string;
  area: number;
  pigCount: number;
  pigletCount: number;
  latestAverageIntake: number;

  pigs: PenPigSummary[];
  pigletHerds: PenPigletHerdSummary[];
}

export interface CreatePenRequest {
  name: string;
  area?: number;
  areaId?: string;
  penType?: string;
  status?: string;
}

export interface UpdatePenRequest {
  name?: string;
  area?: number;
  areaId?: string;
  penType?: string;
  status?: string;
}