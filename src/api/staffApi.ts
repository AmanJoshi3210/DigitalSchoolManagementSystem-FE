import { apiClient } from './client'
import type { EducationStatus, Student, StudentAcademicsSummary, UpdateStudentRequest } from '@/types'

// Staff-portal-facing calls: admin operations over the full student roster.
// No server-side pagination/search/sort exists on GET /api/students - it returns the full list.

// GET /api/students
export async function getAllStudents(): Promise<Student[]> {
  const { data } = await apiClient.get<Student[]>('/students')
  return data
}

// GET /api/students/{id}
export async function getStudentById(id: number): Promise<Student> {
  const { data } = await apiClient.get<Student>(`/students/${id}`)
  return data
}

// GET /api/students/{id}/education-status
export async function getStudentEducationStatus(id: number): Promise<EducationStatus> {
  const { data } = await apiClient.get<EducationStatus>(`/students/${id}/education-status`)
  return data
}

// GET /api/students/{id}/academics
export async function getStudentAcademics(id: number): Promise<StudentAcademicsSummary> {
  const { data } = await apiClient.get<StudentAcademicsSummary>(`/students/${id}/academics`)
  return data
}

// PUT /api/students/{id}
export async function updateStudent(id: number, request: UpdateStudentRequest): Promise<Student> {
  const { data } = await apiClient.put<Student>(`/students/${id}`, request)
  return data
}

// DELETE /api/students/{id}
export async function deleteStudent(id: number): Promise<void> {
  await apiClient.delete(`/students/${id}`)
}
