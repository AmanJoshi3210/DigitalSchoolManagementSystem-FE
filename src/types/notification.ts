import type { NotificationType } from './enums'

// Matches NotificationDto
export interface AppNotification {
  id: number
  type: NotificationType
  title: string
  body: string
  conversationId?: number | null
  isRead: boolean
  readAt?: string | null
  createdAt: string
}
