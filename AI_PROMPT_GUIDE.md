# 🤖 AI Prompt Guide - MDFARM Frontend

**Mục đích**: File này định nghĩa quy tắc & convention để khi prompt AI (Copilot) thêm module mới, chỉnh sửa feature, hoặc fix bug, AI sẽ tuân thủ convention và không viết lại những hàm/component đã có.

**Sử dụng**: Copy nội dung hoặc dán link vào prompt trước khi yêu cầu AI giúp code.

---

## ⚠️ QUY TẮC BẮTBUỘC

### 1. **KHÔNG VIẾT LẠI CÁC HÀM ĐÃ CÓ**

Nếu hàm/component/hook đã tồn tại, chỉ **sửa/bổ sung** nó, **KHÔNG viết lại hoàn toàn**.

❌ **SAI**: Viết lại toàn bộ `usePig()` hook
✅ **ĐÚNG**: Chỉ thêm method mới vào `usePig()` hook

### 2. **TUÂN THỰ CẤU TRÚC MODULE CỒN**

Mỗi module phải có cấu trúc như sau, **KHÔNG được bỏ bất kỳ folder nào**:

```
modules/[moduleName]/
├── index.ts              # Re-export chính
├── api/
│   └── [name].service.ts # Service CRUD (gọi apiClient)
├── model/
│   └── [name].model.ts   # DTO interfaces (Request/Response)
├── hooks/
│   └── use[Name].ts      # React hooks cho state & data fetch
├── ui/
│   ├── [Name]Form.tsx
│   ├── [Name]Table.tsx
│   ├── [Name]Detail.tsx
│   └── ...
├── utils/
│   └── [name]Helpers.ts  # Business logic helpers
├── constants/            # Optional
└── config/               # Optional
```

### 3. **TUÂN THỰ NAMING CONVENTION**

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| **Module** | kebab-case (thư mục) | `culling-proposal` |
| **Service** | camelCase + `.service.ts` | `pigService`, `cullingProposalService` |
| **Hook** | `use` + PascalCase | `usePig()`, `useCullingProposal()` |
| **Component** | PascalCase + `.tsx` | `PigForm.tsx`, `PigTable.tsx` |
| **Type/Interface** | PascalCase | `PigResponse`, `CreatePigRequest` |
| **Enum** | PascalCase + `.enum.ts` | `PigStatus`, `CullingProposalType` |

### 4. **TUÂN THỰ DATA FLOW**

**Luôn tuân theo workflow này**:

```
Component (UI) 
    ↓ calls
Hook (usePig)
    ↓ calls
Service (pigService)
    ↓ calls
ApiClient
    ↓ HTTP request
Backend
```

**KHÔNG ĐƯỢC**:
- ❌ Gọi `apiClient` trực tiếp từ component
- ❌ Gọi `apiClient` từ hook mà không qua service
- ❌ Để business logic trong component

### 5. **QUI TẮC ĐẶT TÊN SERVICE METHOD**

```typescript
// ✅ ĐÚNG
getAll: () => apiClient.get<ApiResponse<T[]>>(...)
getById: (id) => apiClient.get<ApiResponse<T>>(...)
create: (data) => apiClient.post<ApiResponse<T>>(...)
update: (id, data) => apiClient.put<ApiResponse<T>>(...)
delete: (id) => apiClient.delete<ApiResponse<void>>(...)
createBulk: (data[]) => apiClient.post<ApiResponse<T[]>>(...)

// ❌ SAI
fetchAll: () => ...
getPig: (id) => ...  // Nên là getById
addPig: (data) => ... // Nên là create
editPig: (id, data) => ... // Nên là update
removePig: (id) => ... // Nên là delete
```

### 6. **QUI TẮC ĐẶT TÊN HOOK METHOD**

```typescript
// ✅ ĐÚNG
const {
  pigs,              // State
  pigDetail,
  loadingList,
  loadingDetail,
  
  fetchPigs,         // Fetch methods
  fetchPigDetail,
  
  createPig,         // Mutation methods
  updatePig,
  deletePig,
} = usePig();

// ❌ SAI
const {
  pig,                    // Nhầm tên
  loading,               // Quá chung chung
  handleFetch,           // Prefix sai
  submitCreatePig,       // Quá dài
} = usePig();
```

### 7. **TUÂN THỰ ERROR HANDLING**

```typescript
// ✅ ĐÚNG
const handleSubmit = async () => {
  try {
    const res = await service.create(data);
    if (res.success) {
      // Update state
    } else {
      // Handle error response
      alert(res.message || 'Lỗi không xác định');
    }
  } catch (error) {
    console.error('Failed:', error);
    alert('Lỗi hệ thống');
  }
};

// ❌ SAI
const handleSubmit = async () => {
  const res = await service.create(data);  // Không try-catch
  // Không check res.success
};
```

### 8. **TUÂN THỰ LOADING STATE NAMING**

```typescript
// ✅ ĐÚNG
const [loadingList, setLoadingList] = useState(false);
const [loadingDetail, setLoadingDetail] = useState(false);
const [loadingCreate, setLoadingCreate] = useState(false);

// ❌ SAI
const [isLoading, setIsLoading] = useState(false);      // Quá chung chung
const [loading, setLoading] = useState(false);          // Quá chung chung
const [submitLoading, setSubmitLoading] = useState(false); // Prefix sai
```

### 9. **TUÂN THỰ TYPE DEFINITION**

```typescript
// ✅ ĐÚNG - Tách rõ Request & Response
export interface CreatePigRequest {
  earTag?: string;
  birthWeight?: number;
  type: PigType;
}

export interface PigResponse {
  id: string;
  earTag?: string;
  birthWeight?: number;
  type: PigType;
  createdAt: string;
  updatedAt: string;
}

// ❌ SAI - Trộn Request & Response
export interface Pig {
  id?: string;  // Optional nếu create, required nếu response
  earTag?: string;
  // Khó maintain
}
```

### 10. **TUÂN THỰ IMPORT PATHS**

```typescript
// ✅ ĐÚNG - Dùng alias @
import { pigService } from '@/modules/pig/api/pig.service';
import { usePig } from '@/modules/pig/hooks/usePig';
import { PigResponse } from '@/modules/pig/model/pig.model';
import { apiClient } from '@/shared/api/api-client';
import { User } from '@/shared/types';

// ❌ SAI - Dùng relative paths
import { pigService } from '../../../modules/pig/api/pig.service';
import { PigResponse } from '@/modules/pig/model/pig.model';  // Tuỳ lúc
```

---

## 📋 CHECKLIST TRƯỚC KHI PROMPT AI

Trước khi prompt AI, hãy kiểm tra:

- [ ] **Đã xác định rõ scope** (thêm module mới hay sửa module cũ?)
- [ ] **Đã read file hiện tại** (nếu sửa module cũ)
- [ ] **Biết chính xác endpoint backend** (endpoint thực tế, HTTP method)
- [ ] **Biết DTO Request/Response** (kiểu dữ liệu từ backend)
- [ ] **Có list các dependencies** (dependencies cần import)
- [ ] **Rõ UI requirement** (form fields, table columns, etc.)
- [ ] **Đã copy CODING_GUIDELINES vào prompt** (bắt buộc!)

---

## 🎯 TEMPLATE PROMPT ĐỦ

### Template 1: Thêm Module Mới

```
---COPY TOÀN BỘ NỘI DUNG FILE CODING_GUIDELINES VÀO ĐÂY---

## YÊU CẦU

Thêm module mới: **[moduleName]**

### 1. Backend Endpoint
- GET /api/v1/[name] → Lấy list
- POST /api/v1/[name] → Tạo
- GET /api/v1/[name]/{id} → Chi tiết
- PUT /api/v1/[name]/{id} → Update
- DELETE /api/v1/[name]/{id} → Xóa

### 2. DTO
```typescript
export interface Create[Name]Request {
  field1: string;
  field2: number;
}

export interface [Name]Response {
  id: string;
  field1: string;
  field2: number;
  createdAt: string;
  updatedAt: string;
}
```

### 3. UI Requirements
- Form để tạo/edit
- Table để list
- Detail view
- Search/filter

---

### 4. Step by Step
1. Tạo thư mục structure
2. Định nghĩa models
3. Tạo service
4. Tạo hook
5. Tạo UI components
6. (Optional) Thêm enum nếu cần

**GHI CHÚ**: Tuân thủ 100% quy tắc trong CODING_GUIDELINES.
```

### Template 2: Sửa Module Cũ / Thêm Feature

```
---COPY TOÀN BỘ NỘI DUNG FILE CODING_GUIDELINES VÀO ĐÂY---

## YÊU CẦU

Sửa module: **[moduleName]**

### 1. Chi tiết thay đổi
- Thêm method mới: [method name]
- Sửa component: [component name]
- Thêm field: [field name]

### 2. Backend endpoint
- [HTTP METHOD] /api/v1/[endpoint]

### 3. DTO thay đổi
- Thêm field: [field name] : [type]
- Remove field: [field name]

### 4. UI requirement
- [Mô tả]

### 5. CÓ ĐỌC FILE HIỆN TẠI CHƯA?
- [ ] Yes, đã đọc [file path]
- [ ] No, hãy đọc [file path] trước

**GHI CHÚ**: 
- KHÔNG viết lại hàm đã có, chỉ sửa/thêm
- Tuân thủ 100% quy tắc trong CODING_GUIDELINES
- Dùng type/interface đã tồn tại (shared/types/)
- Dùng enum đã tồn tại nếu có
```

### Template 3: Fix Bug / Refactor

```
---COPY TOÀN BỘ NỘI DUNG FILE CODING_GUIDELINES VÀO ĐÂY---

## YÊU CẦU

Fix bug / Refactor: **[mô tả ngắn gọn]**

### 1. File hiện tại (HÃY ĐỌC TRƯỚC!)
[Dán code của file hiện tại]

### 2. Problem
[Mô tả lỗi/vấn đề]

### 3. Solution
[Đề xuất cách sửa]

### 4. Constraints
- Không thay đổi method signature
- Không thay đổi exports
- Giữ nguyên naming convention

**GHI CHÚ**: 
- Tuân thủ 100% quy tắc trong CODING_GUIDELINES
- Chỉ sửa/bổ sung, KHÔNG viết lại
```

---

## 📚 CÁC FILE/COMPONENT KHÔNG ĐƯỢC VIẾT LẠI

**Dưới đây là các hàm/component đã tối ưu & không được viết lại:**

### Shared Layer (Cấm sửa)

| File | Hàm | Ghi chú |
|------|-----|--------|
| `shared/api/api-client.ts` | `ApiClient` class | Singleton pattern - cấm viết lại |
| `shared/components/AuthProvider.tsx` | `AuthProvider`, `useAuth` | Auth logic - chỉ sửa nếu cần thêm field user |
| `shared/components/DashboardLayout.tsx` | `DashboardLayout` | Layout chính - chỉ sửa giao diện |

### Existing Modules (Cấm viết lại hoàn toàn)

| Module | File | Hàm/Component | Ghi chú |
|--------|------|---|---------|
| `pig` | `api/pig.service.ts` | `pigService` | Có sẵn CRUD - chỉ thêm method nếu cần |
| `pig` | `hooks/usePig.ts` | `usePig()` | Có tất cả fetch methods - chỉ thêm nếu cần |
| `cullingproposal` | `ui/CullingproposalForm.tsx` | `CullingProposalForm` | Form phức tạp - chỉ sửa UI |
| `auth` | `api/auth.service.ts` | `authService` | Login/Register - **KHÔNG SỬA** |
| `auth` | `hooks/useAuth.ts` | `useAuth()` | Auth hook - chỉ thêm method nếu cần |

### Convention Files (Tham khảo, không sửa)

| File | Ghi chú |
|------|--------|
| `shared/types/index.ts` | Define chung - chỉ thêm type mới |
| `shared/enums/` | Define chung - chỉ thêm enum mới |
| `next.config.ts` | Config - chỉ sửa nếu cần Next.js config |
| `tsconfig.json` | Config - **KHÔNG SỬA** |
| `tailwind.config.ts` | Config - **KHÔNG SỬA** |

---

## 💡 TIPS KHI PROMPT

### 1. **Luôn Copy CODING_GUIDELINES Vào Prompt**
```
Hãy tuân thủ CODING_GUIDELINES đính kèm dưới:

[COPY TOÀN BỘ CONTENT CỦA FILE NÀY]

YÊU CẦU: ...
```

### 2. **Cung Cấp Context Đủ**
```
✅ TỐTƠI muốn thêm một endpoint để export list pigs thành CSV.
   Backend endpoint: GET /api/v1/pigs/export?format=csv
   Response: { success: true, data: "CSV content as string" }
   
❌ SAI: "Thêm export feature"
```

### 3. **Chỉ Rõ File Cần Sửa**
```
✅ TỐT: Cần sửa file src/modules/pig/hooks/usePig.ts
        Thêm method fetchPigsByBreed(breedId: string)

❌ SAI: "Thêm filter theo breed"
```

### 4. **Cung Cấp Endpoint Backend Chi Tiết**
```
✅ TỐT: 
- Method: GET
- Endpoint: /api/v1/pigs/by-breed/{breedId}
- Response: { success: true, data: PigResponse[] }

❌ SAI: "Lấy lợi theo breed"
```

### 5. **Dán Code Hiện Tại Nếu Sửa Module Cũ**
```
✅ TỐT: Dán toàn bộ code file hiện tại trước khi sửa

❌ SAI: Chỉ describe, không dán code
```

### 6. **Nêu Rõ Dependencies**
```
✅ TỐT:
- Dùng PigResponse type từ shared/types
- Dùng PigStatus enum từ shared/enums
- Dùng apiClient từ shared/api

❌ SAI: Không nêu dependencies
```

---

## 🚨 CÁC LỖI THƯỜNG GẶP & CÁCH TRÁNH

### Lỗi 1: AI viết lại hook hoàn toàn

```
❌ SAI: "Sửa usePig() hook"
   → AI viết lại toàn bộ hook

✅ ĐÚNG: "Thêm method fetchPigsByBreed() vào usePig() hook
   Endpoint: GET /api/v1/pigs/by-breed/{breedId}
   Response: { success: true, data: PigResponse[] }
   
   HÃY ĐỌC FILE HIỆN TẠI VÀ CHỈ THÊM METHOD MỚI"
```

### Lỗi 2: AI quên layer architecture

```
❌ SAI: AI gọi apiClient trực tiếp từ component

✅ ĐÚNG: "Phải gọi qua service layer trước:
1. Thêm method trong pig.service.ts
2. Thêm method trong usePig() hook
3. Component dùng hook method thôi"
```

### Lỗi 3: AI sử dụng sai naming convention

```
❌ SAI: 
- fetchPigByBreed() thay vì getByBreed()
- getPigsWithBreed() thay vì getByBreed()
- loadingBreedFilter thay vì loadingList

✅ ĐÚNG: Lúc prompt nêu rõ naming convention:
"Method service: getByBreed(breedId)
 Method hook: fetchPigsByBreed(breedId)
 Loading state: loadingList"
```

### Lỗi 4: AI định nghĩa type sai

```
❌ SAI: 
export interface Pig {
  id?: string;  // Optional, nhầm
  name: string;
}

✅ ĐÚNG: "Tách riêng Request & Response:
export interface CreatePigRequest {
  name: string;  // Không có id
}
export interface PigResponse {
  id: string;    // Luôn có id
  name: string;
  createdAt: string;
}"
```

### Lỗi 5: Quên error handling

```
❌ SAI: 
const res = await pigService.create(data);
setState(res.data);  // Không check res.success

✅ ĐÚNG: "Thêm try-catch & check res.success:
try {
  const res = await pigService.create(data);
  if (res.success) {
    setState(res.data);
  } else {
    alert(res.message || 'Error');
  }
} catch (error) {
  console.error('Failed:', error);
  alert('System error');
}"
```

---

## 📖 REFERENCE

### Cấu trúc module hoàn chỉnh (dùng như template)

```typescript
// ===== pig/model/pig.model.ts =====
export interface CreatePigRequest {
  earTag?: string;
  birthWeight?: number;
  type: PigType;
}

export interface PigResponse {
  id: string;
  earTag?: string;
  birthWeight?: number;
  type: PigType;
  createdAt: string;
  updatedAt: string;
}

// ===== pig/api/pig.service.ts =====
export const pigService = {
  getAll: () =>
    apiClient.get<ApiResponse<PigResponse[]>>('/api/v1/pigs'),
  
  getById: (id: string) =>
    apiClient.get<ApiResponse<PigResponse>>(`/api/v1/pigs/${id}`),
  
  create: (data: CreatePigRequest) =>
    apiClient.post<ApiResponse<PigResponse>>('/api/v1/pigs', data),
  
  update: (id: string, data: CreatePigRequest) =>
    apiClient.put<ApiResponse<PigResponse>>(`/api/v1/pigs/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/api/v1/pigs/${id}`),
};

// ===== pig/hooks/usePig.ts =====
export function usePig() {
  const [pigs, setPigs] = useState<PigResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPigs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pigService.getAll();
      if (res.success) setPigs(res.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPig = useCallback(async (data: CreatePigRequest) => {
    try {
      const res = await pigService.create(data);
      if (res.success) setPigs(prev => [...prev, res.data]);
      return res;
    } catch (error) {
      console.error('Failed to create:', error);
      throw error;
    }
  }, []);

  return { pigs, loading, fetchPigs, createPig };
}

// ===== pig/ui/PigForm.tsx =====
export const PigForm: React.FC<Props> = ({ onSuccess }) => {
  const { createPig } = usePig();
  const [formData, setFormData] = useState<CreatePigRequest>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await createPig(formData);
      if (res.success) {
        alert('Success!');
        onSuccess?.();
      }
    } catch (error) {
      alert('Failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      {/* form fields */}
    </form>
  );
};
```

---

## ✨ SUMMARY

| Làm | Không Làm |
|-----|-----------|
| ✅ Tuân thủ folder structure | ❌ Tạo folder riêng biệt |
| ✅ Tách rõ Request & Response | ❌ Trộn Request/Response |
| ✅ Gọi qua service layer | ❌ Gọi apiClient từ component |
| ✅ Naming convention chuẩn | ❌ Tự định nghĩa tên |
| ✅ Error handling đầy đủ | ❌ Ignore errors |
| ✅ Dùng type đã tồn tại | ❌ Tạo type trùng |
| ✅ Chỉ sửa/thêm | ❌ Viết lại hoàn toàn |
| ✅ Import dùng @ alias | ❌ Dùng relative path |

---

**Last Updated**: May 2026
**Project**: MDFARM Frontend
**Version**: 1.0
