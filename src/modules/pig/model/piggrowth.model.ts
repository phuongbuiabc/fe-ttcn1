// growth.model.ts

export interface GrowthTracking {
  id: string;
  pigId: string;
  trackingDate: string;
  litterLength?: number;
  chestGirth?: number;
  weight?: number;
  growthRate?: number;
  adg?: number;
  fcr?: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateGrowthTrackingRequest = Omit<
  GrowthTracking,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateGrowthTrackingRequest = Partial<CreateGrowthTrackingRequest>;