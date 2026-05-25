'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/shared/utils/utils';
import { reproductionService } from '@/modules/reproduction/api/reproduction.service';
import { ReproductionCycle } from '@/shared/enums/reproductioncycle.enum';
import type { PregnantResponse } from '@/modules/pig/model/pig.model';
import { ReproductionCycleFarrowForm } from './reproductionCycleFarrowForm';

interface ReproductionCycleTableProps {
	pregnantPigs: PregnantResponse[];
	loading: boolean;
	onView?: (pig: PregnantResponse) => void;
	onEdit?: (pig: PregnantResponse) => void;
	onDelete?: (id: string) => void;
	onRefresh?: () => Promise<void> | void;
}

export function ReproductionCycleTable({
	pregnantPigs,
	loading,
	onView,
	onRefresh,
}: ReproductionCycleTableProps) {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [miscarriageLoading, setMiscarriageLoading] = useState(false);
	const [farrowingOpen, setFarrowingOpen] = useState(false);

	const selectedPigs = useMemo(
		() => pregnantPigs.filter((pig) => selectedIds.includes(pig.id)),
		[pregnantPigs, selectedIds]
	);
	const allSelected = pregnantPigs.length > 0 && selectedIds.length === pregnantPigs.length;

	useEffect(() => {
		setSelectedIds((current) => current.filter((id) => pregnantPigs.some((pig) => pig.id === id)));
	}, [pregnantPigs]);

	if (loading && pregnantPigs.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
			</div>
		);
	}

	if (!loading && pregnantPigs.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<p className="text-slate-400">Không có lợn nái đang mang thai</p>
			</div>
		);
	}

	const formatDate = (date: string) => {
		if (!date) return '--';
		return new Date(date).toLocaleDateString('vi-VN');
	};

	const toggleOne = (id: string) => {
		setSelectedIds((current) =>
			current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
		);
	};

	const toggleAll = (checked: boolean) => {
		setSelectedIds(checked ? pregnantPigs.map((pig) => pig.id) : []);
	};

	const handleMiscarriage = async () => {
		if (selectedIds.length === 0) return;
		if (!confirm(`Xác nhận ghi nhận sẩy thai cho ${selectedIds.length} bản ghi?`)) return;

		setMiscarriageLoading(true);
		try {
			await reproductionService.recordMiscarriage(
				selectedIds.map((id) => ({ id, status: ReproductionCycle.MISCARRIED }))
			);
			setSelectedIds([]);
			await onRefresh?.();
		} catch (error) {
			console.error(error);
			alert('Ghi nhận sẩy thai thất bại');
		} finally {
			setMiscarriageLoading(false);
		}
	};

	return (
		<>
			<div className="flex h-[72vh] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
				<div className="flex-1 overflow-auto">
					<table className="w-full border-collapse text-left">
						<thead className="bg-slate-50/50">
							<tr>
								<th className="w-12 px-4 py-3 text-center">
									<input
										type="checkbox"
										checked={allSelected}
										onChange={(event) => toggleAll(event.target.checked)}
										className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
									/>
								</th>
								<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">Số tai</th>
								<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">Ngày phối</th>
								<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">Ngày có thai</th>
								<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400">Ngày dự sinh</th>
								<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">Lần có thai</th>
								<th className="px-6 py-3 text-[9px] font-black uppercase text-slate-400 text-center">Trạng thái</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-50">
							{pregnantPigs.map((pig) => {
								const isSelected = selectedIds.includes(pig.id);

								return (
									<tr
										key={pig.id}
										className={cn(
											'bg-white transition-all hover:bg-slate-50',
											isSelected && 'bg-emerald-50/60'
										)}
										onClick={() => onView?.(pig)}
									>
										<td className="px-4 py-3 text-center">
											<input
												type="checkbox"
												checked={isSelected}
												onClick={(event) => event.stopPropagation()}
												onChange={() => toggleOne(pig.id)}
												className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
											/>
										</td>
										<td className="px-6 py-3">
											<p className="text-[13px] font-black text-slate-900">{pig.earTag || '--'}</p>
											<p className="text-[10px] text-slate-400">ID: {pig.id}</p>
										</td>
										<td className="px-6 py-3">
											<span className="text-sm text-slate-700">{formatDate(pig.matingDate)}</span>
										</td>
										<td className="px-6 py-3">
											<span className="text-sm text-slate-700">{formatDate(pig.conceptionDate)}</span>
										</td>
										<td className="px-6 py-3">
											<span className="text-sm font-bold text-emerald-600">{formatDate(pig.expectedFarrowDate)}</span>
										</td>
										<td className="px-6 py-3 text-center">
											<span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-900">
												{pig.prenancyNumber}
											</span>
										</td>
										<td className="px-6 py-3 text-center">
											<span
												className={cn(
													'inline-block rounded px-2 py-1 text-xs font-bold',
													pig.status === 'active'
														? 'bg-green-100 text-green-700'
														: pig.status === 'inactive'
														? 'bg-red-100 text-red-700'
														: 'bg-yellow-100 text-yellow-700'
												)}
											>
												{pig.status}
											</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="text-sm font-semibold text-slate-600">
							Đã chọn <span className="text-slate-900">{selectedPigs.length}</span>/{pregnantPigs.length} dòng
						</div>

						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								disabled={selectedIds.length === 0 || miscarriageLoading}
								onClick={() => setFarrowingOpen(true)}
								className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
							>
								Đã đẻ
							</button>
							<button
								type="button"
								disabled={selectedIds.length === 0 || miscarriageLoading}
								onClick={handleMiscarriage}
								className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
							>
								{miscarriageLoading ? 'Đang xử lý...' : 'Sẩy'}
							</button>
						</div>
					</div>
				</div>
			</div>

			<ReproductionCycleFarrowForm
				open={farrowingOpen}
				selectedPigs={selectedPigs}
				onClose={() => setFarrowingOpen(false)}
				onSuccess={onRefresh}
			/>
		</>
	);
}

export default ReproductionCycleTable;
