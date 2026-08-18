import { apiClient } from './client'
import type { Document, DocumentType, ReviewDocumentRequest } from '@/types'

// GET /api/documents/me
export async function getMyDocuments(): Promise<Document[]> {
  const { data } = await apiClient.get<Document[]>('/documents/me')
  return data
}

// GET /api/documents/user/{userId} - staff only, used to view a specific student's documents
export async function getDocumentsByUser(userId: number): Promise<Document[]> {
  const { data } = await apiClient.get<Document[]>(`/documents/user/${userId}`)
  return data
}

// GET /api/documents/pending - staff only, documents awaiting verification (Action Hub)
export async function getPendingDocuments(): Promise<Document[]> {
  const { data } = await apiClient.get<Document[]>('/documents/pending')
  return data
}

// PUT /api/documents/{id}/review - staff only, approve or reject a pending document
export async function reviewDocument(id: number, request: ReviewDocumentRequest): Promise<Document> {
  const { data } = await apiClient.put<Document>(`/documents/${id}/review`, request)
  return data
}

// POST /api/documents (multipart/form-data)
export async function uploadDocument(
  file: File,
  documentType: DocumentType,
  description?: string | null,
): Promise<Document> {
  const formData = new FormData()
  formData.append('documentType', String(documentType))
  if (description) formData.append('description', description)
  formData.append('file', file)

  // apiClient defaults Content-Type to application/json; axios only lets FormData set its own
  // multipart boundary when that header is absent, so it must be explicitly cleared here -
  // otherwise axios silently JSON-stringifies the FormData and the API 415s.
  const { data } = await apiClient.post<Document>('/documents', formData, {
    headers: { 'Content-Type': undefined },
  })
  return data
}

// DELETE /api/documents/{id}
export async function deleteDocument(id: number): Promise<void> {
  await apiClient.delete(`/documents/${id}`)
}

// GET /api/documents/{id}/download - the API redirects to the file's Cloudinary URL, so it's
// fetched as a blob (carrying the auth header for the initial request) and opened locally
// rather than navigated to directly, since a plain <a href> can't attach the bearer token.
export async function openDocument(id: number): Promise<void> {
  const { data } = await apiClient.get(`/documents/${id}/download`, { responseType: 'blob' })
  const url = URL.createObjectURL(data as Blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
