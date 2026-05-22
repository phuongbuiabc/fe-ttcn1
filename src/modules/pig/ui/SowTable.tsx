'use client';

import React, { useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { cn } from '@/shared/utils/utils';
import { SowResponse } from '../model/pig.model';

interface SowTableProps {
	sows: SowResponse[];
	loading: boolean;
	selectedSowId?: string | null;
	expandedContent?: React.ReactNode;
	onView?: (sow: SowResponse) => void;
	onEdit?: (sow: SowResponse) => void;
	onDelete?: (id: string) => void;
}

export function SowTable({
	sows,
	loading,
	selectedSowId,
	expandedContent,
	onView,
}: SowTableProps) {
	const [earTagSearch, setEarTagSearch] = useState('');
	const [breedFilter, setBreedFilter] = useState('ALL');

	const breedOptions = useMemo(() => {
		return Array.from(
			new Set(
				sows
					.map((sow) => sow.species?.trim())
					.filter((species): species is string => Boolean(species))
			)
		);
	}, [sows]);

	const filteredSows = useMemo(() => {
		const normalizedEarTag = earTagSearch.trim().toLowerCase();

		return sows.filter((sow) => {
			const matchesEarTag =
				normalizedEarTag.length === 0 ||
				(sow.earTag || '').toLowerCase().includes(normalizedEarTag);
			const matchesBreed =
				breedFilter === 'ALL' || sow.species === breedFilter;

			return matchesEarTag && matchesBreed;
		});
	}, [sows, earTagSearch, breedFilter]);

	if (loading && sows.length === 0) {
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
						value={earTagSearch}
						onChange={(event) => setEarTagSearch(event.target.value)}
						placeholder="Tìm theo số tai..."
						className="w-full rounded-xl bg-slate-50 py-2 pl-9 pr-4 text-xs font-bold text-slate-700 outline-none ring-1 ring-transparent transition focus:ring-emerald-500/20"
					/>
				</div>

				<div className="relative w-full md:max-w-xs">
					<Filter
						className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
						size={14}
					/>
					<select
						value={breedFilter}
						onChange={(event) => setBreedFilter(event.target.value)}
						className="w-full appearance-none rounded-xl bg-slate-50 py-2 pl-9 pr-4 text-xs font-bold text-slate-700 outline-none ring-1 ring-transparent transition focus:ring-emerald-500/20"
					>
						<option value="ALL">Tất cả giống</option>
						{breedOptions.map((breed) => (
							<option key={breed} value={breed}>
								{breed}
							</option>
						))}
					</select>
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
								Loại
							</th>
							<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">
								Giống
							</th>
							<th className="px-6 py-3 text-center text-[9px] font-black uppercase text-slate-400">
								Số thai
							</th>
							<th className="px-6 py-3 text-center text-[9px] font-black uppercase text-slate-400">
								Sẩy thai
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-50">
						{filteredSows.map((sow) => {
							const isSelected = selectedSowId === sow.id;

							return (
								<React.Fragment key={sow.id}>
									<tr
										className={cn(
											'cursor-pointer bg-white transition-all hover:bg-slate-50',
											isSelected && 'bg-emerald-50/30'
										)}
										onClick={() => onView?.(sow)}
									>
										<td className="px-6 py-3">
											<p className="text-[13px] font-black text-slate-900">
												{sow.earTag || '--'}
											</p>
										</td>

										<td className="px-6 py-3">
											<span className="text-xs font-bold text-slate-700">
												{sow.type}
											</span>
										</td>

										<td className="px-6 py-3">
											<span className="text-xs text-slate-700">
												{sow.breedName || '--'}
											</span>
										</td>

										<td className="px-6 py-3 text-center">
											<span className="text-sm font-bold text-slate-900">
												{sow.totalPregnancies}
											</span>
										</td>

										<td className="px-6 py-3 text-center">
											<span className="text-sm font-bold text-slate-900">
												{sow.miscarriageCount}
											</span>
										</td>
									</tr>

									{isSelected && expandedContent && (
										<tr className="bg-white">
											<td colSpan={5} className="px-4 py-4">
												{expandedContent}
											</td>
										</tr>
									)}
								</React.Fragment>
							);
						})}

						{filteredSows.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className="px-6 py-12 text-center text-xs font-bold text-slate-400"
								>
									Không có lợn nái phù hợp với bộ lọc.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
