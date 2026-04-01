// auth.ts
export type UserRole = 'User' | 'Moderator' | 'Admin' | 'SuperAdmin';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  role: UserRole;
}

export interface AuthUser {
  userId: string;
  role: UserRole;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
