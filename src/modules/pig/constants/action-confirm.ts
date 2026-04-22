export const ACTION_CONFIRM_CONFIG = {
  'delete-pig': {
    title: 'Xác nhận xóa lợn?',
    getDescription: (name?: string) =>
      `Bạn có chắc muốn xóa "${name}"?`,
    color: 'danger',
    icon: 'delete',
  },

  'delete-litter': {
    title: 'Xác nhận xóa đàn?',
    getDescription: (name?: string) =>
      `Xóa toàn bộ dữ liệu của đàn "${name}".`,
    color: 'danger',
    icon: 'delete',
  },

  'approve-sale': {
    title: 'Duyệt đơn bán?',
    getDescription: () =>
      'Duyệt toàn bộ danh sách đề xuất bán?',
    color: 'success',
    icon: 'sale',
  },

  'confirm-disposal': {
    title: 'Xác nhận tiêu hủy?',
    getDescription: () =>
      'Tiêu hủy các cá thể trong danh sách?',
    color: 'danger',
    icon: 'warning',
  },
} as const;

export type ActionType = keyof typeof ACTION_CONFIRM_CONFIG;