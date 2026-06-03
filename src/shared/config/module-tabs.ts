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
export const pigTabs: ModuleTab[] = [
  { name: "Lợn", href: "/pigs", title: "Danh mục lợn" },
  { name: "Đàn con", href: "/pigs/piglet-herds", title: "Danh mục đàn con" },
  { name: "Giống", href: "/pigs/breeds", title: "Danh mục giống" },
  { name: "Đề xuất loại", href: "/pigs/culling-proposals", title: "Danh mục đề xuất" },
];

const reproductionTabs: ModuleTab[] = [
  { name: "Phối giống", href: "/reproductions", title: "Quản lý phối giống" },
  { name: "Thai kỳ", href: "/reproductions/mating", title: "Quản lý thai kỳ" },
];

const healthTabs: ModuleTab[] = [
  { name: "Tăng trưởng", href: "/health/growth-tracking", title: "Theo dõi tăng trưởng" },
  { name: "Tiêm phòng", href: "/health/vaccinations", title: "Quản lý tiêm phòng" },
  { name: "Bệnh", href: "/health/diseases", title: "Theo dõi bệnh" },
];

const penTabs: ModuleTab[] = [
  { name: "Chuồng", href: "/pens", title: "Danh mục chuồng" },
  { name: "Khu vực", href: "/pens/areas", title: "Danh mục khu vực" },
];

const tradingTabs: ModuleTab[] = [
  { name: "Nhập lợn", href: "/trading/import" },
  { name: "Xuất lợn", href: "/trading/export" },
];

const staffTabs: ModuleTab[] = [
  { name: "Nhân viên", href: "/staff" },
  { name: "Lịch làm việc", href: "/work-schedules" },
];

const inventoryTabs: ModuleTab[] = [
  { name: "Kho vật tư", href: "/inventory", title: "Kho vật tư" },
  { name: "Lịch sử nhập", href: "/inventory?tab=import", title: "Lịch sử nhập kho" },
  { name: "Lịch sử xuất", href: "/inventory?tab=export", title: "Lịch sử xuất kho" },
];



// ===== MODULE CONFIG =====
export const modules: ModuleConfig[] = [
  {
    name: "Quản lý lợn",
    basePath: "/pigs",
    tabs: pigTabs,
  },
  {
    name: "Sinh sản",
    basePath: "/reproductions",
    tabs: reproductionTabs,
  },
  {
    name: "Mua bán",
    basePath: "/trading",
    tabs: tradingTabs,
  },
  {
    name: "Nhân sự",
    basePath: "/staff",
    tabs: [],
  },
  {
    name: "Lịch làm việc",
    basePath: "/work-schedules",
    tabs: [],
  },
  {
    name: "Sức khỏe",
    basePath: "/health",
    tabs: healthTabs,
  },
  {
    name: "Chuồng nuôi",
    basePath: "/pens",
    tabs: penTabs,
  },
  {
    name: "Kho hàng",
    basePath: "/inventory",
    tabs: inventoryTabs,
  },
];