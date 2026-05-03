'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePig } from '@/modules/pig/hooks/usePig';
import { PigCurrentTable } from '@/modules/pig/ui/PigCurrentTable';
import PiggrowthForm from '@/modules/pig/ui/PiggrowthForm';

export default function GrowthTrackingPage() {
	const { pigCurrent, loadingList, fetchPigCurrent } = usePig();
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		fetchPigCurrent();
	}, [fetchPigCurrent]);

	return (
		<div className="space-y-6 p-4 min-h-screen bg-[#fbfcfd]">
			{/* PIG CURRENT TABLE */}
			<section className="bg-white border rounded-xl shadow-sm overflow-hidden">
				<div className="px-4 py-3 border-b flex items-center justify-between">
					<div>
						<h1 className="text-base font-bold text-slate-800">Tình trạng tăng trưởng hiện tại</h1>
						<p className="text-xs text-slate-500">Theo dõi cân nặng, tăng trưởng và hiệu quả chuyển đổi của từng lợn.</p>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
					>
						<Plus size={16} />
						Thêm bản ghi tăng trưởng
					</button>
				</div>
				<PigCurrentTable pigs={pigCurrent} loading={loadingList} />
			</section>

			{/* GROWTH FORM MODAL */}
			{showForm && (
				<PiggrowthForm
					onClose={() => setShowForm(false)}
					onSuccess={() => {
						setShowForm(false);
						fetchPigCurrent();
					}}
				/>
			)}
		</div>
	);
}
