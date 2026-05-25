'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePig } from '@/modules/pig/hooks/usePig';
import { PigCurrentTable } from '@/modules/pig/ui/PigCurrentTable';
import PiggrowthForm from '@/modules/growth/ui/PiggrowthForm';

export default function GrowthTrackingPage() {
	const { pigCurrent, loadingList, fetchPigCurrent } = usePig();
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		fetchPigCurrent();
	}, [fetchPigCurrent]);

	return (
		<div className="min-h-screen space-y-6 bg-[#fbfcfd] p-4">

			<section className="overflow-hidden rounded-xl bg-white">

				<div className="flex items-center justify-between px-4 py-3">

					<div>
						<h1 className="text-base font-bold text-slate-800">
							Tình trạng tăng trưởng hiện tại
						</h1>

						<p className="text-xs text-slate-500">
							Theo dõi cân nặng, tăng trưởng và hiệu quả chuyển đổi của từng lợn.
						</p>
					</div>

					<button
						onClick={() => setShowForm(true)}
						className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
					>
						<Plus size={16} />
						Thêm bản ghi tăng trưởng
					</button>

				</div>

				<PigCurrentTable
					pigs={pigCurrent}
					loading={loadingList}
				/>

			</section>

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