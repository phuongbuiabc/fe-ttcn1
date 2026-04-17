// services/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://maodien.bitoj.io.vn';

class ApiClient {
  private static instance: ApiClient;
  
  private constructor() {}

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = typeof window !== 'undefined' ? '/api/proxy' : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `${baseUrl}${cleanEndpoint}`.replace(/([^:]\/)\/+/g, "$1");

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || `Error ${response.status}`);
      }

      return data as T;
    } catch (error) {
      console.error(`API Request Error [${fullUrl}]:`, error);
      throw error;
    }
  }
}

export const apiClient = ApiClient.getInstance();
