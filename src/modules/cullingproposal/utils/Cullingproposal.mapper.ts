import { CullingProposalStatus, CullingProposalType } from '@/shared/enums/cullingproposal.enum';

export const CULLING_PROPOSAL_STATUS_OPTIONS = [
  { value: CullingProposalStatus.PENDING, label: 'Đang chờ' },
  { value: CullingProposalStatus.APPROVED, label: 'Đã duyệt' },
  { value: CullingProposalStatus.REJECTED, label: 'Bị từ chối' },
];

export const CULLING_PROPOSAL_TYPE_OPTIONS = [
  { value: CullingProposalType.CULLING, label: 'Tiêu hủy' },
  { value: CullingProposalType.SELL_OFF, label: 'Bán loại' },
];