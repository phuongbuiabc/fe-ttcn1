import { useState, useCallback } from 'react';
import { feedrationService } from '@/modules/feedration/api/feedration.service';
import { tokenStorage } from '@/modules/auth/utils/tokenStorage';
import {
    feedrationResponse,
    FeedPigletHerdRequest,
    FeedPenRequest
 } from '@/modules/feedration/model/feedration.model';

export function useFeedRation() {
    const [feedRations, setFeedRations] = useState<feedrationResponse[]>([]);

    const [loadingFeedRations, setLoadingFeedRations] = useState(false);

    const feedPigletHerd = useCallback(async (data: FeedPigletHerdRequest) => {
        try {
            await feedrationService.feedPigletHerd(data);
            await fetchFeedRationsByDate(data.feedingDate);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const feedPen = useCallback(async (data: FeedPenRequest) => {
        try {
            await feedrationService.feedPen(data);
            await fetchFeedRationsByDate(data.feedingDate);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fetchFeedRationsByDate = useCallback(async (date: string) => {
        if (!tokenStorage.getAccessToken()) {
            setFeedRations([]);
            return;
        }

        setLoadingFeedRations(true);
        try {
            const res = await feedrationService.getFeedRationsByDate(date);
            if (res.success) {
                setFeedRations(res.data || []);
            }
        } finally {
            setLoadingFeedRations(false);
        }
    }, []);

    return {
        feedRations,
        loadingFeedRations,
        feedPigletHerd,
        feedPen,
        fetchFeedRationsByDate
    };
}