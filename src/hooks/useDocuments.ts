import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as documentApi from '@/api/documentApi'
import { queryKeys } from './queryKeys'
import type { DocumentType, ReviewDocumentRequest } from '@/types'

export function useMyDocumentsQuery() {
  return useQuery({ queryKey: queryKeys.myDocuments, queryFn: documentApi.getMyDocuments })
}

export function useUserDocumentsQuery(userId: number) {
  return useQuery({
    queryKey: queryKeys.userDocuments(userId),
    queryFn: () => documentApi.getDocumentsByUser(userId),
    enabled: !!userId,
  })
}

export function useUploadDocumentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, documentType, description }: { file: File; documentType: DocumentType; description?: string | null }) =>
      documentApi.uploadDocument(file, documentType, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myDocuments })
    },
  })
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => documentApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myDocuments })
    },
  })
}

export function usePendingDocumentsQuery() {
  return useQuery({ queryKey: queryKeys.pendingDocuments, queryFn: documentApi.getPendingDocuments })
}

export function useReviewDocumentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ documentId, request }: { documentId: number; request: ReviewDocumentRequest }) =>
      documentApi.reviewDocument(documentId, request),
    onSuccess: () => {
      // Covers pendingDocuments, myDocuments, and any cached userDocuments(id) in one shot.
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}
