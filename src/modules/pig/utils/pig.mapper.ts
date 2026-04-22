import { PigType, PigStatus } from '../model/pig.enum';

export const pigTypeLabel: Record<PigType, string> = {
  NAI: 'Lợn nái',
  NOC: 'Lợn nọc',
  THIT: 'Lợn thịt',
};

export const pigStatusLabel: Record<PigStatus, string> = {
  ACTIVE: 'Đang nuôi',
  SOLD: 'Đã bán',
  DEAD: 'Đã chết',
};

export const pigStatusColor: Record<PigStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-600',
  SOLD: 'bg-blue-50 text-blue-600',
  DEAD: 'bg-rose-50 text-rose-600',
};