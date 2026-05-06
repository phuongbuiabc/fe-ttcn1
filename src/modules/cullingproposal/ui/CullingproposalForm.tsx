'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { cullingProposalService } from '@/modules/cullingproposal/api/CullingProposal.service';
import { CreateCullingProposalRequest } from '@/modules/cullingproposal/model/CullingProposal.model';
import { usePig } from '@/modules/pig/hooks/usePig';
import { PigResponse } from '@/modules/pig/model/pig.model';
import { useAuth } from '@/shared/components/AuthProvider';

interface ProposalRow {
	id: string;
	pigId: string;
	earTagInput: string;
	pigEarTag: string;
	proposalType: 'CULLING' | 'SELL_OFF';
	reason: string;
	employeeId: string;
}

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const createEmptyRow = (): ProposalRow => ({
	id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
	pigId: '',
	earTagInput: '',
	pigEarTag: '',
	proposalType: 'CULLING',
	reason: '',
	employeeId: '',
});

export const CullingProposalForm: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
	const { pigs, fetchPigs, loadingList } = usePig();
	const { user } = useAuth();
	const [rows, setRows] = useState<ProposalRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [activeSuggestionRowId, setActiveSuggestionRowId] = useState<string | null>(null);
	const [suggestionPos, setSuggestionPos] = useState<{ top: number; left: number; width: number } | null>(null);

	useEffect(() => {
		fetchPigs();
	}, [fetchPigs]);

	useEffect(() => {
		if (isOpen && user?.id) {
			const newRow = createEmptyRow();
			newRow.employeeId = user.id;
			setRows([newRow]);
		}
	}, [isOpen, user?.id]);

	if (!isOpen) return null;

	const getSuggestions = (keyword: string) => {
		const normalized = keyword.trim().toLowerCase();
		const source = pigs.filter((pig) => !!pig.earTag?.trim());
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
						pigId: '',
						pigEarTag: '',
					};
				}

				const matchedPig = pigs.find(
					(pig) => (pig.earTag || '').trim().toLowerCase() === normalizedInput
				);

				return {
					...row,
					earTagInput: value,
					pigId: matchedPig?.id || '',
					pigEarTag: matchedPig?.earTag || '',
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
							pigId: pig.id,
							earTagInput: pig.earTag || '',
							pigEarTag: pig.earTag || '',
						}
					: row
			)
		);
		setActiveSuggestionRowId(null);
		setSuggestionPos(null);
	};

	const handleRowChange = (id: string, field: Exclude<keyof ProposalRow, 'id' | 'pigId' | 'earTagInput' | 'pigEarTag'>, value: string) => {
		setRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
		);
	};

	const handleAddRow = () => {
		const newRow = createEmptyRow();
		if (user?.id) {
			newRow.employeeId = user.id;
		}
		setRows((prev) => [...prev, newRow]);
	};

	const handleDeleteRow = (id: string) => {
		setRows((prev) => prev.filter((row) => row.id !== id));
	};

	const handleSubmit = async () => {
		// Validate that all required fields are filled
		const isValid = rows.every(
			(row) => row.pigId && row.proposalType
		);

		if (!isValid) {
			alert('Vui lòng điền đầy đủ thông tin bắt buộc (Số tai, Loại)');
			return;
		}

		setLoading(true);
		try {
			const proposals: CreateCullingProposalRequest[] = rows.map((row) => ({
				pigId: row.pigId,
				proposalType: row.proposalType,
				reason: row.reason || undefined,
				employeeId: row.employeeId,
			}));

			// Create all proposals
			await Promise.all(proposals.map((p) => cullingProposalService.create(p)));

			alert('Thêm đề xuất thành công!');
			setRows([createEmptyRow()]);
			onSuccess();
			onClose();
		} catch (error) {
			console.error('Failed to create proposals:', error);
			alert('Thêm đề xuất thất bại');
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
						<h2 className="text-lg font-bold text-slate-900">Thêm đề xuất loại vào</h2>
						<p className="text-xs text-slate-500 mt-1">Nhân viên: {user?.givenName} {user?.familyName}</p>
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
										Số tai
									</th>
									<th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase w-32">
										Loại
									</th>
									<th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase flex-1">
										Lý do
									</th>
									<th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase w-12">
										Xóa
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-50">
								{rows.map((row, index) => {
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
																	type="button"
																	key={pig.id}
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
												<select
													value={row.proposalType}
													onChange={(e) =>
														handleRowChange(
															row.id,
															'proposalType',
															e.target.value as 'CULLING' | 'SELL_OFF'
														)
													}
													className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
												>
													<option value="CULLING">Tiêu hủy</option>
													<option value="SELL_OFF">Bán loại</option>
												</select>
											</td>
											<td className="px-4 py-3">
												<input
													type="text"
													value={row.reason}
													onChange={(e) =>
														handleRowChange(row.id, 'reason', e.target.value)
													}
													placeholder="Nhập lý do..."
													className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
												/>
											</td>
											<td className="px-4 py-3 text-center">
												<button
													onClick={() => handleDeleteRow(row.id)}
													className="inline-flex items-center justify-center p-1 text-rose-500 hover:bg-rose-50 rounded transition"
													disabled={rows.length === 1}
												>
													<Trash2 size={16} />
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
				</div>

				{/* FOOTER */}
				<div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t bg-white">
					<button
						onClick={onClose}
						className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
						disabled={loading}
					>
						Hủy
					</button>
					<button
						onClick={handleSubmit}
						className="px-6 py-2 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition disabled:bg-slate-200 disabled:text-slate-400"
						disabled={loading}
					>
						{loading ? 'Đang tải...' : 'Thêm đề xuất'}
					</button>
				</div>
			</div>
		</div>
	);
};
