export enum PigletHerdStatus {
  UNWEANED = 'UNWEANED',
  WEANED = 'WEANED',
}

export interface PigletHerdResponse {
  id: string;
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