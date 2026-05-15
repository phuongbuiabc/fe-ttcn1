'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { semenService } from '@/modules/semen/api/semen.service';
import { CreateSemenRequest } from '@/modules/semen/model/semen.model';
import { usePig } from '@/modules/pig/hooks/usePig';
import { PigResponse } from '@/modules/pig/model/pig.model';
import { PigType } from '@/shared/enums/pig.enum';

interface SemenRow {
	id: string;
	boarPigId: string;
	earTagInput: string;
	boarPigEarTag: string;
	collectionDate: string;
	volume: number;
	motility: number;
	quality: string;
	note: string;
}

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const createEmptyRow = (): SemenRow => ({
	id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
	boarPigId: '',
	earTagInput: '',
	boarPigEarTag: '',
	collectionDate: new Date().toISOString().split('T')[0],
	volume: 0,
	motility: 0,
	quality: '',
	note: '',
});

export const SemenForm: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
	const { pigs, fetchPigs, loadingList } = usePig();
	const [rows, setRows] = useState<SemenRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [activeSuggestionRowId, setActiveSuggestionRowId] = useState<string | null>(null);
	const [suggestionPos, setSuggestionPos] = useState<{ top: number; left: number; width: number } | null>(null);

	useEffect(() => {
		fetchPigs();
	}, [fetchPigs]);

	useEffect(() => {
		if (isOpen) {
			setRows([createEmptyRow()]);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const getSuggestions = (keyword: string) => {
		const normalized = keyword.trim().toLowerCase();
		const source = pigs.filter((pig) => !!pig.earTag?.trim() && pig.type === PigType.NOC);
		if (!normalized) return source.slice(0, 8);
		return source
			.filter((pig) => (pig.earTag || '').toLowerCase().includes(normalized))
			.slice(0, 8);
	};

	const handleEarTagInputChange = (id: string, value: string) => {
		const normalizedInput = value.trim().toLowerCase();
		setRows((prev) =>
			prev.map((row) => {
				if (row.id !== id) return row;

				if (!normalizedInput) {
					return {
						...row,
						earTagInput: value,
						boarPigId: '',
						boarPigEarTag: '',
					};
				}

				const matchedPig = pigs.find(
						(pig) => (pig.earTag || '').trim().toLowerCase() === normalizedInput && pig.type === PigType.NOC);
				return {
					...row,
					earTagInput: value,
					boarPigId: matchedPig?.id || '',
					boarPigEarTag: matchedPig?.earTag || '',
				};
			})
		);
	};

	const handleSelectPig = (id: string, pig: PigResponse) => {
		setRows((prev) =>
			prev.map((row) =>
				row.id === id
					? {
							...row,
							boarPigId: pig.id,
							earTagInput: pig.earTag || '',
							boarPigEarTag: pig.earTag || '',
						}
					: row
			)
		);
		setActiveSuggestionRowId(null);
		setSuggestionPos(null);
	};

	const handleRowChange = (id: string, field: Exclude<keyof SemenRow, 'id' | 'boarPigId' | 'earTagInput' | 'boarPigEarTag'>, value: string | number) => {
		setRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
		);
	};

	const handleAddRow = () => {
		const newRow = createEmptyRow();
		setRows((prev) => [...prev, newRow]);
	};

	const handleDeleteRow = (id: string) => {
		setRows((prev) => prev.filter((row) => row.id !== id));
	};

	const handleSubmit = async () => {
		// Validate that all required fields are filled
		const isValid = rows.every(
			(row) => (row.boarPigEarTag || row.earTagInput) && row.collectionDate && row.volume > 0
		);

		if (!isValid) {
			alert('Vui lòng điền đầy đủ thông tin bắt buộc (Lợn đực, Ngày thu, Thể tích)');
			return;
		}

		setLoading(true);
		try {
			const semens = rows.map((row) => ({
				boarPigId: row.boarPigId || '',
				collectionDate: row.collectionDate,
				volume: row.volume || 0,
				motility: row.motility || 0,
				quality: row.quality || '',
				status: 'AVAILABLE',
				note: row.note || '',
			}));

			await semenService.createBulkSemen(semens as CreateSemenRequest[]);

			alert('Thêm mẫu nọc thành công!');
			setRows([createEmptyRow()]);
			onSuccess();
			onClose();
		} catch (error) {
			console.error('Failed to create semen:', error);
			alert('Thêm mẫu nọc thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
				{/* HEADER */}
				<div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b bg-white">
					<div>
						<h2 className="text-lg font-bold text-slate-900">Thêm mẫu nọc</h2>
						<p className="text-xs text-slate-500 mt-1">Quản lý mẫu nọc từ lợn đực</p>
					</div>
					<button
						onClick={onClose}
						className="p-1 hover:bg-slate-100 rounded-lg transition"
					>
						<X size={20} />
					</button>
				</div>

				{/* BODY */}
				<div className="p-6">
					{/* Table */}
					<div className="overflow-x-auto border border-slate-200 rounded-lg">
						<table className="w-full">
							<thead className="bg-slate-50 border-b border-slate-200">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase w-40">
										Lợn đực (Số tai)
									</th>
									<th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase w-32">
										Ngày thu
									</th>
									<th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase w-24">
										Thể tích (ml)
									</th>
									<th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase w-24">
										Độ di động (%)
									</th>
									<th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase w-24">
										Chất lượng
									</th>
									<th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase w-12">
										Xóa
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-50">
								{rows.map((row) => {
									const suggestions = getSuggestions(row.earTagInput);

									return (
										<tr key={row.id} className="hover:bg-slate-50">
											<td className="px-4 py-3">
												<div className="relative">
													<input
														type="text"
														value={row.earTagInput}
														onFocus={(e) => {
															setActiveSuggestionRowId(row.id);
															const rect = e.currentTarget.getBoundingClientRect();
															setSuggestionPos({
																top: rect.bottom + window.scrollY,
																left: rect.left + window.scrollX,
																width: rect.width,
															});
														}}
														onBlur={() => {
															setTimeout(() => {
																setActiveSuggestionRowId(null);
																setSuggestionPos(null);
															}, 120);
														}}
														onChange={(e) => {
															setActiveSuggestionRowId(row.id);
															handleEarTagInputChange(row.id, e.target.value);
														}}
														placeholder="Gõ số tai để chọn"
														className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
														required
													/>
													{activeSuggestionRowId === row.id && suggestions.length > 0 && suggestionPos && (
														<div
															className="fixed z-50 rounded-md border bg-white shadow-lg overflow-y-auto"
															style={{
																top: suggestionPos.top,
																left: suggestionPos.left,
																width: suggestionPos.width,
																maxHeight: '200px',
															}}
														>
															{suggestions.map((pig) => (
																<button
																	key={pig.id}
																	type="button"
																	onMouseDown={(e) => {
																		e.preventDefault();
																		handleSelectPig(row.id, pig);
																	}}
																	className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 whitespace-nowrap text-slate-700"
																>
																	{pig.earTag}
																</button>
															))}
														</div>
													)}
												</div>
											</td>
											<td className="px-4 py-3">
												<input
													type="date"
													value={row.collectionDate}
													onChange={(e) =>
														handleRowChange(row.id, 'collectionDate', e.target.value)
													}
													className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
													required
												/>
											</td>
											<td className="px-4 py-3">
												<input
													type="number"
													min="0"
													step="0.1"
													value={row.volume}
													onChange={(e) =>
														handleRowChange(row.id, 'volume', parseFloat(e.target.value) || 0)
													}
													placeholder="0"
													className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
													required
												/>
											</td>
											<td className="px-4 py-3">
												<input
													type="number"
													min="0"
													max="100"
													step="1"
													value={row.motility}
													onChange={(e) =>
														handleRowChange(row.id, 'motility', parseFloat(e.target.value) || 0)
													}
													placeholder="0"
													className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
												/>
											</td>
											<td className="px-4 py-3">
												<input
													type="text"
													value={row.quality}
													onChange={(e) =>
														handleRowChange(row.id, 'quality', e.target.value)
													}
													placeholder="Ví dụ: Tốt"
													className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
												/>
											</td>
											<td className="px-4 py-3 text-center">
												<button
													onClick={() => handleDeleteRow(row.id)}
													className="p-1 text-slate-400 hover:text-rose-600 transition"
												>
													<Trash2 size={14} />
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{/* Add Row Button */}
				<div className="mt-4 flex justify-start">
					<button
						onClick={handleAddRow}
						className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-100 transition"
					>
						<Plus size={16} />
						Thêm dòng
					</button>
				</div>

				{/* Submit & Cancel Buttons */}
				<div className="mt-6 flex justify-end gap-3">
						<button
							onClick={onClose}
							disabled={loading}
							className="px-6 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
						>
							Hủy
						</button>
						<button
							onClick={handleSubmit}
							disabled={loading}
							className="px-6 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
						>
							{loading ? 'Đang lưu...' : 'Lưu mẫu nọc'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SemenForm;
