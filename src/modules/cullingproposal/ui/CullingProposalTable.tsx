"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
	CheckCircle2,
	CircleX,
	FilterX,
} from "lucide-react";
import { cn } from "@/shared/utils/utils";

import { useCullingProposal } from "@/modules/cullingproposal/hooks/useCullingProposal";
import { cullingProposalService } from "@/modules/cullingproposal/api/CullingProposal.service";
import { CullingProposalResponse } from "@/modules/cullingproposal/model/CullingProposal.model";
import { CullingProposalStatus, CullingProposalType } from "@/shared/enums/cullingproposal.enum";

type ProposalBucket = "dispose" | "sellOff" | "approved";

type SelectionState = Record<ProposalBucket, string[]>;

const statusMeta: Record<CullingProposalStatus, { label: string; className: string }> = {
	[CullingProposalStatus.APPROVED]: {
		label: "Phê duyệt",
		className: "bg-emerald-50 text-emerald-600",
	},
	[CullingProposalStatus.REJECTED]: {
		label: "Từ chối",
		className: "bg-rose-50 text-rose-600",
	},
	[CullingProposalStatus.PENDING]: {
		label: "Chờ duyệt",
		className: "bg-amber-50 text-amber-600",
	},
};

const proposalTypeMeta: Record<CullingProposalType, string> = {
	[CullingProposalType.CULLING]: "Tiêu hủy",
	[CullingProposalType.SELL_OFF]: "Bán loại",
};

const bucketMeta: Record<ProposalBucket, { title: string; emptyLabel: string }> = {
	dispose: {
		title: "Đề xuất tiêu hủy",
		emptyLabel: "Không có đề xuất tiêu hủy.",
	},
	sellOff: {
		title: "Đề xuất thanh lý",
		emptyLabel: "Không có đề xuất thanh lý.",
	},
	approved: {
		title: "Đề xuất đã phê duyệt",
		emptyLabel: "Không có đề xuất đã phê duyệt.",
	},
};

const initialSelection: SelectionState = {
	dispose: [],
	sellOff: [],
	approved: [],
};

const toDayStart = (value: string) => {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date.getTime();
};

const toDayEnd = (value: string) => {
	const date = new Date(value);
	date.setHours(23, 59, 59, 999);
	return date.getTime();
};

const isInDateRange = (proposal: CullingProposalResponse, fromDate: string, toDate: string) => {
	const createdAt = new Date(proposal.createdAt).getTime();

	if (fromDate && createdAt < toDayStart(fromDate)) {
		return false;
	}

	if (toDate && createdAt > toDayEnd(toDate)) {
		return false;
	}

	return true;
};

const formatDateTime = (value: string) => {
	const parsed = new Date(value);

	if (Number.isNaN(parsed.getTime())) {
		return value;
	}

	return format(parsed, "dd/MM/yyyy HH:mm");
};

const getStatusMeta = (status?: CullingProposalStatus) => {
	if (!status) {
		return statusMeta[CullingProposalStatus.PENDING];
	}

	return statusMeta[status] ?? {
		label: status,
		className: "bg-slate-100 text-slate-600",
	};
};

const getProposalTypeLabel = (proposalType: CullingProposalType) => {
	return proposalTypeMeta[proposalType] ?? proposalType;
};

const BucketTable = ({
	bucket,
	rows,
	selectedIds,
	onToggleOne,
	onToggleAll,
	onApprove,
	onReject,
	busy,
	fromDate,
	toDate,
	onFromDateChange,
	onToDateChange,
	onClearFilter,
}: {
	bucket: ProposalBucket;
	rows: CullingProposalResponse[];
	selectedIds: string[];
	onToggleOne: (bucket: ProposalBucket, id: string) => void;
	onToggleAll: (bucket: ProposalBucket, ids: string[], checked: boolean) => void;
	onApprove: (bucket: ProposalBucket) => void;
	onReject: (bucket: ProposalBucket) => void;
	busy: boolean;
	fromDate: string;
	toDate: string;
	onFromDateChange: (value: string) => void;
	onToDateChange: (value: string) => void;
	onClearFilter: () => void;
}) => {
	const meta = bucketMeta[bucket];
	const isApprovedBucket = bucket === "approved";
	const allSelected = rows.length > 0 && selectedIds.length === rows.length;
	const selectedCount = selectedIds.length;

	return (
		<div className="space-y-4">
			{/* Title and Filter Row */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
				<h3 className="text-base font-bold text-slate-900">{meta.title}</h3>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
					<label className="space-y-2">
						<input
							type="date"
							value={fromDate}
							onChange={(e) => onFromDateChange(e.target.value)}
							className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
						/>
					</label>
					<span className="block text-xs font-bold text-slate-600 uppercase">Đến ngày</span>
					<label className="space-y-2">
						<input
							type="date"
							value={toDate}
							onChange={(e) => onToDateChange(e.target.value)}
							className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
						/>
					</label>

					<button
						type="button"
						onClick={onClearFilter}
						className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
					>
						<FilterX size={14} />
						Xóa
					</button>
				</div>
			</div>

			{/* Table */}
			<div className="responsive-table max-h-[65vh] overflow-x-auto overflow-y-auto rounded-lg border border-slate-200">
				<table className="w-full text-left">
					<thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
						<tr>
							<th className="w-12 px-4 py-3">
								{!isApprovedBucket && (
									<input
										type="checkbox"
										checked={allSelected}
										onChange={(e) => onToggleAll(bucket, rows.map((r) => r.id), e.target.checked)}
										className="h-4 w-4 rounded border-slate-300"
									/>
								)}
							</th>
							<th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Số tai</th>
							<th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Loại</th>
							<th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Lý do</th>
							<th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Nhân viên</th>
							<th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Ngày tạo</th>
							<th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-50">
						{rows.length === 0 ? (
							<tr>
								<td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">
									{meta.emptyLabel}
								</td>
							</tr>
						) : (
							rows.map((row) => {
								const status = getStatusMeta(row.status);
								const selected = selectedIds.includes(row.id);

								return (
									<tr
										key={row.id}
										className={cn("bg-white transition-colors", selected ? "bg-emerald-50" : "hover:bg-slate-50")}
									>
										<td className="px-4 py-3">
											{!isApprovedBucket && (
												<input
													type="checkbox"
													checked={selected}
													onChange={() => onToggleOne(bucket, row.id)}
													className="h-4 w-4 rounded border-slate-300"
												/>
											)}
										</td>
										<td className="px-4 py-3 text-sm text-slate-600">{row.pigEarTag || "--"}</td>
										<td className="px-4 py-3 text-sm text-slate-600">{getProposalTypeLabel(row.proposalType)}</td>
										<td className="px-4 py-3 text-sm text-slate-600">{row.reason || "--"}</td>
										<td className="px-4 py-3 text-sm text-slate-600">{row.employeeName}</td>
										<td className="px-4 py-3 text-sm text-slate-600">{formatDateTime(row.createdAt)}</td>
										<td className="px-4 py-3">
											<span className={cn("inline-block rounded-full px-2 py-1 text-xs font-bold uppercase", status.className)}>
												{status.label}
											</span>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between">
				<div className="text-xs text-slate-600">Đã chọn {selectedCount}/{rows.length} dòng</div>
				{!isApprovedBucket && (
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={() => onApprove(bucket)}
							disabled={selectedCount === 0 || busy}
							className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400"
						>
							<CheckCircle2 size={14} />
							Phê duyệt
						</button>
						<button
							type="button"
							onClick={() => onReject(bucket)}
							disabled={selectedCount === 0 || busy}
							className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-rose-600 disabled:bg-slate-200 disabled:text-slate-400"
						>
							<CircleX size={14} />
							Từ chối
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default function CullingProposalTable() {
	const { disposeList, sellOffList, approvedList, loading, fetchAll } = useCullingProposal();
	const [disposeFromDate, setDisposeFromDate] = useState("");
	const [disposeToDate, setDisposeToDate] = useState("");
	const [sellOffFromDate, setSellOffFromDate] = useState("");
	const [sellOffToDate, setSellOffToDate] = useState("");
	const [approvedFromDate, setApprovedFromDate] = useState("");
	const [approvedToDate, setApprovedToDate] = useState("");
	const [selection, setSelection] = useState<SelectionState>(initialSelection);
	const [actionLoading, setActionLoading] = useState<ProposalBucket | null>(null);

	const filteredDisposeList = useMemo(
		() => disposeList.filter((p) => isInDateRange(p, disposeFromDate, disposeToDate)),
		[disposeList, disposeFromDate, disposeToDate]
	);

	const filteredSellOffList = useMemo(
		() => sellOffList.filter((p) => isInDateRange(p, sellOffFromDate, sellOffToDate)),
		[sellOffList, sellOffFromDate, sellOffToDate]
	);

	const filteredApprovedList = useMemo(
		() => approvedList.filter((p) => isInDateRange(p, approvedFromDate, approvedToDate)),
		[approvedList, approvedFromDate, approvedToDate]
	);

	const handleToggleOne = (bucket: ProposalBucket, id: string) => {
		setSelection((current) => {
			const exists = current[bucket].includes(id);
			return {
				...current,
				[bucket]: exists ? current[bucket].filter((i) => i !== id) : [...current[bucket], id],
			};
		});
	};

	const handleToggleAll = (bucket: ProposalBucket, ids: string[], checked: boolean) => {
		setSelection((current) => ({
			...current,
			[bucket]: checked ? ids : [],
		}));
	};

	const runBulkAction = async (bucket: ProposalBucket, status: CullingProposalStatus) => {
		const ids = selection[bucket];
		if (ids.length === 0) return;

		setActionLoading(bucket);
		try {
			await Promise.all(ids.map((id) => cullingProposalService.update(id, { status })));
			await fetchAll();
			setSelection((current) => ({ ...current, [bucket]: [] }));
		} finally {
			setActionLoading(null);
		}
	};

	if (loading && disposeList.length === 0 && sellOffList.length === 0) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-12">
			{/* Two-column grid for pending proposals */}
			<div className="grid grid-cols-2 gap-8">
				<BucketTable
					bucket="dispose"
					rows={filteredDisposeList}
					selectedIds={selection.dispose}
					onToggleOne={handleToggleOne}
					onToggleAll={handleToggleAll}
					onApprove={(bucket) => runBulkAction(bucket, CullingProposalStatus.APPROVED)}
					onReject={(bucket) => runBulkAction(bucket, CullingProposalStatus.REJECTED)}
					busy={actionLoading === "dispose"}
					fromDate={disposeFromDate}
					toDate={disposeToDate}
					onFromDateChange={setDisposeFromDate}
					onToDateChange={setDisposeToDate}
					onClearFilter={() => {
						setDisposeFromDate("");
						setDisposeToDate("");
						setSelection((current) => ({ ...current, dispose: [] }));
					}}
				/>

				<BucketTable
					bucket="sellOff"
					rows={filteredSellOffList}
					selectedIds={selection.sellOff}
					onToggleOne={handleToggleOne}
					onToggleAll={handleToggleAll}
					onApprove={(bucket) => runBulkAction(bucket, CullingProposalStatus.APPROVED)}
					onReject={(bucket) => runBulkAction(bucket, CullingProposalStatus.REJECTED)}
					busy={actionLoading === "sellOff"}
					fromDate={sellOffFromDate}
					toDate={sellOffToDate}
					onFromDateChange={setSellOffFromDate}
					onToDateChange={setSellOffToDate}
					onClearFilter={() => {
						setSellOffFromDate("");
						setSellOffToDate("");
						setSelection((current) => ({ ...current, sellOff: [] }));
					}}
				/>
			</div>

			{/* Full-width approved proposals table */}
			<BucketTable
				bucket="approved"
				rows={filteredApprovedList}
				selectedIds={selection.approved}
				onToggleOne={handleToggleOne}
				onToggleAll={handleToggleAll}
				onApprove={(bucket) => runBulkAction(bucket, CullingProposalStatus.APPROVED)}
				onReject={(bucket) => runBulkAction(bucket, CullingProposalStatus.REJECTED)}
				busy={actionLoading === "approved"}
				fromDate={approvedFromDate}
				toDate={approvedToDate}
				onFromDateChange={setApprovedFromDate}
				onToDateChange={setApprovedToDate}
				onClearFilter={() => {
					setApprovedFromDate("");
					setApprovedToDate("");
					setSelection((current) => ({ ...current, approved: [] }));
				}}
			/>
		</div>
	);
}
