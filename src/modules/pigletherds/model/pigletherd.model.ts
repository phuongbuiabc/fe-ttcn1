import { PigletHerdStatus } from "@/shared/enums/pigletherd.enum";
export interface PigletHerdResponse {
  id: string;
  herdName: string;
  litterNumber: number;
  penId?: string;
  penName?: string;
  motherId?: string;
  motherEarTag?: string;
  motherBreed?: string;
  fatherId?: string;
  fatherEarTag?: string;
  fatherBreed?: string;
  quantity?: number;
  genderNote?: string;
  averageBirthWeight?: number;
  birthDate?: string;
  semenId?: string;
  status?: PigletHerdStatus;
  isSold?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePigletHerdRequest {
  herdName: string;
  litterNumber: number;
  penId?: string;
  motherId?: string;
  motherEarTag?: string;
  motherBreed?: string;
  fatherId?: string;
  fatherEarTag?: string;
  fatherBreed?: string;
  quantity?: number;
  genderNote?: string;
  averageBirthWeight?: number;
  birthDate?: string;
  semenId?: string;
  status?: PigletHerdStatus;
  isSold?: boolean;
}

export interface UpdatePigletHerdRequest {
  herdName?: string;
  litterNumber?: number;
  penId?: string;
  motherId?: string;
  motherEarTag?: string;
  motherBreed?: string;
  fatherId?: string;
  fatherEarTag?: string;
  fatherBreed?: string;
  quantity?: number;
  genderNote?: string;
  averageBirthWeight?: number;
  birthDate?: string;
  semenId?: string;
  status?: PigletHerdStatus;
  isSold?: boolean;
}

export interface PigletHerdGrowthHistoryItemResponse {
  id: string;
  herdId: string;
  trackingDate: string;
  averageWeight: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PigletHerdMovementHistoryItemResponse {
  id: string;
  herdId: string;
  movementType: string;
  sourceHerdId?: string;
  targetHerdId?: string;
  movementDate: string;
  quantity: number;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PigletHerdDetailResponse {
  herd: PigletHerdResponse;
  growthHistory: PigletHerdGrowthHistoryItemResponse[];
  movementHistory: PigletHerdMovementHistoryItemResponse[];
}