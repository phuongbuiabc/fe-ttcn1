'use client';

import React, { useEffect, useState } from 'react';
import { Plus, PawPrint, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { usePig } from '@/modules/pig/hooks/usePig';
import { PigCurrentTable } from '@/modules/pig/ui/PigCurrentTable';
import PiggrowthForm from '@/modules/growth/ui/PiggrowthForm';
import { usePigletHerd } from '@/modules/pigletherds/hooks/usePigletherd';
import { PigletHerdResponse } from '@/modules/pigletherds/model/pigletherd.model';
import { PigletHerdGrowthForm } from '@/modules/pigletherds/ui/PigletherdgrowthForm';
import { getPageTitle } from '@/shared/utils/getPageTitle';
import { cn } from '@/shared/utils/utils';

type ActiveTab = 'pig' | 'herd';

export default function GrowthTrackingPage() {
	const { pigCurrent, loadingList, fetchPigCurrent } = usePig();
	const { herds, loading: loadingHerds, fetchHerds } = usePigletHerd();

	const [showPigForm, setShowPigForm] = useState(false);
	const [showHerdForm, setShowHerdForm] = useState(false);
	const [activeTab, setActiveTab] = useState<ActiveTab>('pig');
	const pathname = usePathname();
	const title = getPageTitle(pathname);

	useEffect(() => {
		fetchPigCurrent();
		fetchHerds();
	}, [fetchPigCurrent, fetchHerds]);

	return (
		<div className="space-y-4 pb-20 bg-[#fbfcfd] min-h-screen -m-4 p-4">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-lg font-extrabold uppercase text-slate-800 tracking-tight">{title || 'Theo dõi tăng trưởng'}</h1>
					<p className="text-xs text-slate-500">
						{activeTab === 'pig'
							? 'Theo dõi cân nặng, tăng trưởng và hiệu quả chuyển đổi của từng lợn.'
							: 'Theo dõi tăng trưởng của đàn con theo từng thời điểm.'}
					</p>
				</div>

				<button
					onClick={() => (activeTab === 'pig' ? setShowPigForm(true) : setShowHerdForm(true))}
					className="px-5 py-2 bg-emerald-600 text-white rounded-full flex items-center gap-2 text-sm font-semibold"
				>
					<Plus size={14} />
					Thêm bản ghi tăng trưởng
				</button>
			</div>

			<div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm inline-flex gap-2">
				<button
					onClick={() => setActiveTab('pig')}
					className={cn(
						'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2',
						activeTab === 'pig' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'
					)}
				>
					<PawPrint size={14} /> Lợn
				</button>
				<button
					onClick={() => setActiveTab('herd')}
					className={cn(
						'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2',
						activeTab === 'herd' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
					)}
				>
					<Users size={14} /> Đàn con
				</button>
			</div>

			<section className="overflow-hidden rounded-xl bg-white">

				{activeTab === 'pig' ? (
					<PigCurrentTable
						pigs={pigCurrent}
						loading={loadingList}
					/>
				) : (
					<PigletHerdGrowthTable data={herds} loading={loadingHerds} />
				)}

			</section>

			{showPigForm && (
				<PiggrowthForm
					onClose={() => setShowPigForm(false)}
					onSuccess={() => {
						setShowPigForm(false);
						fetchPigCurrent();
					}}
				/>
			)}

			{showHerdForm && (
				<PigletHerdGrowthForm
					onClose={() => setShowHerdForm(false)}
					onSuccess={() => {
						setShowHerdForm(false);
						fetchHerds();
					}}
				/>
			)}

		</div>
	);
}

function PigletHerdGrowthTable({
	data,
	loading,
}: {
	data: PigletHerdResponse[];
	loading?: boolean;
}) {
	if (loading && data.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
			</div>
		);
	}

	return (
		<div className="flex h-[72vh] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white">
			<div className="flex-1 overflow-auto">
				<table className="w-full border-separate border-spacing-0 text-left [&_th]:border-0 [&_td]:border-0">
					<thead className="sticky top-0 z-10 bg-slate-50">
						<tr>
							<th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Tên đàn</th>
							<th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Lứa</th>
							<th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Số lượng</th>
							<th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Cân nặng TB (kg)</th>
							<th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Ngày sinh</th>
							<th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Trạng thái</th>
						</tr>
					</thead>

					<tbody>
						{data.length === 0 ? (
							<tr>
								<td colSpan={6} className="py-10 text-center text-slate-500">Không có dữ liệu</td>
							</tr>
						) : (
							data.map((herd) => (
								<tr key={herd.id} className="transition hover:bg-slate-50">
									<td className="px-6 py-4 text-sm font-bold text-slate-900">{herd.herdName || '--'}</td>
									<td className="px-6 py-4 text-sm text-slate-700">{herd.litterNumber ?? '--'}</td>
									<td className="px-6 py-4 text-sm text-slate-700">{herd.quantity ?? '--'}</td>
									<td className="px-6 py-4 text-sm text-slate-700">{herd.averageBirthWeight ?? '--'}</td>
									<td className="px-6 py-4 text-sm text-slate-700">{herd.birthDate ? new Date(herd.birthDate).toLocaleDateString('vi-VN') : '--'}</td>
									<td className="px-6 py-4 text-sm text-slate-700">{herd.status || '--'}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

