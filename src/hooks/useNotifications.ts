import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as notificationApi from '@/api/notificationApi'
import { queryKeys } from './queryKeys'

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: notificationApi.getUnreadCount,
    refetchInterval: 30_000,
  })
}

export function useNotificationsQuery(unreadOnly = false) {
  return useQuery({
    queryKey: queryKeys.notifications(unreadOnly),
    queryFn: () => notificationApi.getMyNotifications(unreadOnly),
  })
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => notificationApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notificationApi.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
