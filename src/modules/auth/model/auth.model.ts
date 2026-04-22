export interface User {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  role: 'ADMIN' | 'OWNER' | 'STAFF';
  avatarUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}
