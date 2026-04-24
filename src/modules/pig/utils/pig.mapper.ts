import { PigType, PigStatus } from '@/shared/enums/pig.enum';

export const PIG_TYPE_OPTIONS = [
  { value: PigType.NAI, label: 'Nái' },
  { value: PigType.NOC, label: 'Nọc' },
  { value: PigType.THIT, label: 'Thịt' },
];

export const PIG_STATUS_OPTIONS = [
  { value: PigStatus.ACTIVE, label: 'Khỏe mạnh' },
  { value: PigStatus.SOLD, label: 'Đã bán' },
  { value: PigStatus.DEAD, label: 'Tiêu hủy' },
];

export const pigStatusColor: Record<PigStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-600',
  SOLD: 'bg-blue-50 text-blue-600',
  DEAD: 'bg-rose-50 text-rose-600',
};