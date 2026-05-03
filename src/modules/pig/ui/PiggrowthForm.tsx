'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { usePig } from '@/modules/pig/hooks/usePig';
import { PigResponse } from '@/modules/pig/model/pig.model';
import { usePiggrowth } from '@/modules/pig/hooks/usePiggrowth';
import { CreateGrowthTrackingRequest } from '@/modules/growth/model/growthtracking.model';

type RowDraft = {
	rowId: string;
	pigId: string;
	earTagInput: string;
	litterLength: string;
	chestGirth: string;
	weight: string;
	note: string;
};

const getToday = () => new Date().toISOString().slice(0, 10);

const toNumberOrUndefined = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) return undefined;
	const num = Number(trimmed);
	return Number.isNaN(num) ? undefined : num;
};

const isNotNull = <T,>(value: T | null): value is T => value !== null;

const createEmptyRow = (): RowDraft => ({
	rowId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
	pigId: '',
	earTagInput: '',
	litterLength: '',
	chestGirth: '',
	weight: '',
	note: '',
});

interface PiggrowthFormProps {
	onClose?: () => void;
	onSuccess?: () => void;
}

export default function PiggrowthForm({ onClose, onSuccess }: PiggrowthFormProps = {}) {
	const { pigs, fetchPigs, loadingList } = usePig();
	const { createGrowth, loading } = usePiggrowth();
	const isModal = typeof onClose === 'function';

	const [trackingDate, setTrackingDate] = useState<string>(getToday());
	const [rows, setRows] = useState<RowDraft[]>([createEmptyRow()]);
	const [activeSuggestionRowId, setActiveSuggestionRowId] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		fetchPigs();
	}, [fetchPigs]);

	const pigById = useMemo(() => {
		return pigs.reduce<Record<string, PigResponse>>((acc, pig) => {
			acc[pig.id] = pig;
			return acc;
		}, {});
	}, [pigs]);

	const handleChangeCell = (rowId: string, field: 'litterLength' | 'chestGirth' | 'weight' | 'note', value: string) => {
		setRows((prev) =>
			prev.map((row) =>
				row.rowId === rowId
					? {
						...row,
						[field]: value,
					}
					: row
			)
		);
	};

	const handleEarTagInputChange = (rowId: string, value: string) => {
		const normalizedInput = value.trim().toLowerCase();
		setRows((prev) =>
			prev.map((row) => {
				if (row.rowId !== rowId) return row;

				if (!normalizedInput) {
					return {
						...row,
						earTagInput: value,
						pigId: '',
					};
				}

				const matchedPig = pigs.find(
					(pig) => (pig.earTag || '').trim().toLowerCase() === normalizedInput
				);

				return {
					...row,
					earTagInput: value,
					pigId: matchedPig?.id || '',
				};
			})
		);
	};

	const getSuggestions = (keyword: string) => {
		const normalized = keyword.trim().toLowerCase();
		const source = pigs.filter((pig) => !!pig.earTag?.trim());
		if (!normalized) return source.slice(0, 8);
		return source
			.filter((pig) => (pig.earTag || '').toLowerCase().includes(normalized))
			.slice(0, 8);
	};

	const handleSelectPig = (rowId: string, pig: PigResponse) => {
		setRows((prev) =>
			prev.map((row) =>
				row.rowId === rowId
					? {
						...row,
						pigId: pig.id,
						earTagInput: pig.earTag || '',
					}
					: row
			)
		);
		setActiveSuggestionRowId(null);
	};

	const handleAddRow = () => {
		setRows((prev) => [...prev, createEmptyRow()]);
	};

	const handleCancel = () => {
		const confirmed = window.confirm('Bạn có chắc muốn hủy? Mọi thay đổi chưa lưu sẽ bị mất.');
		if (!confirmed) return;

		if (isModal) {
			onClose?.();
		} else {
			setRows([createEmptyRow()]);
			setTrackingDate(getToday());
		}
	};

	const handleDeleteRow = (rowId: string) => {
		setRows((prev) => {
			if (prev.length <= 1) return prev;
			return prev.filter((row) => row.rowId !== rowId);
		});
	};

	const handleConfirm = async () => {
		const payloads = rows
			.map((row) => {
				if (!row.pigId) return null;

				const litterLegthVal = toNumberOrUndefined(row.litterLength);
				const chestGirthVal = toNumberOrUndefined(row.chestGirth);
				const weigthVal = toNumberOrUndefined(row.weight);

				if (
					litterLegthVal === undefined &&
					chestGirthVal === undefined &&
					weigthVal === undefined &&
					!row.note.trim()
				) {
					return null;
				}

				const payload: CreateGrowthTrackingRequest = {
					pigId: row.pigId,
					trackingDate,
					litterLegth: litterLegthVal ?? 0,
					chestGirth: chestGirthVal ?? 0,
					weigth: weigthVal ?? 0,
					growthRate: 0,
					adg: 0,
					fcr: 0,
					note: row.note.trim() || '',
				};

				return payload;
			})
			.filter(isNotNull);

		if (payloads.length === 0) {
			alert('Chưa có dữ liệu hợp lệ để lưu. Vui lòng chọn lợn và nhập ít nhất 1 chỉ số.');
			return;
		}

		if (!window.confirm(`Bạn có chắc muốn lưu ${payloads.length} bản ghi tăng trưởng?`)) {
			return;
		}

		setSubmitting(true);
		try {
			await Promise.all(payloads.map((item) => createGrowth(item)));
			alert(`Đã lưu ${payloads.length} bản ghi tăng trưởng thành công.`);
			onSuccess?.();
			if (!isModal) {
				setRows([createEmptyRow()]);
			}
		} catch {
			alert('Có lỗi khi lưu dữ liệu tăng trưởng. Vui lòng thử lại.');
		} finally {
			setSubmitting(false);
		}
	};

	const content = (
		<>
			<div className="flex flex-wrap items-end justify-between gap-3 bg-white border rounded-xl p-3">
				<div className="min-w-[220px]">
					<p className="text-xs font-semibold text-slate-500 mb-1">Ngày đo chung</p>
					<input
						type="date"
						value={trackingDate}
						onChange={(e) => setTrackingDate(e.target.value)}
						className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
					/>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={handleAddRow}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-60"
					>
						+ Thêm dòng
					</button>
					<button
						onClick={handleConfirm}
						disabled={submitting || loading}
						className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold disabled:opacity-60"
					>
						{submitting ? 'Đang lưu...' : 'Xác nhận'}
					</button>
				</div>
			</div>

			<div className="bg-white border rounded-xl shadow-sm overflow-hidden">
				<div className="px-4 py-3 border-b">
					<h2 className="font-bold text-slate-800">Bảng nhập tăng trưởng</h2>
					<p className="text-xs text-slate-500">
						Nhập theo dạng bảng, mỗi dòng là một bản ghi của lợn.
					</p>
				</div>

			<div className="overflow-x-auto overflow-y-visible">
					<table className="w-full min-w-[1200px] text-sm">
						<thead className="bg-slate-50 text-xs uppercase text-slate-500">
							<tr>
								<th className="p-3 text-left">STT</th>
								<th className="p-3 text-left">Số tai</th>
								<th className="p-3 text-left">Mã lợn</th>
								<th className="p-3 text-left">Giống</th>
								<th className="p-3 text-left">Dài lưng (cm)</th>
								<th className="p-3 text-left">Vòng ngực (cm)</th>
								<th className="p-3 text-left">Cân nặng (kg)</th>
								<th className="p-3 text-left">Ghi chú</th>
								<th className="p-3 text-center">Xóa</th>
							</tr>
						</thead>

						<tbody>
							{rows.map((row, index) => {
								const selectedPig = row.pigId ? pigById[row.pigId] : undefined;
								const suggestions = getSuggestions(row.earTagInput);

								return (
									<tr key={row.rowId} className="border-t">
										<td className="p-2">{index + 1}</td>
										<td className="p-2 min-w-[240px]">
											<div className="relative">
												<input
													type="text"
													placeholder="Gõ số tai để chọn"
													value={row.earTagInput}
													onFocus={() => setActiveSuggestionRowId(row.rowId)}
													onBlur={() => {
														setTimeout(() => setActiveSuggestionRowId(null), 120);
													}}
													onChange={(e) => {
														setActiveSuggestionRowId(row.rowId);
														handleEarTagInputChange(row.rowId, e.target.value);
													}}
													className="w-full border rounded px-2 py-1 bg-white"
												/>
												{activeSuggestionRowId === row.rowId && suggestions.length > 0 && (
													<div className="absolute z-50 mt-1 w-full max-h-48 overflow-auto rounded-md border bg-white shadow-lg">
														{suggestions.map((pig) => (
															<button
																type="button"
																key={pig.id}
																onMouseDown={(e) => {
																	e.preventDefault();
																	handleSelectPig(row.rowId, pig);
																}}
																className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50"
															>
																{pig.earTag} - {pig.pigCode}
															</button>
														))}
													</div>
												)}
											</div>
										</td>
										<td className="p-2 font-semibold">{selectedPig?.pigCode || '-'}</td>
										<td className="p-2">{selectedPig?.species || '-'}</td>
										<td className="p-2">
											<input
												type="number"
												placeholder="Nhập"
												value={row.litterLength}
												onChange={(e) =>
													handleChangeCell(row.rowId, 'litterLength', e.target.value)
												}
												className="w-full border rounded px-2 py-1"
											/>
										</td>
										<td className="p-2">
											<input
												type="number"
												placeholder="Nhập"
												value={row.chestGirth}
												onChange={(e) =>
													handleChangeCell(row.rowId, 'chestGirth', e.target.value)
												}
												className="w-full border rounded px-2 py-1"
											/>
										</td>
										<td className="p-2">
											<input
												type="number"
												placeholder="Nhập"
												value={row.weight}
												onChange={(e) =>
													handleChangeCell(row.rowId, 'weight', e.target.value)
												}
												className="w-full border rounded px-2 py-1"
											/>
										</td>
										<td className="p-2">
											<input
												type="text"
												placeholder="Ghi chú"
												value={row.note}
												onChange={(e) =>
													handleChangeCell(row.rowId, 'note', e.target.value)
												}
												className="w-full border rounded px-2 py-1"
											/>
										</td>
										<td className="p-2 text-center">
											<button
												onClick={() => handleDeleteRow(row.rowId)}
												disabled={rows.length === 1}
												className="px-2 py-1 border rounded text-xs disabled:opacity-40"
											>
												X
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				{loadingList && (
					<p className="px-4 py-2 text-xs text-slate-500 border-t">
						Đang tải danh sách lợn...
					</p>
				)}
				<div className="flex items-center gap-2">
					<button
						onClick={handleCancel}
						disabled={submitting || loading}
						className="px-4 py-2 bg-gray-200 text-slate-700 rounded-lg text-sm font-semibold disabled:opacity-60"
					>
						Hủy
					</button>
				</div>
			</div>
		</>
	);

	if (isModal) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
				<div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
					<div className="px-6 py-4 border-b flex items-center justify-between">
						<div>
							<h2 className="font-bold text-lg text-slate-900">Thêm bản ghi tăng trưởng</h2>
							<p className="text-xs text-slate-500 mt-1">Nhập theo dạng bảng, mỗi dòng là một bản ghi của lợn.</p>
						</div>
						<button
							onClick={handleCancel}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						>
							<X size={20} className="text-slate-500" />
						</button>
					</div>
					<div className="flex-1 overflow-auto p-4 bg-[#fbfcfd]">
						{content}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 p-4 min-h-screen bg-[#fbfcfd]">
			{content}
		</div>
	);
}
