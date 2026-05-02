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
    return /\/api\/v1\/auth\/(login|register|refresh-token)(?:\?|$)/i.test(
      endpoint
    );
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

  private getHeaders(): HeadersInit {
    const token = tokenStorage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // ===== REFRESH TOKEN =====
  private async refreshToken(): Promise<string> {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      console.error('Missing refresh token');
      throw new Error('Missing refresh token');
    }

    const res = await fetch(`/api/proxy/api/v1/auth/refresh-token`, {
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
        ...this.getHeaders(),
        ...fetchOptions.headers,
      },
    });

    // ===== HANDLE 401 =====
    if (response.status === 401 && !options._retry && !this.isAuthEndpoint(endpoint)) {
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
        console.error('REFRESH FAILED:', err);

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