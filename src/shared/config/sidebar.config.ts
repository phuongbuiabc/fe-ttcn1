import {
  LayoutDashboard,
  PawPrint,
  Baby,
  Stethoscope,
  Warehouse,
  Database,
  ShoppingCart,
  Truck,
  Users,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  User,
} from "lucide-react";

export const sidebarConfig = [
  {
    name: "Bảng điều khiển",
    icon: LayoutDashboard,
    href: "/",
    tabs: [],
  },
  {
    name: "Quản lý Đàn lợn",
    icon: PawPrint,
    href: "/pigs",
    tabs: [
      { name: "Tổng quan", href: "/pigs" },
      { name: "Lợn", href: "/pigs/list" },
      { name: "Đàn con", href: "/pigs/litters" },
      { name: "Giống", href: "/pigs/breeds" },
    ],
  },
  {
    name: "Sinh sản",
    icon: Baby,
    href: "/reproduction",
    tabs: [],
  },
  {
    name: "Sức khỏe",
    icon: Stethoscope,
    href: "/health",
    tabs: [
      { name: "Theo dõi", href: "/health" },
      { name: "Bệnh", href: "/health/diseases" },
      { name: "Tiêm phòng", href: "/health/vaccines" },
    ],
  },
  {
    name: "Chuồng nuôi",
    icon: Warehouse,
    href: "/pens",
    tabs: [],
  },
  {
    name: "Vật tư",
    icon: Database,
    href: "/inventory",
    tabs: [],
  },
  {
    name: "Mua bán",
    icon: ShoppingCart,
    href: "/trading",
    tabs: [
      { name: "Nhập hàng", href: "/trading/import" },
      { name: "Bán hàng", href: "/trading/export" },
    ],
  },
  {
    name: "Nhà cung cấp",
    icon: Truck,
    href: "/suppliers",
    tabs: [],
  },
  {
    name: "Nhân sự",
    icon: Users,
    href: "/staff",
    tabs: [
      { name: "Nhân viên", href: "/staff" },
      { name: "Lịch làm việc", href: "/staff/schedule" },
    ],
  },
];