import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageSquarePlus, MessagesSquare } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '@/hooks/useAuth'
import { useContactsQuery, useConversationsQuery, useMarkConversationReadMutation, useMessagesQuery } from '@/hooks/useMessaging'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConversationListItem } from './ConversationListItem'
import { ConversationHeader } from './ConversationHeader'
import { MessageBubble } from './MessageBubble'
import { MessageComposer } from './MessageComposer'
import { NewConversationModal } from './NewConversationModal'
import { ConversationStatus, ConversationType } from '@/types'
import type { Portal } from '@/types'

export function MessagingWorkspace({ portal }: { portal: Portal }) {
  const { session } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const selectedId = searchParams.get('c') ? Number(searchParams.get('c')) : null
  const deepLinkRecipient = searchParams.get('to') ? Number(searchParams.get('to')) : null

  const { data: conversations, isPending: conversationsPending, isError: conversationsError, error: conversationsErr, refetch } = useConversationsQuery()
  const { data: contacts } = useContactsQuery()
  const { data: messages, isPending: messagesPending } = useMessagesQuery(selectedId)
  const markRead = useMarkConversationReadMutation()

  const selectedConversation = conversations?.find((c) => c.id === selectedId) ?? null

  useEffect(() => {
    if (deepLinkRecipient) {
      setModalOpen(true)
    }
    // Deep-link ("?to=") is only meant to trigger this once, when the page is first opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedId && selectedConversation && selectedConversation.unreadCount > 0) {
      markRead.mutate(selectedId)
    }
    // Only re-run when the selected conversation or its unread count changes, not on every markRead identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selectedConversation?.unreadCount])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, selectedId])

  function selectConversation(id: number) {
    setSearchParams({ c: String(id) })
  }

  function backToList() {
    const next = new URLSearchParams(searchParams)
    next.delete('c')
    setSearchParams(next)
  }

  function handleCreated(conversationId: number) {
    setModalOpen(false)
    const next = new URLSearchParams(searchParams)
    next.delete('to')
    next.set('c', String(conversationId))
    setSearchParams(next)
  }

  if (!session) return null
  if (conversationsError) return <ErrorState error={conversationsErr} onRetry={refetch} />

  const isClosed = selectedConversation?.type === ConversationType.Query && selectedConversation.status === ConversationStatus.Closed

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Messages</h1>
        <Button onClick={() => setModalOpen(true)}>
          <MessageSquarePlus className="size-4" /> New Message
        </Button>
      </div>

      <Card className="flex min-h-0 flex-1 overflow-hidden p-0">
        <div className={clsx('w-full shrink-0 flex-col overflow-y-auto scrollbar-thin border-r border-slate-100 md:flex md:w-80', selectedId ? 'hidden' : 'flex')}>
          {conversationsPending ? (
            <Spinner />
          ) : conversations && conversations.length > 0 ? (
            conversations.map((c) => (
              <ConversationListItem
                key={c.id}
                conversation={c}
                currentUserId={session.userId}
                active={c.id === selectedId}
                onClick={() => selectConversation(c.id)}
              />
            ))
          ) : (
            <EmptyState
              icon={MessagesSquare}
              title="No conversations yet"
              description="Start a new conversation to get going."
              action={
                <Button size="sm" onClick={() => setModalOpen(true)}>
                  New Message
                </Button>
              }
            />
          )}
        </div>

        <div className={clsx('min-w-0 flex-1 flex-col', selectedId ? 'flex' : 'hidden md:flex')}>
          {selectedConversation ? (
            <>
              <ConversationHeader conversation={selectedConversation} currentUserId={session.userId} portal={portal} onBack={backToList} />
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-4">
                {messagesPending ? (
                  <Spinner />
                ) : messages && messages.length > 0 ? (
                  messages.map((m) => <MessageBubble key={m.id} message={m} isOwn={m.senderUserId === session.userId} />)
                ) : (
                  <p className="py-10 text-center text-sm text-slate-400">No messages yet - say hello.</p>
                )}
              </div>
              <MessageComposer
                conversationId={selectedConversation.id}
                disabled={isClosed}
                disabledReason="This query has been closed and no longer accepts new messages."
              />
            </>
          ) : (
            <EmptyState icon={MessagesSquare} title="Select a conversation" description="Choose a conversation from the list to view messages." />
          )}
        </div>
      </Card>

      <NewConversationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          if (deepLinkRecipient) {
            const next = new URLSearchParams(searchParams)
            next.delete('to')
            setSearchParams(next)
          }
        }}
        portal={portal}
        contacts={contacts ?? []}
        defaultRecipientId={deepLinkRecipient}
        onCreated={handleCreated}
      />
    </div>
  )
}
