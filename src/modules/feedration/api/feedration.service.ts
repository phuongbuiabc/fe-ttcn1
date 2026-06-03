import { FeedPigletHerdRequest, FeedPenRequest, feedrationResponse } from '@/modules/feedration/model/feedration.model';
import { apiClient } from '@/shared/api/api-client';
import { ApiResponse } from '@/shared/types';

const BASE_URL = '/api/v1/feed-ration';

export const feedrationService = {
    feedPigletHerd: (data: FeedPigletHerdRequest) =>
        apiClient.post<ApiResponse<feedrationResponse>>(`${BASE_URL}/feed-piglet-herd`, data),

    feedPen: (data: FeedPenRequest) =>
        apiClient.post<ApiResponse<feedrationResponse>>(`${BASE_URL}/feed-pen`, data),

    getFeedRationsByDate: (date: string) =>
        apiClient.get<ApiResponse<feedrationResponse[]>>(`${BASE_URL}/by-date`, { params: { date } })
};