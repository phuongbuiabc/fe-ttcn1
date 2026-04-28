export interface PigletHerdResponse {
  id: string;
  herdName: string;
  litterNumber: number;
  motherId?: string;
  fatherId?: string;
  quantity?: number;
  genderNote?: string;
  averageBirthWeight?: number;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePigletHerdRequest {
  litterNumber: number;
  motherId?: string;
  fatherId?: string;
  quantity?: number;
  genderNote?: string;
  averageBirthWeight?: number;
  birthDate?: string;
}

export interface UpdatePigletHerdRequest {
  litterNumber?: number;
  motherId?: string;
  fatherId?: string;
  quantity?: number;
  genderNote?: string;
  averageBirthWeight?: number;
  birthDate?: string;
}