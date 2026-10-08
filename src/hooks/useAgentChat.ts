import { useCallback, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import * as agentApi from '@/api/agentApi'
import { useAuth } from './useAuth'
import { getErrorMessage } from '@/utils/errors'
import type { AssistantMessage } from '@/types'

interface StoredChat {
  conversationId: string | null
  messages: AssistantMessage[]
}

const EMPTY_CHAT: StoredChat = { conversationId: null, messages: [] }

// Per-user and per-tab: survives page reloads/navigation, but a different student logging in on
// the same browser never sees someone else's chat, and closing the tab forgets it.
function storageKey(userId: number | undefined) {
  return userId ? `dsms_assistant_${userId}` : null
}

function load(key: string | null): StoredChat {
  if (!key) return EMPTY_CHAT
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as StoredChat) : EMPTY_CHAT
  } catch {
    return EMPTY_CHAT
  }
}

function save(key: string | null, chat: StoredChat) {
  if (!key) return
  try {
    sessionStorage.setItem(key, JSON.stringify(chat))
  } catch {
    // sessionStorage unavailable - the chat just won't survive a reload.
  }
}

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
}

export function useAgentChat() {
  const { session } = useAuth()
  const key = storageKey(session?.userId)
  const [chat, setChat] = useState<StoredChat>(() => load(key))

  // Re-load when the logged-in user changes.
  useEffect(() => {
    setChat(load(key))
  }, [key])

  useEffect(() => {
    save(key, chat)
  }, [key, chat])

  const mutation = useMutation({ mutationFn: agentApi.sendAgentMessage })

  const send = useCallback(
    async (text: string) => {
      const message = text.trim()
      if (!message || mutation.isPending) return

      setChat((current) => ({
        ...current,
        messages: [...current.messages, { id: newId(), role: 'user', content: message }],
      }))

      try {
        const response = await mutation.mutateAsync({ conversationId: chat.conversationId, message })
        setChat((current) => ({
          conversationId: response.conversationId,
          messages: [
            ...current.messages,
            { id: newId(), role: 'assistant', content: response.reply, actions: response.actions },
          ],
        }))
      } catch (err) {
        setChat((current) => ({
          ...current,
          messages: [
            ...current.messages,
            {
              id: newId(),
              role: 'assistant',
              content: getErrorMessage(err, 'The assistant is unavailable right now. Please try again.'),
              isError: true,
            },
          ],
        }))
      }
    },
    [chat.conversationId, mutation],
  )

  const reset = useCallback(() => {
    if (chat.conversationId) {
      // Best effort - the server conversation also expires on its own.
      agentApi.resetAgentConversation(chat.conversationId).catch(() => {})
    }
    setChat(EMPTY_CHAT)
  }, [chat.conversationId])

  return { messages: chat.messages, send, reset, isSending: mutation.isPending }
}
