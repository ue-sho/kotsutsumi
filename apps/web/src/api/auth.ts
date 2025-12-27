import { apiClient } from './client'

export interface User {
  id: string
  username: string
  email: string
  displayName: string | null
}

export interface AuthResponse {
  user: User
}

export interface SignupRequest {
  username: string
  email: string
  password: string
  displayName?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export const authApi = {
  signup: (data: SignupRequest) =>
    apiClient.post<AuthResponse>('/auth/signup', data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  logout: () => apiClient.post<{ message: string }>('/auth/logout'),

  refresh: () => apiClient.post<{ message: string }>('/auth/refresh'),

  me: () => apiClient.get<AuthResponse>('/auth/me'),
}
