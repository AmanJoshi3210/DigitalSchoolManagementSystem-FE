import { apiClient } from './client'
import type { AppNotification } from '@/types'

// GET /api/notifications?unreadOnly=&page=&pageSize=
export async function getMyNotifications(unreadOnly = false, page = 1, pageSize = 20): Promise<AppNotification[]> {
  const { data } = await apiClient.get<AppNotification[]>('/notifications', {
    params: { unreadOnly, page, pageSize },
  })
  return data
}

// GET /api/notifications/unread-count
export async function getUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<number>('/notifications/unread-count')
  return data
}

// PUT /api/notifications/{id}/read
export async function markNotificationRead(id: number): Promise<void> {
  await apiClient.put(`/notifications/${id}/read`)
}

// PUT /api/notifications/read-all
export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.put('/notifications/read-all')
}
