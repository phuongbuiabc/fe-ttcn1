import { tokenStorage } from '@/modules/auth/utils/tokenStorage';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://maodien.bitoj.io.vn';

export class ApiClient {
  private static instance: ApiClient;
  private refreshPromise: Promise<string> | null = null;

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getBaseUrl() {
    return typeof window !== 'undefined' ? '/api/proxy' : API_URL;
  }

  private getHeaders(): HeadersInit {
    const token = tokenStorage.getAccessToken();

    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // =====================
  // REFRESH TOKEN
  // =====================
  private async refreshToken(): Promise<string> {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      tokenStorage.clear();
      window.location.href = '/login';
      throw new Error('Missing refresh token');
    }

    const res = await fetch(`/api/proxy/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const json = await res.json().catch(() => ({}));
    const data = json?.data;

    if (!res.ok || !data?.accessToken) {
      tokenStorage.clear();
      window.location.href = '/login';
      throw new Error('Refresh token failed');
    }

    tokenStorage.setTokens(data.accessToken, data.refreshToken);

    return data.accessToken;
  }

  // =====================
  // REQUEST CORE
  // =====================
  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`;

    let response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    // =====================
    // HANDLE 401
    // =====================
    if (response.status === 401) {
      try {
        if (!this.refreshPromise) {
          this.refreshPromise = this.refreshToken().finally(() => {
            this.refreshPromise = null;
          });
        }

        const newToken = await this.refreshPromise;

        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
          },
        });
      } catch (err) {
        tokenStorage.clear();
        window.location.href = '/login';
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

    return data as T;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = ApiClient.getInstance();