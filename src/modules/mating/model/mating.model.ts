import { MatingStatus } from '@/shared/enums/mating.enum';

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
    status: MatingStatus | string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMatingRequest {
    sowPigId: string;
    semenId: string;
    litterLength: number;
    matingRound: number;
    employeeId: string;
    matingDate: string;
    status: MatingStatus | string;
}

export interface UpdateMatingRequest {
    sowPigId?: string;
    semenId?: string;
    litterLength?: number;
    matingRound?: number;
    employeeId?: string;
    matingDate?: string;
    status?: string;
}

export interface PregnancyCheck {
    id: string;
    status: MatingStatus;
}

export interface PregnancyStatusUpdateRequest {
    id: string;
    status: MatingStatus;
}