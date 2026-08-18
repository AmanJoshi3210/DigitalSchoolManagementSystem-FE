import type { DocumentStatus, DocumentType } from './enums'

// Matches DocumentDto
export interface Document {
  id: number
  documentType: DocumentType
  description?: string | null
  uploadedAt: string

  fileName: string
  fileSize: number
  contentType: string

  uploadedByUserId: number
  uploadedByName: string
  uploadedByRole: string

  status: DocumentStatus
  reviewedAt?: string | null
  reviewedByStaffName?: string | null
  reviewNotes?: string | null
}

// Matches UploadDocumentRequestDto - sent as multipart/form-data alongside the file
export interface UploadDocumentRequest {
  documentType: DocumentType
  description?: string | null
}

// Matches ReviewDocumentDto
export interface ReviewDocumentRequest {
  status: DocumentStatus
  reviewNotes?: string | null
}
