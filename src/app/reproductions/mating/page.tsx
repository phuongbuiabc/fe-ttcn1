'use client';

import { useEffect } from 'react';
import { usePig } from '@/modules/pig/hooks/usePig';
import { ReproductionCycleTable } from '@/modules/reproduction/ui/ReproductionCycleTable';

export default function MatingPage() {
	const { pregnantPigs, loadingList, fetchPregnantPigs } = usePig();

	useEffect(() => {
		fetchPregnantPigs();
	}, []);

	return (
		<div className="w-full">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-slate-900">Quản lý phối giống</h1>
				<p className="text-slate-500">Danh sách lợn nái đang mang thai</p>
			</div>

			<div className="rounded-lg bg-white p-6 shadow-sm">
				<ReproductionCycleTable
					pregnantPigs={pregnantPigs}
					loading={loadingList}
					onRefresh={fetchPregnantPigs}
					onView={(pig) => {
						console.log('View:', pig);
					}}
				/>
			</div>
		</div>
	);
}
