export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface User {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserDto {
  name?: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
}
