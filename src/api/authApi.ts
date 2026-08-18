import { apiClient } from './client'
import type {
  AuthResponse,
  LoginRequest,
  Portal,
  RefreshTokenRequest,
  RegisterStaffRequest,
  RegisterStudentRequest,
} from '@/types'

// POST /api/auth/student/login | /api/auth/staff/login
export async function login(portal: Portal, request: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(`/auth/${portal}/login`, request)
  return data
}

// POST /api/auth/student/register
export async function registerStudent(request: RegisterStudentRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/student/register', request)
  return data
}

// POST /api/auth/staff/register
export async function registerStaff(request: RegisterStaffRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/staff/register', request)
  return data
}

// POST /api/auth/{portal}/revoke-token
export async function revokeToken(portal: Portal, request: RefreshTokenRequest): Promise<void> {
  await apiClient.post(`/auth/${portal}/revoke-token`, request)
}
