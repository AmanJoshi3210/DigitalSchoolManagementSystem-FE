import { apiClient } from './client'
import type { EducationStatus, Student, StudentAcademicsSummary, UpdateOwnProfileRequest } from '@/types'

// Student-portal-facing calls: everything scoped to the signed-in student ("me" endpoints).

// GET /api/students/me
export async function getMyProfile(): Promise<Student> {
  const { data } = await apiClient.get<Student>('/students/me')
  return data
}

// PUT /api/students/me
export async function updateMyProfile(request: UpdateOwnProfileRequest): Promise<Student> {
  const { data } = await apiClient.put<Student>('/students/me', request)
  return data
}

// GET /api/students/me/education-status
export async function getMyEducationStatus(): Promise<EducationStatus> {
  const { data } = await apiClient.get<EducationStatus>('/students/me/education-status')
  return data
}

// GET /api/students/me/academics
export async function getMyAcademics(): Promise<StudentAcademicsSummary> {
  const { data } = await apiClient.get<StudentAcademicsSummary>('/students/me/academics')
  return data
}
