"use client";

import React from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  CreditCard,
  ChevronRight,
  LogOut,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { 
    title: "Tài khoản", 
    icon: User, 
    items: [
      { name: "Thông tin cá nhân", desc: "Cập nhật tên, email và ảnh đại diện của bạn." },
      { name: "Mật khẩu & Bảo mật", desc: "Thay đổi mật khẩu và thiết lập 2FA." }
    ]
  },
  { 
    title: "Thông báo", 
    icon: Bell, 
    items: [
      { name: "Cài đặt thông báo", desc: "Quản lý cách bạn nhận thông báo từ hệ thống." }
    ]
  },
  { 
    title: "Dữ liệu & Quyền riêng tư", 
    icon: Shield, 
    items: [
      { name: "Sao lưu dữ liệu", desc: "Thiết lập lịch sao lưu tự động cho trang trại." },
      { name: "Quyền truy cập", desc: "Quản lý quyền của nhân viên và đối tác." }
    ]
  },
  { 
    title: "Thanh toán", 
    icon: CreditCard, 
    items: [
      { name: "Gói dịch vụ", desc: "Bạn đang sử dụng gói Chuyên Gia." },
      { name: "Phương thức thanh toán", desc: "Quản lý thẻ và hóa đơn của bạn." }
    ]
  }
];

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-manrope tracking-tight">Cài đặt hệ thống</h2>
          <p className="text-gray-500 mt-2 font-medium">Quản lý tài khoản và cấu hình ứng dụng AgriIntel của bạn.</p>
        </div>
        <button className="px-6 py-3 bg-[#006c49] text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
          <Save size={18} />
          Lưu thay đổi
        </button>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 flex items-center gap-4 border-b border-gray-50">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <section.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-manrope">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {section.items.map((item) => (
                <button key={item.name} className="w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-all group">
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#006c49] transition-colors">{item.name}</p>
                    <p className="text-xs font-medium text-gray-400 mt-1">{item.desc}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-[#006c49] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full p-8 bg-red-50 text-red-600 rounded-[2.5rem] flex items-center justify-center gap-3 font-bold text-sm hover:bg-red-100 transition-all border border-red-100">
          <LogOut size={20} />
          Đăng xuất tài khoản
        </button>
      </div>
    </div>
  );
}
