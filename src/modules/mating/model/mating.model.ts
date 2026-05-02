export interface MatingResponse {
    id: string;
    sowPigId: string;
    sowPigEarTag: string;
    sowBreed: string;
    semenId: string;
    boarBreed: string;
    litterLength: number;
    matingRound: number;
    employeeId: string;
    matingDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMatingRequest {
    sowPigId: string;
    semenId: string;
    boarBreed: string;
    litterLength: number;
    matingRound: number;
    employeeId: string;
    matingDate: string;
    status: string;
}

export interface UpdateMatingRequest {
    sowPigId?: string;
    semenId?: string;
    boarBreed?: string;
    litterLength?: number;
    matingRound?: number;
    employeeId?: string;
    matingDate?: string;
    status?: string;
}