export interface GrowthTrackingResponse {
    id: string;
    pigId: string;
    pigEarTag: string;
    trackingDate: string;
    litterLegth: number;
    chestGirth: number;
    weigth: number;
    growthRate: number;
    adg: number;
    fcr: number;
    note: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateGrowthTrackingRequest {
    pigId: string;
    trackingDate: string;
    litterLegth: number;
    chestGirth: number;
    weigth: number;
    growthRate: number;
    adg: number;
    fcr: number;
    note: string;
}

export interface UpdateGrowthTrackingRequest {
    pigId?: string;
    trackingDate?: string;
    litterLegth?: number;
    chestGirth?: number;
    weigth?: number;
    growthRate?: number;
    adg?: number;
    fcr?: number;
    note?: string;
}