import type { Gender, StaffRole } from './enums'

/** The two independent auth systems exposed by the backend: /api/auth/student/* and /api/auth/staff/*. */
export type Portal = 'student' | 'staff'

// Matches LoginRequestDto
export interface LoginRequest {
  usernameOrEmail: string
  password: string
}

// Matches RefreshTokenRequestDto
export interface RefreshTokenRequest {
  refreshToken: string
}

// Matches RegisterStudentRequestDto
export interface RegisterStudentRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string | null
  address?: string | null
  dateOfBirth?: string | null
  gender?: Gender | null
  admissionNumber: string
  rollNumber: string
  grade: string
  section: string
  admissionDate: string
  guardianName?: string | null
  guardianPhoneNumber?: string | null
  bloodGroup?: string | null
}

// Matches RegisterStaffRequestDto
export interface RegisterStaffRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string | null
  address?: string | null
  dateOfBirth?: string | null
  gender?: Gender | null
  employeeCode: string
  role: StaffRole
  department?: string | null
  joiningDate: string
  qualification?: string | null
  salary?: number | null
}

// Matches AuthResponseDto
export interface AuthResponse {
  userId: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  accessToken: string
  accessTokenExpiresAt: string
  refreshToken: string
  refreshTokenExpiresAt: string
}

/** What's persisted client-side after login - the AuthResponse plus which portal issued it. */
export interface StoredSession extends AuthResponse {
  portal: Portal
}
