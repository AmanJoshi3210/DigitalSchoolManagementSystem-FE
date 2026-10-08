import { apiClient } from './client'
import type { AgentChatRequest, AgentChatResponse } from '@/types'

// The Student Assistant runs as its own service. Calls go through the shared apiClient (so the
// bearer token and 401 auto-refresh are reused) with a per-request baseURL - a relative
// "/agent" (Docker/nginx) would otherwise be appended to the /api baseURL.
const agentBaseURL = import.meta.env.VITE_AGENT_BASE_URL

// POST /agent/chat
export async function sendAgentMessage(request: AgentChatRequest): Promise<AgentChatResponse> {
  const { data } = await apiClient.post<AgentChatResponse>('/chat', request, { baseURL: agentBaseURL })
  return data
}

// DELETE /agent/chat/{conversationId}
export async function resetAgentConversation(conversationId: string): Promise<void> {
  await apiClient.delete(`/chat/${conversationId}`, { baseURL: agentBaseURL })
}
