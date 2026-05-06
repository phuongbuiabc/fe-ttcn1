import { useCallback, useState } from 'react';
import { growthTrackingService } from '../api/growthtracking.service';
import {
	CreateGrowthTrackingRequest,
	GrowthTrackingResponse,
	UpdateGrowthTrackingRequest,
} from '../model/growthtracking.model';

export function useGrowthtracking() {
	const [growthTrackings, setGrowthTrackings] = useState<GrowthTrackingResponse[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchGrowthTrackings = useCallback(async () => {
		setLoading(true);
		try {
			const res = await growthTrackingService.getAll();
			setGrowthTrackings(res.data || []);
		} finally {
			setLoading(false);
		}
	}, []);

	const createGrowth = async (data: CreateGrowthTrackingRequest) => {
		const res = await growthTrackingService.create(data);
		await fetchGrowthTrackings();
		return res;
	};

	const updateGrowth = async (id: string, data: UpdateGrowthTrackingRequest) => {
		const res = await growthTrackingService.update(id, data);
		await fetchGrowthTrackings();
		return res;
	};

	const deleteGrowth = async (id: string) => {
		const res = await growthTrackingService.delete(id);
		await fetchGrowthTrackings();
		return res;
	};

	return {
		growthTrackings,
		loading,
		fetchGrowthTrackings,
		createGrowth,
		updateGrowth,
		deleteGrowth,
	};
}
