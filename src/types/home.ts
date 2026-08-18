import type { StaffRole } from './enums'

// Matches StudentHomeInfoDto
export interface StudentHomeInfo {
  studentId: number
  admissionNumber: string
  grade: string
  section: string
  rollNumber: string
  attendancePercentage: number
  upcomingExamsCount: number
}

// Matches StaffHomeInfoDto
export interface StaffHomeInfo {
  employeeCode: string
  role: StaffRole
  department?: string | null
  totalActiveStudents: number
}

// Matches HomeDto - GET /api/home
export interface Home {
  userId: number
  fullName: string
  role: string
  email: string
  profileImageUrl?: string | null
  greeting: string
  studentInfo?: StudentHomeInfo | null
  staffInfo?: StaffHomeInfo | null
}
