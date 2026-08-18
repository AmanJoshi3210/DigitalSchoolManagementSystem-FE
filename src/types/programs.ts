import type { ApplicationStatus, EducationLevel } from './enums'

// Matches ProgramDto
export interface Program {
  id: number
  name: string
  description?: string | null
  eligibleEducationLevel: EducationLevel
  applicationDeadline: string
  isActive: boolean
  isAcceptingApplications: boolean
  createdAt: string
}

// Matches CreateProgramDto
export interface CreateProgramRequest {
  name: string
  description?: string | null
  eligibleEducationLevel: EducationLevel
  applicationDeadline: string
}

// Matches UpdateProgramDto
export interface UpdateProgramRequest {
  name: string
  description?: string | null
  eligibleEducationLevel: EducationLevel
  applicationDeadline: string
}

// Matches UpdateProgramStatusDto
export interface UpdateProgramStatusRequest {
  isActive: boolean
}

// Matches ProgramApplicationDto
export interface ProgramApplication {
  id: number
  programId: number
  programName: string
  studentId: number
  studentName: string
  studentAdmissionNumber: string
  status: ApplicationStatus
  appliedAt: string
  reviewedAt?: string | null
  reviewedByStaffName?: string | null
  reviewNotes?: string | null
}

// Matches ReviewApplicationDto
export interface ReviewApplicationRequest {
  status: ApplicationStatus
  reviewNotes?: string | null
}
