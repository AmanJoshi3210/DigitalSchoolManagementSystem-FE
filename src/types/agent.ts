// Matches DigitalSchoolManagementSystem.Agent.Api ChatRequest / ChatResponse / PortalAction.
// The Student Assistant is a separate service (VITE_AGENT_BASE_URL), not part of /api.

export interface AgentChatRequest {
  conversationId?: string | null
  message: string
}

export interface AgentAction {
  label: string
  /** A student-portal route, e.g. "/student/documents". */
  route: string
}

export interface AgentChatResponse {
  conversationId: string
  /** Markdown. */
  reply: string
  actions: AgentAction[]
}

export interface AssistantMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  actions?: AgentAction[]
  isError?: boolean
}
