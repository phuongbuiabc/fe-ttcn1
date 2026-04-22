export type ModuleTab = {
  name: string;
  href: string;
};

export type ModuleConfig = {
  name: string;
  tabs: ModuleTab[];
};

export const moduleTabs: Record<string, ModuleConfig> = {
  "/pigs": {
    name: "Quản lý lợn",
    tabs: [
      { name: "Lợn", href: "/pigs" },
      { name: "Đàn con", href: "/litter" },
      { name: "Giống", href: "/breed" },
    ],
  },

  "/breed": {
    name: "Giống",
    tabs: [{ name: "Giống", href: "/breed" }],
  },

  "/litter": {
    name: "Đàn con",
    tabs: [{ name: "Đàn con", href: "/litter" }],
  },

  "/reproduction": {
    name: "Sinh sản",
    tabs: [
      { name: "Phối giống", href: "/reproduction/mating" },
      { name: "Đẻ", href: "/reproduction/birth" },
    ],
  },

  "/health": {
    name: "Sức khỏe",
    tabs: [],
  },

  "/pens": {
    name: "Chuồng nuôi",
    tabs: [],
  },

  "/trading": {
    name: "Mua bán",
    tabs: [
      { name: "Nhập hàng", href: "/trading/import" },
      { name: "Bán hàng", href: "/trading/export" },
    ],
  },

  "/staff": {
    name: "Nhân sự",
    tabs: [
      { name: "Nhân viên", href: "/staff" },
      { name: "Lịch làm việc", href: "/staff/schedule" },
    ],
  },
};