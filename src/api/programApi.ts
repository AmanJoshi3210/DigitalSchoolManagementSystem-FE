import { apiClient } from './client'
import type {
  CreateProgramRequest,
  Program,
  ProgramApplication,
  ReviewApplicationRequest,
  UpdateProgramRequest,
  UpdateProgramStatusRequest,
} from '@/types'

// Shared /api/programs calls used by both the staff and student portals.
// GET /api/programs and GET /api/programs/{id} are role-aware server-side
// (staff see inactive programs too), so both portals call the same functions.

// GET /api/programs
export async function getAllPrograms(): Promise<Program[]> {
  const { data } = await apiClient.get<Program[]>('/programs')
  return data
}

// GET /api/programs/{id}
export async function getProgramById(id: number): Promise<Program> {
  const { data } = await apiClient.get<Program>(`/programs/${id}`)
  return data
}

// POST /api/programs
export async function createProgram(request: CreateProgramRequest): Promise<Program> {
  const { data } = await apiClient.post<Program>('/programs', request)
  return data
}

// PUT /api/programs/{id}
export async function updateProgram(id: number, request: UpdateProgramRequest): Promise<Program> {
  const { data } = await apiClient.put<Program>(`/programs/${id}`, request)
  return data
}

// PUT /api/programs/{id}/status
export async function updateProgramStatus(id: number, request: UpdateProgramStatusRequest): Promise<Program> {
  const { data } = await apiClient.put<Program>(`/programs/${id}/status`, request)
  return data
}

// GET /api/programs/{id}/applications
export async function getProgramApplications(programId: number): Promise<ProgramApplication[]> {
  const { data } = await apiClient.get<ProgramApplication[]>(`/programs/${programId}/applications`)
  return data
}

// GET /api/programs/applications/pending - staff only, applications awaiting review across all programs (Action Hub)
export async function getPendingApplications(): Promise<ProgramApplication[]> {
  const { data } = await apiClient.get<ProgramApplication[]>('/programs/applications/pending')
  return data
}

// POST /api/programs/{id}/apply
export async function applyToProgram(programId: number): Promise<ProgramApplication> {
  const { data } = await apiClient.post<ProgramApplication>(`/programs/${programId}/apply`)
  return data
}

// GET /api/programs/me/applications
export async function getMyApplications(): Promise<ProgramApplication[]> {
  const { data } = await apiClient.get<ProgramApplication[]>('/programs/me/applications')
  return data
}

// PUT /api/programs/applications/{applicationId}/review
export async function reviewApplication(
  applicationId: number,
  request: ReviewApplicationRequest,
): Promise<ProgramApplication> {
  const { data } = await apiClient.put<ProgramApplication>(`/programs/applications/${applicationId}/review`, request)
  return data
}
