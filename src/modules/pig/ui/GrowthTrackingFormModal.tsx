'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useArea } from '@/modules/area/hooks/useArea';
import { usePen } from '@/modules/pens/hooks/usePen';
import { usePig } from '@/modules/pig/hooks/usePig';
import { usePiggrowth } from '@/modules/pig/hooks/usePiggrowth';
import { PigDetailResponse } from '@/modules/pig/model/pig.model';
import { CreateGrowthTrackingRequest } from '@/modules/pig/model/piggrowth.model';

type RowDraft = {
	pigId: string;
	trackingDate: string;
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

interface GrowthTrackingFormModalProps {
	onClose: () => void;
	onSuccess: () => void;
}

export default function GrowthTrackingFormModal({ onClose, onSuccess }: GrowthTrackingFormModalProps) {
	const { areas, fetchAreas } = useArea();
	const { pens, penDetail, fetchPens, fetchPenDetail, loadingDetail } = usePen();
	const { fetchPigDetail } = usePig();
	const { createGrowth, loading } = usePiggrowth();

	const [selectedArea, setSelectedArea] = useState<string>('ALL');
	const [selectedPen, setSelectedPen] = useState<string>('');
	const [pigDetails, setPigDetails] = useState<PigDetailResponse[]>([]);
	const [draftRows, setDraftRows] = useState<Record<string, RowDraft>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		fetchAreas();
		fetchPens();
	}, [fetchAreas, fetchPens]);

	useEffect(() => {
		if (!selectedPen) {
			setPigDetails([]);
			setDraftRows({});
			return;
		}

		fetchPenDetail(selectedPen);
	}, [selectedPen, fetchPenDetail]);

	useEffect(() => {
		if (!penDetail || penDetail.pigs.length === 0) {
			setPigDetails([]);
			setDraftRows({});
			return;
		}

		const fetchDetails = async () => {
			const details = await Promise.all(
				penDetail.pigs.map((p) => fetchPigDetail(p.pigId))
			);

			const validDetails = details.filter(
				(d): d is PigDetailResponse => d !== null
			);

			setPigDetails(validDetails);

			const initialRows: Record<string, RowDraft> = {};
			validDetails.forEach((detail) => {
				initialRows[detail.pig.id] = {
					pigId: detail.pig.id,
					trackingDate: getToday(),
					litterLength: '',
					chestGirth: '',
					weight: detail.currentWeight?.toString() || '',
					note: '',
				};
			});
			setDraftRows(initialRows);
		};

		fetchDetails();
	}, [selectedPen, penDetail, fetchPigDetail]);

	const filteredPens = useMemo(() => {
		if (selectedArea === 'ALL') return pens;
		return pens.filter((p) => p.areaId === selectedArea);
	}, [pens, selectedArea]);

	const selectedPenName = useMemo(() => {
		return pens.find((p) => p.id === selectedPen)?.name || '';
	}, [pens, selectedPen]);

	const handleChangeCell = (
		pigId: string,
		field: keyof Omit<RowDraft, 'pigId'>,
		value: string
	) => {
		setDraftRows((prev) => ({
			...prev,
			[pigId]: {
				...prev[pigId],
				[field]: value,
			},
		}));
	};

	const handleAddEmptyRow = () => {
		const newRowId = `empty-${Date.now()}`;
		setDraftRows((prev) => ({
			...prev,
			[newRowId]: {
				pigId: newRowId,
				trackingDate: getToday(),
				litterLength: '',
				chestGirth: '',
				weight: '',
				note: '',
			},
		}));
	};

	const handleDeleteRow = (pigId: string) => {
		setDraftRows((prev) => {
			const newRows = { ...prev };
			delete newRows[pigId];
			return newRows;
		});
	};

	const handleConfirm = async () => {
		const payloads = Object.entries(draftRows)
			.map(([pigId, draft]) => {
				// Skip empty rows
				if (pigId.startsWith('empty-') && !draft.weight && !draft.litterLength && !draft.chestGirth) {
					return null;
				}

				// Validate pigId is real
				if (pigId.startsWith('empty-')) {
					return null;
				}

				const payload: CreateGrowthTrackingRequest = {
					pigId: draft.pigId,
					trackingDate: draft.trackingDate,
					...(toNumberOrUndefined(draft.litterLength) !== undefined
						? { litterLength: toNumberOrUndefined(draft.litterLength) }
						: {}),
					...(toNumberOrUndefined(draft.chestGirth) !== undefined
						? { chestGirth: toNumberOrUndefined(draft.chestGirth) }
						: {}),
					...(toNumberOrUndefined(draft.weight) !== undefined
						? { weight: toNumberOrUndefined(draft.weight) }
						: {}),
					...(draft.note.trim() ? { note: draft.note.trim() } : {}),
				};

				return payload;
			})
			.filter(isNotNull)
			.filter(
				(item) =>
					item.trackingDate &&
					(item.litterLength !== undefined ||
						item.chestGirth !== undefined ||
						item.weight !== undefined ||
						item.note)
			);

		if (payloads.length === 0) {
			alert('Chưa có dữ liệu hợp lệ để lưu. Vui lòng nhập ít nhất 1 chỉ số tăng trưởng.');
			return;
		}

		setSubmitting(true);
		try {
			await Promise.all(payloads.map((item) => createGrowth(item)));
			alert(`Đã lưu ${payloads.length} bản ghi tăng trưởng thành công.`);
			onSuccess();
		} catch {
			alert('Có lỗi khi lưu dữ liệu tăng trưởng. Vui lòng thử lại.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 max-h-screen overflow-y-auto">
			<div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full my-auto">
				{/* HEADER */}
				<div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white">
					<div>
						<h2 className="font-bold text-lg text-slate-900">Thêm bản ghi tăng trưởng</h2>
						<p className="text-xs text-slate-500 mt-1">Chọn chuồng và nhập dữ liệu theo từng hàng</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} className="text-slate-500" />
					</button>
				</div>

				{/* FORM CONTROLS */}
				<div className="px-6 py-4 border-b bg-slate-50/50">
					<div className="flex flex-wrap items-end gap-3">
						<div className="min-w-[180px]">
							<p className="text-xs font-semibold text-slate-500 mb-1">Khu</p>
							<select
								value={selectedArea}
								onChange={(e) => {
									setSelectedArea(e.target.value);
									setSelectedPen('');
								}}
								className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
							>
								<option value="ALL">Tất cả khu</option>
								{areas.map((a) => (
									<option key={a.id} value={a.id}>
										{a.name}
									</option>
								))}
							</select>
						</div>

						<div className="min-w-[220px]">
							<p className="text-xs font-semibold text-slate-500 mb-1">Chuồng</p>
							<select
								value={selectedPen}
								onChange={(e) => setSelectedPen(e.target.value)}
								className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
							>
								<option value="">Chọn chuồng</option>
								{filteredPens.map((p) => (
									<option key={p.id} value={p.id}>
										{p.name}
									</option>
								))}
							</select>
						</div>

						<button
							onClick={handleAddEmptyRow}
							disabled={!selectedPen || loadingDetail}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
						>
							<Plus size={16} />
							Thêm dòng
						</button>
					</div>
				</div>

				{/* TABLE */}
				{selectedPen ? (
					<div className="overflow-auto max-h-[400px]">
						<table className="w-full min-w-[1200px] text-sm">
							<thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0">
								<tr>
									<th className="p-3 text-left">STT</th>
									<th className="p-3 text-left">Mã lợn</th>
									<th className="p-3 text-left">Số tai</th>
									<th className="p-3 text-left">Giống</th>
									<th className="p-3 text-left">Ngày đo</th>
									<th className="p-3 text-left">Dài lưng (cm)</th>
									<th className="p-3 text-left">Vòng ngực (cm)</th>
									<th className="p-3 text-left">Cân nặng (kg)</th>
									<th className="p-3 text-left">Ghi chú</th>
									<th className="p-3 text-center">Thao tác</th>
								</tr>
							</thead>

							<tbody>
								{Object.entries(draftRows).length === 0 ? (
									<tr>
										<td colSpan={10} className="p-6 text-center text-slate-500">
											Không có lợn trong chuồng này.
										</td>
									</tr>
								) : (
									Object.entries(draftRows).map(([pigId, draft], index) => {
										const pigDetail = pigDetails.find((d) => d.pig.id === pigId);
										const isEmptyRow = pigId.startsWith('empty-');

										return (
											<tr key={pigId} className="border-t hover:bg-slate-50">
												<td className="p-3">{index + 1}</td>
												<td className="p-3 font-semibold">
													{isEmptyRow ? '--' : pigDetail?.pig.pigCode}
												</td>
												<td className="p-3">
													{isEmptyRow ? '--' : pigDetail?.pig.earTag || '-'}
												</td>
												<td className="p-3">
													{isEmptyRow ? '--' : pigDetail?.pig.species || '-'}
												</td>
												<td className="p-3">
													<input
														type="date"
														value={draft.trackingDate}
														onChange={(e) =>
															handleChangeCell(pigId, 'trackingDate', e.target.value)
														}
														className="w-full border rounded px-2 py-1 text-xs"
													/>
												</td>
												<td className="p-3">
													<input
														type="number"
														placeholder="Nhập"
														value={draft.litterLength}
														onChange={(e) =>
															handleChangeCell(pigId, 'litterLength', e.target.value)
														}
														className="w-full border rounded px-2 py-1 text-xs"
													/>
												</td>
												<td className="p-3">
													<input
														type="number"
														placeholder="Nhập"
														value={draft.chestGirth}
														onChange={(e) =>
															handleChangeCell(pigId, 'chestGirth', e.target.value)
														}
														className="w-full border rounded px-2 py-1 text-xs"
													/>
												</td>
												<td className="p-3">
													<input
														type="number"
														placeholder="Nhập"
														value={draft.weight}
														onChange={(e) =>
															handleChangeCell(pigId, 'weight', e.target.value)
														}
														className="w-full border rounded px-2 py-1 text-xs"
													/>
												</td>
												<td className="p-3">
													<input
														type="text"
														placeholder="Ghi chú"
														value={draft.note}
														onChange={(e) =>
															handleChangeCell(pigId, 'note', e.target.value)
														}
														className="w-full border rounded px-2 py-1 text-xs"
													/>
												</td>
												<td className="p-3 text-center">
													<button
														onClick={() => handleDeleteRow(pigId)}
														className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
														title="Xóa dòng"
													>
														<Trash2 size={16} />
													</button>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				) : (
					<div className="p-12 text-center text-slate-500">
						<p className="text-sm">Vui lòng chọn chuồng để hiển thị danh sách lợn</p>
					</div>
				)}

				{/* FOOTER */}
				<div className="px-6 py-4 border-t flex items-center justify-end gap-3 bg-slate-50/50 sticky bottom-0">
					<button
						onClick={onClose}
						className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
					>
						Hủy
					</button>
					<button
						onClick={handleConfirm}
						disabled={submitting || loading || !selectedPen}
						className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
					>
						{submitting ? 'Đang lưu...' : 'Lưu bản ghi'}
					</button>
				</div>
			</div>
		</div>
	);
}
