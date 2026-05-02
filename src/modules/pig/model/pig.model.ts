import { PigType, PigStatus } from '@/shared/enums/pig.enum';
import { StringList } from '@google/genai';

export interface CreatePigRequest {
  earTag?: string;
  birthWeight?: number;
  birthDate?: string;
  type: PigType;
  origin?: string;
  species?: string;
  nippleCount?: number;
  herdEntryDate?: string;
  status?: PigStatus;
}

export interface UpdatePigRequest {
  earTag?: string;
  birthWeight?: number;
  birthDate?: string;
  type?: PigType;
  origin?: string;
  species?: string;
  nippleCount?: number;
  herdEntryDate?: string;
  status?: PigStatus;
}

// ===== RESPONSE =====

export interface PigResponse {
  id: string;
  pigCode: string;
  earTag?: string;
  birthWeight?: number;
  birthDate?: string;
  type: PigType;
  origin?: string;
  species?: string;
  nippleCount?: number;
  herdEntryDate?: string;
  status?: PigStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PigGrowthItemResponse {
  id: string;
  trackingDate: string;
  litterLength?: number;
  chestGirth?: number;
  weight?: number;
  adg?: number;
  fcr?: number;
}

export interface PigDiseaseHistoryItemResponse {
  id: string;
  diseaseCode: string;
  diseaseName: string;
  sickDate: string;
  recoveryDate?: string;
  status: string;// cần enum cho trạng thái bệnh: 'SICK' | 'RECOVERED' | 'DECEASED'
}

export interface PigVaccinationItemResponse {
  id: string;
  vaccineName: string;
  vaccinationDate: string;
  dosage?: string;
  note?: string;
}

export interface PigDetailResponse {
  pig: PigResponse;
  currentPenId?: string;
  currentPenName?: string;
  penEntryDate?: string;
  currentWeight?: number;
  adg?: number;
  fcr?: number;
  growthHistory: PigGrowthItemResponse[];
  diseaseHistory: PigDiseaseHistoryItemResponse[];
  vaccinations: PigVaccinationItemResponse[];
}

export interface SowResponse{
  id: string;
  earTag: string;
  type: PigType;
  species: string;
  totalPregnancies: number;
  miscarriageCount: number;
  status: PigStatus;
}

export interface PregnantResponse {
  id: string;
  earTag: string;
  matingDate: string;
  conceptionDate: string;
  expectedFarrowDate: string;
  prenancyNumber: number;
  status: string;
}

export interface PigCurrentResponse {
  id: string;
  earTag: string;
  type: PigType;
  species: string;
  status: PigStatus;
  latestTrackingDate?: string;
  weight?: number;
  litterLength?: number;
  chestGirth?: number;
  adg?: number;
  fcr?: number;
}