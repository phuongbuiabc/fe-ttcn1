'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/shared/utils/utils';
import { reproductionService } from '@/modules/reproduction/api/reproduction.service';
import { ReproductionCycle } from '@/shared/enums/reproductioncycle.enum';
import type { PregnantResponse } from '@/modules/pig/model/pig.model';

type FarrowingRowState = {
	id: string;
	earTag: string;
	bornCount: string;
	deadCount: string;
	crushedCount: string;
	deformedCount: string;
	averageWeight: string;
};

type FarrowingRowError = Partial<Record<keyof Omit<FarrowingRowState, 'id' | 'earTag'>, string>>;

interface ReproductionCycleFarrowFormProps {
	open: boolean;
	selectedPigs: PregnantResponse[];
	onClose: () => void;
	onSuccess?: () => Promise<void> | void;
}

export function ReproductionCycleFarrowForm({
	open,
	selectedPigs,
	onClose,
	onSuccess,
}: ReproductionCycleFarrowFormProps) {
	const [loading, setLoading] = useState(false);
	const [commonFarrowDate, setCommonFarrowDate] = useState('');
	const [farrowingRows, setFarrowingRows] = useState<FarrowingRowState[]>([]);
	const [farrowingErrors, setFarrowingErrors] = useState<Record<string, FarrowingRowError>>({});

	const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

	useEffect(() => {
		if (!open) return;

		setCommonFarrowDate(today);
		setFarrowingRows(
			selectedPigs.map((pig) => ({
				id: pig.id,
				earTag: pig.earTag || '--',
				bornCount: '',
				deadCount: '',
				crushedCount: '',
				deformedCount: '',
				averageWeight: '',
			}))
		);
		setFarrowingErrors({});
	}, [open, selectedPigs, today]);

	if (!open) return null;

	const updateRow = (id: string, field: keyof Omit<FarrowingRowState, 'id' | 'earTag'>, value: string) => {
		setFarrowingRows((current) =>
			current.map((row) => (row.id === id ? { ...row, [field]: value } : row))
		);
		setFarrowingErrors((current) => {
			const next = { ...current };
			if (next[id]) {
				delete next[id][field];
				if (Object.keys(next[id]).length === 0) delete next[id];
			}
			return next;
		});
	};

	const validateRows = () => {
		const errors: Record<string, FarrowingRowError> = {};

		if (!commonFarrowDate) {
			return { valid: false, message: 'Vui lòng chọn ngày ghi nhận chung.', errors };
		}

		for (const row of farrowingRows) {
			const rowErrors: FarrowingRowError = {};
			const bornCount = Number(row.bornCount);
			const deadCount = Number(row.deadCount);
			const crushedCount = Number(row.crushedCount);
			const deformedCount = Number(row.deformedCount);
			const averageWeight = Number(row.averageWeight);
			const aliveCount = bornCount - deadCount - crushedCount - deformedCount;

			if (!row.bornCount || Number.isNaN(bornCount) || bornCount < 0) rowErrors.bornCount = 'Bắt buộc';
			if (!row.deadCount || Number.isNaN(deadCount) || deadCount < 0) rowErrors.deadCount = 'Bắt buộc';
			if (!row.crushedCount || Number.isNaN(crushedCount) || crushedCount < 0) rowErrors.crushedCount = 'Bắt buộc';
			if (!row.deformedCount || Number.isNaN(deformedCount) || deformedCount < 0) rowErrors.deformedCount = 'Bắt buộc';
			if (!row.averageWeight || Number.isNaN(averageWeight) || averageWeight < 0) rowErrors.averageWeight = 'Bắt buộc';

			if (!Object.keys(rowErrors).length && aliveCount < 0) {
				rowErrors.bornCount = 'Số con sinh phải lớn hơn tổng thai gỗ, dị tật và đè chết';
			}

			if (Object.keys(rowErrors).length > 0) {
				errors[row.id] = rowErrors;
			}
		}

		return {
			valid: Object.keys(errors).length === 0,
			message: Object.keys(errors).length === 0 ? '' : 'Vui lòng kiểm tra lại các dòng có lỗi.',
			errors,
		};
	};

	const handleSubmit = async () => {
		const result = validateRows();
		setFarrowingErrors(result.errors);

		if (!result.valid) {
			alert(result.message);
			return;
		}

		setLoading(true);
		try {
			await reproductionService.recordFarrowing(
				farrowingRows.map((row) => ({
					id: row.id,
					actualFarrowDate: commonFarrowDate,
					status: ReproductionCycle.FARROWED,
					bornCount: Number(row.bornCount),
					aliveCount: Number(row.bornCount) - Number(row.deadCount) - Number(row.crushedCount) - Number(row.deformedCount),
					deadCount: Number(row.deadCount),
					crushedCount: Number(row.crushedCount),
					deformedCount: Number(row.deformedCount),
					averageWeight: Number(row.averageWeight),
				}))
			);
			await onSuccess?.();
			onClose();
		} catch (error) {
			console.error(error);
			alert('Ghi nhận đẻ thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
			<div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
				<div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
					<div className="min-w-0">
						<p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Ghi nhận đẻ</p>
						<h3 className="text-lg font-extrabold text-slate-900">
							Nhập thông tin cho {farrowingRows.length} bản ghi đã chọn
						</h3>
					</div>
					<div className="flex shrink-0 items-center gap-3">
						<input
							type="date"
							value={commonFarrowDate}
							onChange={(event) => setCommonFarrowDate(event.target.value)}
							className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
						/>
						<button
							type="button"
							onClick={onClose}
							className="rounded-full px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
						>
							Đóng
						</button>
					</div>
				</div>

				<div className="max-h-[calc(90vh-72px)] overflow-auto p-5">
					<div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs text-slate-500">
						Ngày ghi nhận chung ở góc phải tiêu đề sẽ áp dụng cho toàn bộ bản ghi.
					</div>

					<div className="overflow-x-auto rounded-2xl border border-slate-100">
						<table className="min-w-[1100px] w-full border-collapse text-left text-sm">
							<thead className="sticky top-0 bg-slate-50">
								<tr>
									<th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400">Số tai</th>
									<th className="px-3 py-3 text-[10px] font-black uppercase text-slate-400">Sinh</th>
									<th className="px-3 py-3 text-[10px] font-black uppercase text-slate-400">Sống</th>
									<th className="px-3 py-3 text-[10px] font-black uppercase text-slate-400">Chết</th>
									<th className="px-3 py-3 text-[10px] font-black uppercase text-slate-400">Đè chết</th>
									<th className="px-3 py-3 text-[10px] font-black uppercase text-slate-400">Dị tật</th>
									<th className="px-3 py-3 text-[10px] font-black uppercase text-slate-400">TB kg</th>
									<th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400">Lỗi</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{farrowingRows.map((row, index) => {
									const rowErrors = farrowingErrors[row.id] || {};
										const aliveCount = Number(row.bornCount) - Number(row.deadCount) - Number(row.crushedCount) - Number(row.deformedCount);

									return (
										<tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
											<td className="px-4 py-3">
												<p className="font-bold text-slate-900">{row.earTag}</p>
												<p className="text-[10px] text-slate-400">{row.id}</p>
											</td>
												{(['bornCount'] as const).map((field) => (
													<td key={field} className="px-3 py-3">
														<input
															type="number"
															min="0"
															step="1"
															value={row[field]}
															onChange={(event) => updateRow(row.id, field, event.target.value)}
															className={cn(
																'w-full rounded-lg border px-2 py-2 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/10',
																rowErrors[field] ? 'border-rose-400' : 'border-slate-200'
															)}
														/>
													</td>
												))}
												<td className="px-3 py-3">
													<span className="inline-flex w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm font-semibold text-slate-700">
														{aliveCount < 0 ? 0 : aliveCount}
													</span>
												</td>
												{(['deadCount', 'crushedCount', 'deformedCount', 'averageWeight'] as const).map((field) => (
												<td key={field} className="px-3 py-3">
													<input
														type="number"
														min="0"
														step={field === 'averageWeight' ? '0.01' : '1'}
														value={row[field]}
														onChange={(event) => updateRow(row.id, field, event.target.value)}
														className={cn(
															'w-full rounded-lg border px-2 py-2 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/10',
															rowErrors[field] ? 'border-rose-400' : 'border-slate-200'
														)}
													/>
												</td>
											))}
											<td className="px-4 py-3 text-xs text-rose-600">
												{Object.values(rowErrors).join(' · ')}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
						>
							Hủy
						</button>
						<button
							type="button"
							disabled={loading}
							onClick={handleSubmit}
							className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
						>
							{loading ? 'Đang lưu...' : 'Lưu ghi nhận đẻ'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ReproductionCycleFarrowForm;
