import { apiClient } from './client'
import type {
  Contact,
  Conversation,
  Message,
  SendMessageRequest,
  StartDirectConversationRequest,
  StartQueryConversationRequest,
  UpdateConversationStatusRequest,
} from '@/types'

// GET /api/conversations/contacts - who the current user is allowed to message (role-filtered by the backend)
export async function getContacts(): Promise<Contact[]> {
  const { data } = await apiClient.get<Contact[]>('/conversations/contacts')
  return data
}

// GET /api/conversations
export async function getMyConversations(): Promise<Conversation[]> {
  const { data } = await apiClient.get<Conversation[]>('/conversations')
  return data
}

// GET /api/conversations/{id}
export async function getConversation(id: number): Promise<Conversation> {
  const { data } = await apiClient.get<Conversation>(`/conversations/${id}`)
  return data
}

// GET /api/conversations/{id}/messages?page=&pageSize=
export async function getMessages(id: number, page = 1, pageSize = 50): Promise<Message[]> {
  const { data } = await apiClient.get<Message[]>(`/conversations/${id}/messages`, {
    params: { page, pageSize },
  })
  return data
}

// POST /api/conversations/direct - staff <-> staff or staff <-> student; reuses an existing thread if one exists
export async function startDirectConversation(request: StartDirectConversationRequest): Promise<Conversation> {
  const { data } = await apiClient.post<Conversation>('/conversations/direct', request)
  return data
}

// POST /api/conversations/query - student only, raises a subject-bearing query with a staff member
export async function startQueryConversation(request: StartQueryConversationRequest): Promise<Conversation> {
  const { data } = await apiClient.post<Conversation>('/conversations/query', request)
  return data
}

// POST /api/conversations/{id}/messages
export async function sendMessage(id: number, request: SendMessageRequest): Promise<Message> {
  const { data } = await apiClient.post<Message>(`/conversations/${id}/messages`, request)
  return data
}

// PUT /api/conversations/{id}/read
export async function markConversationRead(id: number): Promise<void> {
  await apiClient.put(`/conversations/${id}/read`)
}

// PUT /api/conversations/{id}/status - staff only, query conversations only
export async function updateConversationStatus(
  id: number,
  request: UpdateConversationStatusRequest,
): Promise<Conversation> {
  const { data } = await apiClient.put<Conversation>(`/conversations/${id}/status`, request)
  return data
}
