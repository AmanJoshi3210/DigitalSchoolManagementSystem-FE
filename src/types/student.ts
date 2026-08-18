import type { EducationLevel, EnrollmentStatus, Gender } from './enums'

// Matches StudentDto
export interface Student {
  id: number
  userId: number
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string | null
  address?: string | null
  dateOfBirth?: string | null
  gender?: Gender | null
  profileImageUrl?: string | null
  admissionNumber: string
  rollNumber: string
  grade: string
  section: string
  admissionDate: string
  guardianName?: string | null
  guardianPhoneNumber?: string | null
  bloodGroup?: string | null
  educationLevel?: EducationLevel | null
  isActive: boolean
}

// Matches UpdateOwnProfileDto - fields a student may edit on their own profile
export interface UpdateOwnProfileRequest {
  firstName: string
  lastName: string
  phoneNumber?: string | null
  address?: string | null
  dateOfBirth?: string | null
  gender?: Gender | null
  profileImageUrl?: string | null
  educationLevel?: EducationLevel | null
}

// Matches UpdateStudentDto - staff-only, includes academic/guardian fields
export interface UpdateStudentRequest {
  firstName: string
  lastName: string
  phoneNumber?: string | null
  address?: string | null
  dateOfBirth?: string | null
  gender?: Gender | null
  profileImageUrl?: string | null
  grade: string
  section: string
  rollNumber: string
  guardianName?: string | null
  guardianPhoneNumber?: string | null
  bloodGroup?: string | null
  educationLevel?: EducationLevel | null
}

// Matches EducationStatusDto
export interface EducationStatus {
  studentId: number
  admissionNumber: string
  rollNumber: string
  grade: string
  section: string
  admissionDate: string
  status: EnrollmentStatus
  isActive: boolean
}
