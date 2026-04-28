import { PenStatus, PenType} from "@/shared/enums/pen.enum";

export const PEN_STATUS_OPTIONS = [
  { value: PenStatus.IN_USE, label: 'Đang sử dụng' },
  { value: PenStatus.EMPTY, label: 'Trống' },
  { value: PenStatus.MAINTENANCE, label: 'Bảo trì' },
];

export const PEN_TYPE_OPTIONS = [
  { value: PenType.BREEDING, label: 'Chuồng giống' },
  { value: PenType.FARROWING, label: 'Chuồng đẻ' },
  { value: PenType.GROWING, label: 'Chuồng nuôi' },
  { value: PenType.FINISHING, label: 'Chuồng xuất' },
];