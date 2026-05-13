'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/shared/utils/utils';
import { DiseaseHistoryResponse } from '../model/diseasehistory.model';
import { DiseaseHistoryStatus } from '@/shared/enums/diseasehistory.enum';
import { mapDiseaseHistoryStatus } from '@/modules/diseasehistory/utils/DiseaseHistory.mapper';

interface DiseaseHistoryTableProps {
	diseaseHistories: DiseaseHistoryResponse[];
	loading: boolean;
	onView?: (history: DiseaseHistoryResponse) => void;
	onEdit?: (history: DiseaseHistoryResponse) => void;
	onDelete?: (id: string) => void;
}

const formatDate = (value?: string) => {
	if (!value) return '--';
	return new Date(value).toLocaleDateString('vi-VN');
};

export function DiseaseHistoryTable({
	diseaseHistories,
	loading,
	onView,
	onEdit,
	onDelete,
}: DiseaseHistoryTableProps) {
	const [diseaseSearch, setDiseaseSearch] = useState('');
	const [earTagSearch, setEarTagSearch] = useState('');

	const filteredHistories = useMemo(() => {
		const normalizedDiseaseSearch = diseaseSearch.trim().toLowerCase();
		const normalizedEarTagSearch = earTagSearch.trim().toLowerCase();

		return diseaseHistories.filter((history) => {
			const matchesDiseaseName =
				normalizedDiseaseSearch.length === 0 ||
				(history.diseaseName || '').toLowerCase().includes(normalizedDiseaseSearch);
			const matchesEarTag =
				normalizedEarTagSearch.length === 0 ||
				(history.pigEarTag || '').toLowerCase().includes(normalizedEarTagSearch);

			return matchesDiseaseName && matchesEarTag;
		});
	}, [diseaseHistories, diseaseSearch, earTagSearch]);

	const hasActions = Boolean(onView || onEdit || onDelete);

	if (loading && diseaseHistories.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
			</div>
		);
	}

	return (
		<div>
			<div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
				<div className="relative w-full md:max-w-xs">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						size={14}
					/>
					<input
						type="text"
						value={diseaseSearch}
						onChange={(event) => setDiseaseSearch(event.target.value)}
						placeholder="Tìm theo tên bệnh..."
						className="w-full rounded-xl bg-slate-50 py-2 pl-9 pr-4 text-xs font-bold text-slate-700 outline-none ring-1 ring-transparent transition focus:ring-emerald-500/20"
					/>
				</div>

				<div className="relative w-full md:max-w-xs">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						size={14}
					/>
					<input
						type="text"
						value={earTagSearch}
						onChange={(event) => setEarTagSearch(event.target.value)}
						placeholder="Tìm theo số tai..."
						className="w-full rounded-xl bg-slate-50 py-2 pl-9 pr-4 text-xs font-bold text-slate-700 outline-none ring-1 ring-transparent transition focus:ring-emerald-500/20"
					/>
				</div>
			</div>

			<div className="responsive-table">
				<table className="w-full border-collapse text-left">
					<thead className="bg-slate-50/50">
						<tr>
							<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
								Số tai
							</th>
							<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
								Tên bệnh
							</th>
							<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
								Mức độ
							</th>
							<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
								Ngày mắc bệnh
							</th>
							<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
								Ngày hồi phục
							</th>
							<th className="px-6 py-3 text-center text-[9px] font-black uppercase text-slate-400">
								Trạng thái
							</th>
							{hasActions && (
								<th className="px-6 py-3 text-right text-[9px] font-black uppercase text-slate-400">
									Thao tác
								</th>
							)}
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-50">
						{filteredHistories.map((history) => (
							<tr
								key={history.id}
								className={cn(
									'bg-white transition-all hover:bg-slate-50',
									onView && 'cursor-pointer'
								)}
								onClick={() => onView?.(history)}
							>
								<td className="px-6 py-3">
									<p className="text-[13px] font-black text-slate-900">
										{history.pigEarTag || '--'}
									</p>
								</td>

								<td className="px-6 py-3">
									<span className="text-xs font-bold text-slate-700">
										{history.diseaseName || '--'}
									</span>
								</td>

								<td className="px-6 py-3">
									<span className="text-xs text-slate-700">
										{history.severity || '--'}
									</span>
								</td>

								<td className="px-6 py-3 text-xs text-slate-700">
									{formatDate(history.sickDate)}
								</td>

								<td className="px-6 py-3 text-xs text-slate-700">
									{formatDate(history.recoveryDate)}
								</td>

								<td className="px-6 py-3 text-center">
									<span
										className={cn(
											'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase',
											history.status === 'ACTIVE'
												? 'bg-emerald-50 text-emerald-600'
												: history.status === 'RECOVERED'
												? 'bg-blue-50 text-blue-600'
												: 'bg-slate-100 text-slate-500'
										)}
									>
										{mapDiseaseHistoryStatus(history.status as DiseaseHistoryStatus)}
									</span>
								</td>

								{hasActions && (
									<td className="px-6 py-3 text-right">
										<div className="flex justify-end gap-2">
											{onEdit && (
												<button
													onClick={(event) => {
														event.stopPropagation();
														onEdit(history);
													}}
													className="text-xs font-bold text-blue-600"
												>
													Sửa
												</button>
											)}

											{onDelete && (
												<button
													onClick={(event) => {
														event.stopPropagation();
														onDelete(history.id);
													}}
													className="text-xs font-bold text-red-600"
												>
													Xóa
												</button>
											)}
										</div>
									</td>
								)}
							</tr>
						))}

						{filteredHistories.length === 0 && (
							<tr>
								<td
									colSpan={hasActions ? 7 : 6}
									className="px-6 py-12 text-center text-xs font-bold text-slate-400"
								>
									Không có hồ sơ bệnh phù hợp
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
