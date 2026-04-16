// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Auth APIs
export const authApi = {
  login: (credentials: any) => apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (data: any) => apiRequest('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getMe: () => apiRequest('/api/v1/users/me'),
};

// Pig APIs
export const pigApi = {
  getAll: (status?: string) => apiRequest(`/api/v1/pigs${status ? `?status=${status}` : ''}`),
  getById: (id: string) => apiRequest(`/api/v1/pigs/${id}`),
  create: (data: any) => apiRequest('/api/v1/pigs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/api/v1/pigs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/api/v1/pigs/${id}`, {
    method: 'DELETE',
  }),
};

// Warehouse APIs
export const warehouseApi = {
  getAll: () => apiRequest('/api/v1/warehouses'),
  getById: (id: string) => apiRequest(`/api/v1/warehouses/${id}`),
  create: (data: any) => apiRequest('/api/v1/warehouses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// ... similar for other entities as needed
