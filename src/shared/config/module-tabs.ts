export type ModuleTab = {
  name: string;
  href: string;
  title?: string;
};

export type ModuleConfig = {
  name: string;
  basePath: string;
  tabs: ModuleTab[];
};

// ===== DEFINE TABS =====
const pigTabs: ModuleTab[] = [
  { name: "Lợn", href: "/pigs", title: "Danh mục lợn" },
  { name: "Đàn con", href: "/pigs/pig-herds", title: "Danh mục đàn con" },
  { name: "Giống", href: "/pigs/breeds", title: "Danh mục giống" },
  { name: "Đề xuất loại", href: "/pigs/culling-proposals", title: "Danh mục đề xuất" },
];

const healthTabs: ModuleTab[] = [
  { name: "Tăng trưởng", href: "/health/growth-tracking", title: "Theo dõi tăng trưởng" },
  { name: "Bệnh", href: "/health/diseases", title: "Danh mục bệnh" },
  { name: "Điều trị", href: "/health/treatments", title: "Theo dõi điều trị" },
];

const tradingTabs: ModuleTab[] = [
  { name: "Nhập hàng", href: "/trading/import" },
  { name: "Bán hàng", href: "/trading/export" },
];

const staffTabs: ModuleTab[] = [
  { name: "Nhân viên", href: "/staff" },
  { name: "Lịch làm việc", href: "/staff/schedule" },
];

// ===== MODULE CONFIG =====
export const modules: ModuleConfig[] = [
  {
    name: "Quản lý lợn",
    basePath: "/pigs",
    tabs: pigTabs,
  },
  {
    name: "Mua bán",
    basePath: "/trading",
    tabs: tradingTabs,
  },
  {
    name: "Nhân sự",
    basePath: "/staff",
    tabs: staffTabs,
  },
  {
    name: "Sức khỏe",
    basePath: "/health",
    tabs: healthTabs,
  },
  {
    name: "Chuồng nuôi",
    basePath: "/pens",
    tabs: [],
  },
];