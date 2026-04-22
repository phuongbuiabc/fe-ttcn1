import { tokenStorage } from '@/modules/auth/utils/token';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://maodien.bitoj.io.vn';

export class ApiClient {
  private static instance: ApiClient;
  private isRefreshing = false;
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

  private async refreshToken(): Promise<string> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const res = await fetch(`/api/proxy/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok || !data?.data?.accessToken) {
      throw new Error('Refresh token failed');
    }

    tokenStorage.setTokens(
      data.data.accessToken,
      data.data.refreshToken
    );

    return data.data.accessToken;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    let response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      try {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = this.refreshToken();
        }

        const newToken = await this.refreshPromise;
        this.isRefreshing = false;

        // retry request
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } catch (err) {
        this.isRefreshing = false;
        tokenStorage.clear();
        if (typeof window !== 'undefined') {
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

    return data as T;
  }

  public get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = ApiClient.getInstance();