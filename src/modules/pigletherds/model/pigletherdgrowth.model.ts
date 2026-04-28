// pigletherd-growth.model.ts

export interface PigletHerdGrowth {
  id: string;
  herdId: string;
  trackingDate: string;
  averageWeight?: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreatePigletHerdGrowthRequest = {
  herdId: string;
  trackingDate: string;
  averageWeight?: number;
  note?: string;
};

export type UpdatePigletHerdGrowthRequest = {
  trackingDate?: string;
  averageWeight?: number;
  note?: string;
};