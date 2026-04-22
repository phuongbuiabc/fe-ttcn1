export interface User {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  role: 'ADMIN' | 'OWNER' | 'STAFF';
  avatarUrl?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}