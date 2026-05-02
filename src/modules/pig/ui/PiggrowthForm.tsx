'use client';

import React, { useEffect, useMemo, useState } from 'react';
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

export default function GrowthTrackingPage() {
	const { areas, fetchAreas } = useArea();
	const { pens, penDetail, fetchPens, fetchPenDetail, loadingDetail } = usePen();
	const { fetchPigDetail } = usePig();
	const { createGrowth, loading } = usePiggrowth();

	const [selectedArea, setSelectedArea] = useState<string>('ALL');
	const [selectedPen, setSelectedPen] = useState<string>('');
	const [showSheet, setShowSheet] = useState(false);
	const [pigDetails, setPigDetails] = useState<PigDetailResponse[]>([]);
	const [draftRows, setDraftRows] = useState<Record<string, RowDraft>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		fetchAreas();
		fetchPens();
	}, [fetchAreas, fetchPens]);

	useEffect(() => {
		if (!selectedPen) {
			setShowSheet(false);
			setPigDetails([]);
			setDraftRows({});
			return;
		}

		fetchPenDetail(selectedPen);
		setShowSheet(false);
	}, [selectedPen, fetchPenDetail]);

	useEffect(() => {
		if (!showSheet || !penDetail || penDetail.pigs.length === 0) {
			if (showSheet) {
				setPigDetails([]);
				setDraftRows({});
			}
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
	}, [showSheet, penDetail, fetchPigDetail]);

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

	const handleGenerateSheet = () => {
		if (!selectedPen) {
			alert('Vui lòng chọn chuồng trước khi tạo bảng tăng trưởng.');
			return;
		}
		setShowSheet(true);
	};

	const handleConfirm = async () => {
		const payloads = pigDetails
			.map((detail) => {
				const draft = draftRows[detail.pig.id];
				if (!draft) return null;

				const payload: CreateGrowthTrackingRequest = {
					pigId: detail.pig.id,
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
			setShowSheet(false);
		} catch {
			alert('Có lỗi khi lưu dữ liệu tăng trưởng. Vui lòng thử lại.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="space-y-4 p-4 min-h-screen bg-[#fbfcfd]">
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
					onClick={handleGenerateSheet}
					disabled={!selectedPen || loadingDetail}
					className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold disabled:opacity-60"
				>
					Tạo bảng tăng trưởng
				</button>
			</div>

			{showSheet && (
				<div className="bg-white border rounded-xl shadow-sm overflow-hidden">
					<div className="px-4 py-3 border-b flex items-center justify-between gap-2">
						<div>
							<h2 className="font-bold text-slate-800">
								Bảng nhập tăng trưởng - {selectedPenName}
							</h2>
							<p className="text-xs text-slate-500">
								Thông tin định danh đã tự điền sẵn. Bạn chỉ cần nhập số đo theo từng hàng.
							</p>
						</div>

						<button
							onClick={handleConfirm}
							disabled={submitting || loading}
							className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold disabled:opacity-60"
						>
							{submitting ? 'Đang lưu...' : 'Xác nhận'}
						</button>
					</div>

					<div className="overflow-auto">
						<table className="w-full min-w-[1100px] text-sm">
							<thead className="bg-slate-50 text-xs uppercase text-slate-500">
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
								</tr>
							</thead>

							<tbody>
								{pigDetails.length === 0 ? (
									<tr>
										<td colSpan={9} className="p-6 text-center text-slate-500">
											Không có lợn trong chuồng này.
										</td>
									</tr>
								) : (
									pigDetails.map((detail, index) => {
										const draft = draftRows[detail.pig.id];
										if (!draft) return null;

										return (
											<tr key={detail.pig.id} className="border-t">
												<td className="p-2">{index + 1}</td>
												<td className="p-2 font-semibold">{detail.pig.pigCode}</td>
												<td className="p-2">{detail.pig.earTag || '-'}</td>
												<td className="p-2">{detail.pig.species || '-'}</td>
												<td className="p-2">
													<input
														type="date"
														value={draft.trackingDate}
														onChange={(e) =>
															handleChangeCell(detail.pig.id, 'trackingDate', e.target.value)
														}
														className="w-full border rounded px-2 py-1"
													/>
												</td>
												<td className="p-2">
													<input
														type="number"
														placeholder="Nhập"
														value={draft.litterLength}
														onChange={(e) =>
															handleChangeCell(detail.pig.id, 'litterLength', e.target.value)
														}
														className="w-full border rounded px-2 py-1"
													/>
												</td>
												<td className="p-2">
													<input
														type="number"
														placeholder="Nhập"
														value={draft.chestGirth}
														onChange={(e) =>
															handleChangeCell(detail.pig.id, 'chestGirth', e.target.value)
														}
														className="w-full border rounded px-2 py-1"
													/>
												</td>
												<td className="p-2">
													<input
														type="number"
														placeholder="Nhập"
														value={draft.weight}
														onChange={(e) =>
															handleChangeCell(detail.pig.id, 'weight', e.target.value)
														}
														className="w-full border rounded px-2 py-1"
													/>
												</td>
												<td className="p-2">
													<input
														type="text"
														placeholder="Ghi chú"
														value={draft.note}
														onChange={(e) =>
															handleChangeCell(detail.pig.id, 'note', e.target.value)
														}
														className="w-full border rounded px-2 py-1"
													/>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
