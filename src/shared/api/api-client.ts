import { tokenStorage } from '@/modules/auth/utils/tokenStorage';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://maodien.bitoj.io.vn';

type QueryParamValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;
type ApiRequestOptions = RequestInit & { _retry?: boolean; params?: QueryParams };

export class ApiClient {
  private static instance: ApiClient;
  private refreshPromise: Promise<string> | null = null;

  private isAuthEndpoint(endpoint: string): boolean {
    // Chấp nhận cả /auth/login và /api/v1/auth/login
    return /(?:\/api\/v1)?\/auth\/(login|register|refresh-token)(?:\?|$)/i.test(
      endpoint
    );
  }

  private logClientAction(method: string, endpoint: string, success: boolean) {
    if (typeof window === 'undefined' || !success) return;

    const upperMethod = method.toUpperCase();
    if (!['POST', 'PUT', 'DELETE'].includes(upperMethod)) return;

    if (this.isAuthEndpoint(endpoint)) return;

    let actionTitle = '';
    let logCategory = 'info'; 
    let description = '';

    const normEndpoint = endpoint.toLowerCase();

    if (normEndpoint.includes('/employees') || normEndpoint.includes('/staff')) {
      if (upperMethod === 'POST') {
        actionTitle = "Thêm nhân viên mới";
        description = "Nhân viên mới đã được thêm vào hệ thống nhân sự.";
        logCategory = "success";
      } else if (upperMethod === 'PUT') {
        actionTitle = "Cập nhật hồ sơ nhân sự";
        description = "Thông tin chi tiết nhân viên đã được cập nhật.";
        logCategory = "info";
      } else if (upperMethod === 'DELETE') {
        actionTitle = "Xóa hồ sơ nhân sự";
        description = "Một hồ sơ nhân viên đã được gỡ bỏ.";
        logCategory = "warning";
      }
    } else if (normEndpoint.includes('/work-schedules') || normEndpoint.includes('/schedule')) {
      if (upperMethod === 'POST') {
        actionTitle = "Phân công lịch làm việc";
        description = "Đã lên ca trực mới và gán nhân sự thực hiện.";
        logCategory = "info";
      } else if (upperMethod === 'PUT') {
        actionTitle = "Cập nhật lịch trực";
        description = "Một ca trực đã được điều chỉnh chi tiết công việc.";
        logCategory = "info";
      } else if (upperMethod === 'DELETE') {
        actionTitle = "Hủy ca trực";
        description = "Một lịch làm việc đã bị hủy bỏ khỏi hệ thống.";
        logCategory = "warning";
      }
    } else if (normEndpoint.includes('/pigs') || normEndpoint.includes('/herds')) {
      if (upperMethod === 'POST') {
        actionTitle = "Thêm đàn lợn mới";
        description = "Thêm bản ghi thông tin tai lợn giống/lợn thịt.";
        logCategory = "success";
      } else if (upperMethod === 'PUT') {
        actionTitle = "Cập nhật thông tin đàn lợn";
        description = "Thông tin giống hoặc số tai đàn lợn đã được thay đổi.";
        logCategory = "info";
      } else if (upperMethod === 'DELETE') {
        actionTitle = "Xóa bản ghi lợn";
        description = "Đã gỡ bỏ bản ghi thông tin lợn giống khỏi hệ thống.";
        logCategory = "warning";
      }
    } else if (normEndpoint.includes('/mating')) {
      actionTitle = "Ghi nhận phối giống";
      description = "Đã nhập lịch sử phối giống mới cho heo nái.";
      logCategory = "success";
    } else if (normEndpoint.includes('/pregnancy') || normEndpoint.includes('/farrowing')) {
      actionTitle = "Cập nhật trạng thái sinh sản";
      description = "Đã cập nhật tình trạng khám thai hoặc ngày sinh đàn heo con.";
      logCategory = "info";
    } else if (normEndpoint.includes('/growth') || normEndpoint.includes('/tracking')) {
      actionTitle = "Ghi nhận chỉ số tăng trưởng";
      description = "Đã đo đạc và cập nhật cân nặng, vòng ngực đàn lợn.";
      logCategory = "success";
    } else if (normEndpoint.includes('/supplies') || normEndpoint.includes('/inventory')) {
      if (upperMethod === 'POST') {
        actionTitle = "Thêm vật tư mới";
        description = "Đã thêm danh mục thức ăn chăn nuôi hoặc thuốc thú y mới.";
        logCategory = "success";
      } else {
        actionTitle = "Cập nhật vật tư";
        description = "Thay đổi thông tin danh mục vật tư trong kho.";
        logCategory = "info";
      }
    } else if (normEndpoint.includes('/import') || normEndpoint.includes('/export')) {
      const isImport = normEndpoint.includes('/import');
      actionTitle = isImport ? "Nhập kho vật tư" : "Xuất kho vật tư";
      description = isImport ? "Đã nhập hàng hóa cám ăn, thuốc hoặc vaccine mới vào kho." : "Đã xuất thuốc điều trị hoặc cám ăn để chăn nuôi.";
      logCategory = isImport ? "success" : "warning";
    } else if (normEndpoint.includes('/settings')) {
      actionTitle = "Cập nhật cài đặt cấu hình";
      description = "Hệ thống cấu hình chung hoặc cài đặt nhận thông báo đã thay đổi.";
      logCategory = "info";
    }

    if (!actionTitle) {
      actionTitle = `${upperMethod === 'POST' ? 'Thêm mới' : upperMethod === 'PUT' ? 'Cập nhật' : 'Xóa bỏ'} dữ liệu`;
      description = `Hành động thực hiện thành công trên tài nguyên: ${endpoint}`;
      logCategory = "info";
    }

    // 1. Push notification
    const savedNotifs = localStorage.getItem("mdfarm_system_notifications");
    let notifications = [];
    if (savedNotifs) {
      try { notifications = JSON.parse(savedNotifs); } catch (e) {}
    }
    const newNotif = {
      id: "notif-" + Math.random().toString(36).substring(2, 11),
      title: actionTitle,
      description: description,
      time: "Vừa xong",
      type: logCategory,
      read: false
    };
    localStorage.setItem("mdfarm_system_notifications", JSON.stringify([newNotif, ...notifications].slice(0, 20)));

    // 2. Push activity log
    const savedLogs = localStorage.getItem("mdfarm_activity_logs");
    let logs = [];
    if (savedLogs) {
      try { logs = JSON.parse(savedLogs); } catch (e) {}
    }
    const newLog = {
      id: "log-" + Math.random().toString(36).substring(2, 11),
      action: actionTitle,
      ip: "113.190.233.45",
      device: "Chrome / Windows 11",
      time: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
      status: "Thành công"
    };
    localStorage.setItem("mdfarm_activity_logs", JSON.stringify([newLog, ...logs].slice(0, 50)));

    // 3. Dispatch global sync event
    window.dispatchEvent(new CustomEvent("mdfarm-notifications-updated"));
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getBaseUrl() {
    const base = typeof window !== 'undefined' ? '/api/proxy' : API_URL;
    return base.replace(/\/+$/, '');
  }

  private normalizeEndpoint(endpoint: string): string {
    if (/^https?:\/\//i.test(endpoint)) return endpoint;

    const trimmedEndpoint = endpoint.trim();
    const withLeadingSlash = trimmedEndpoint.startsWith('/')
      ? trimmedEndpoint
      : `/${trimmedEndpoint}`;

    if (
      withLeadingSlash === '/api/v1' ||
      withLeadingSlash.startsWith('/api/v1/') ||
      withLeadingSlash.startsWith('/api/')
    ) {
      return withLeadingSlash;
    }

    return `/api/v1${withLeadingSlash}`;
  }

  private buildUrl(endpoint: string, params?: QueryParams): string {
    const normalizedEndpoint = this.normalizeEndpoint(endpoint);
    const baseUrl = this.getBaseUrl();
    const url = /^https?:\/\//i.test(normalizedEndpoint)
      ? normalizedEndpoint
      : `${baseUrl}${normalizedEndpoint}`;

    if (!params) return url;

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== null && item !== undefined) {
            searchParams.append(key, String(item));
          }
        });
        return;
      }

      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const query = searchParams.toString();
    if (!query) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${query}`;
  }

  private getHeaders(endpoint: string): HeadersInit {
    // Nếu là endpoint auth, tuyệt đối KHÔNG gửi Authorization header
    if (this.isAuthEndpoint(endpoint)) {
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
    }

    const token = tokenStorage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // ===== REFRESH TOKEN =====
  private async refreshToken(): Promise<string> {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      // Thay vì throw error làm chết app, chúng ta trả về thông báo để đẩy người dùng về login
      return Promise.reject('SESSION_EXPIRED');
    }

    const url = this.buildUrl('/auth/refresh-token');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.data?.accessToken) {
      throw new Error('Refresh token failed');
    }

    const newAccessToken = data.data.accessToken;
    const nextRefreshToken = data.data.refreshToken || refreshToken;

    tokenStorage.setTokens(newAccessToken, nextRefreshToken);

    return newAccessToken;
  }

  // ===== MAIN REQUEST =====
  public async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    let response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...this.getHeaders(endpoint),
        ...fetchOptions.headers,
      },
    });

    // ===== HANDLE 401 =====
    if (response.status === 401 && !options._retry) {
      // Nếu là endpoint login/register mà lỗi 401 thì là sai pass/user, trả về lỗi luôn
      if (this.isAuthEndpoint(endpoint)) {
        const data = await response.json().catch(() => ({}));
        let errMsg = data.message || "Tài khoản hoặc mật khẩu không chính xác";
        
        // Xử lý lỗi tréo ngoe từ backend
        if (errMsg.includes("Bạn cần đăng nhập")) {
          errMsg = "Thông tin đăng nhập không chính xác hoặc tài khoản không tồn tại";
        }

        return {
          success: false,
          message: errMsg,
        } as any;
      }

      try {
        if (!this.refreshPromise) {
          this.refreshPromise = this.refreshToken().finally(() => {
            this.refreshPromise = null;
          });
        }

        const newToken = await this.refreshPromise;
        
        // ===== RETRY REQUEST =====
        response = await fetch(url, {
          ...fetchOptions,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
            ...fetchOptions.headers,
          },
        });
      } catch (err) {
        if (err === 'SESSION_EXPIRED') {
          console.warn('Session expired, clearing tokens...');
        } else {
          console.error('REFRESH FAILED:', err);
        }

        tokenStorage.clear();

        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }

        throw err;
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error ${response.status}`,
      } as any;
    }

    const method = options.method || 'GET';
    const isSuccess = data && (data.success !== false);
    this.logClientAction(method, endpoint, isSuccess);

    return data as T;
  }

  // ===== METHODS =====
  public get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...(options || {}), method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, {
      ...(options || {}),
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, {
      ...(options || {}),
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...(options || {}), method: 'DELETE' });
  }
}

export const apiClient = ApiClient.getInstance();