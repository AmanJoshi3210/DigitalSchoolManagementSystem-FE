import type { ConversationStatus, ConversationType } from './enums'

// Matches ConversationParticipantDto
export interface ConversationParticipant {
  userId: number
  fullName: string
  role: string
  profileImageUrl?: string | null
}

// Matches ConversationDto
export interface Conversation {
  id: number
  type: ConversationType
  subject?: string | null
  status: ConversationStatus
  createdByUserId: number
  createdAt: string
  lastMessageAt?: string | null
  resolvedAt?: string | null
  lastMessagePreview?: string | null
  unreadCount: number
  participants: ConversationParticipant[]
}

// Matches ContactDto - GET /api/conversations/contacts
export interface Contact {
  userId: number
  fullName: string
  role: string
  subtitle: string
}

// Matches MessageDto
export interface Message {
  id: number
  conversationId: number
  senderUserId: number
  senderName: string
  senderRole: string
  content: string
  isEdited: boolean
  editedAt?: string | null
  sentAt: string
}

// Matches SendMessageDto
export interface SendMessageRequest {
  content: string
}

// Matches StartDirectConversationDto
export interface StartDirectConversationRequest {
  recipientUserId: number
  initialMessage: string
}

// Matches StartQueryConversationDto
export interface StartQueryConversationRequest {
  staffUserId: number
  subject: string
  initialMessage: string
}

// Matches UpdateConversationStatusDto
export interface UpdateConversationStatusRequest {
  status: ConversationStatus
}
