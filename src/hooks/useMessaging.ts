import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as messageApi from '@/api/messageApi'
import { queryKeys } from './queryKeys'
import type { SendMessageRequest, StartDirectConversationRequest, StartQueryConversationRequest, UpdateConversationStatusRequest } from '@/types'

export function useContactsQuery() {
  return useQuery({ queryKey: queryKeys.contacts, queryFn: messageApi.getContacts })
}

export function useConversationsQuery() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: messageApi.getMyConversations,
    refetchInterval: 20_000,
  })
}

export function useMessagesQuery(conversationId: number | null) {
  return useQuery({
    queryKey: queryKeys.messages(conversationId ?? -1),
    queryFn: () => messageApi.getMessages(conversationId!),
    enabled: conversationId !== null,
    refetchInterval: conversationId !== null ? 10_000 : false,
  })
}

function useInvalidateConversations() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.conversations })
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }
}

export function useStartDirectConversationMutation() {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (request: StartDirectConversationRequest) => messageApi.startDirectConversation(request),
    onSuccess: invalidate,
  })
}

export function useStartQueryConversationMutation() {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (request: StartQueryConversationRequest) => messageApi.startQueryConversation(request),
    onSuccess: invalidate,
  })
}

export function useSendMessageMutation(conversationId: number) {
  const queryClient = useQueryClient()
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (request: SendMessageRequest) => messageApi.sendMessage(conversationId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(conversationId) })
      invalidate()
    },
  })
}

export function useMarkConversationReadMutation() {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (conversationId: number) => messageApi.markConversationRead(conversationId),
    onSuccess: invalidate,
  })
}

export function useUpdateConversationStatusMutation(conversationId: number) {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (request: UpdateConversationStatusRequest) => messageApi.updateConversationStatus(conversationId, request),
    onSuccess: invalidate,
  })
}
