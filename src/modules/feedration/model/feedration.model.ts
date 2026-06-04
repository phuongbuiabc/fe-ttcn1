export interface feedrationResponse {
    id: string;
    penid: string;
    rationDate: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
}

export interface FeedPigletHerdRequest {
    herdId: string;
    feedId: string;
    feedAmount: number;
    feedingDate: string;
    note?: string;
}

export interface FeedPenRequest {
    penId: string;
    feedId: string;
    feedAmout: number;
    feedingDate: string;
    note?: string;
}