export interface SemenResponse {
    id: string;
    boarPigId: string;
    boarPigEarTag: string;
    boarBreed: string;
    collectionDate: string;
    volume: number;
    motility: number;
    quality: string;
    status: string;
    note: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSemenRequest {
    boarPigId: string;
    collectionDate: string;
    volume: number;
    motility: number;
    quality: string;
    status: string;
    note: string;
}

export interface UpdateSemenRequest {
    boarPigId?: string;
    collectionDate?: string;
    volume?: number;
    motility?: number;
    quality?: string;
    status?: string;
    note?: string;
}