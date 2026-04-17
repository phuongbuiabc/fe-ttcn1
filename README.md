# MDFARM - Quản lý Trang trại Lợn Giống

Hệ thống quản lý trang trại chăn nuôi lợn công nghệ cao, hỗ trợ theo dõi đàn, sức khỏe, sinh sản, nhân sự và vật tư.

## 🏗 Cấu trúc Thư mục (Project Structure)

Dự án được tổ chức theo kiến trúc **Domain-Driven Design (DDD)** kết hợp với mô hình **Feature-based**, giúp mã nguồn dễ bảo trì, mở rộng và chuyên nghiệp.

```text
src/
├── app/                 # Next.js App Router (Routing & Layouts)
│   ├── (auth)/          # Các route liên quan đến xác thực (login, register)
│   ├── inventory/       # Trang quản lý vật tư
│   ├── pigs/            # Trang quản lý đàn lợn
│   ├── staff/           # Trang quản lý nhân sự
│   └── ...              # Các route khác
│
├── features/            # Business Logic phức tạp theo từng tính năng
│   ├── auth/            # Xử lý Logic đăng nhập, đăng ký, phân quyền
│   ├── pigs/            # Logic quản lý lợn (Hooks xử lý dữ liệu, Components đặc thù)
│   ├── reproduction/    # Logic và UI liên quan đến sinh sản
│   └── ...              # Các Module tính năng khác
│
├── entities/            # Domain Models & Low-level API (DDD Style)
│   ├── pig/             # Định nghĩa Schema, Types và API gọi cho Pig entity
│   ├── user/            # Định nghĩa Schema và API gọi cho User entity
│   └── reproduction/    # Định nghĩa Schema cho Reproduction entity
│
├── shared/              # Tài nguyên dùng chung toàn hệ thống (Global)
│   ├── api/             # Cấu hình API Client (Axios client, base URL)
│   ├── components/      # UI Components dùng chung (Sidebar, Modal, Button...)
│   ├── hooks/           # Custom Hooks dùng chung (useMediaQuery, useDebounce...)
│   ├── lib/             # Thư viện tiện ích (utils.ts, cn helper...)
│   └── types/           # Định nghĩa Typescript Interfaces dùng chung toàn app
│
└── ...
```

### Chi tiết các tầng:

1.  **app/**: Tầng config cao nhất của Next.js. Nhiệm vụ chính là định nghĩa định tuyến (Routing) và bao bọc (Layout). Không chứa logic nghiệp vụ phức tạp.
2.  **features/**: Tầng chứa "tính năng". Đây là nơi kết hợp giữa `entities` và `shared` để tạo ra một tính năng hoàn chỉnh mà người dùng có thể tương tác (ví dụ: "Tính năng lọc lợn theo chuồng").
3.  **entities/**: Tầng chứa "thực thể". Tập trung vào cấu trúc dữ liệu của Business Domain. Chỉ chứa logic liên quan trực tiếp đến dữ liệu của thực thể đó.
4.  **shared/**: Tầng "chia sẻ". Chứa tất cả những thứ không thuộc về một domain cụ thể nào nhưng được sử dụng ở nhiều nơi. Đây là nền móng kỹ thuật của ứng dụng.

## 🚀 Công nghệ sử dụng

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript
- **State Management:** React Hooks & API Services

## 🛠 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy project ở môi trường dev
npm run dev
```

---
*MDFARM v2.0 - Professional Agriculture Management System*
