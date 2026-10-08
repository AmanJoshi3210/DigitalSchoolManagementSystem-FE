import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { ArrowRight, Bot, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useAgentChat } from '@/hooks/useAgentChat'
import { AssistantMarkdown } from './AssistantMarkdown'
import type { AgentAction, AssistantMessage } from '@/types'

const SUGGESTIONS = [
  'How do I apply to a program?',
  'What documents do I need to upload?',
  'How do I upload my profile photo?',
  'Why was my document rejected?',
]

const MAX_MESSAGE_LENGTH = 2000

// Floating Student Assistant chat, mounted only in the student portal (see StudentLayout).
export function AssistantWidget() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const { messages, send, reset, isSending } = useAgentChat()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isSending, open])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // On small screens the panel covers the page, so close it when the student follows a link.
  function closeOnMobile() {
    if (window.matchMedia('(max-width: 639px)').matches) setOpen(false)
  }

  function handleAction(action: AgentAction) {
    navigate(action.route)
    closeOnMobile()
  }

  async function submit(text: string) {
    if (!text.trim() || isSending) return
    setDraft('')
    await send(text)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    void submit(draft)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void submit(draft)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-30 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:right-6 sm:bottom-6"
        aria-label="Open Student Assistant"
      >
        <Sparkles className="size-4.5" />
        Ask Assistant
      </button>
    )
  }

  return (
    <section
      role="dialog"
      aria-label="Student Assistant"
      className="fixed inset-0 z-40 flex flex-col bg-white sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[600px] sm:max-h-[calc(100vh-3rem)] sm:w-[400px] sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-2xl"
    >
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Bot className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Student Assistant</p>
            <p className="text-xs text-slate-500">Programs, documents & your profile</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={reset}
              disabled={isSending}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              aria-label="Start a new conversation"
              title="New conversation"
            >
              <RotateCcw className="size-4" />
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close assistant"
          >
            <X className="size-5" />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-4" aria-live="polite">
        {messages.length === 0 && <Welcome onPick={(q) => void submit(q)} />}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onAction={handleAction} onNavigate={closeOnMobile} />
        ))}

        {isSending && <TypingIndicator />}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-100 px-3 pt-3 pb-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              ref={inputRef}
              rows={2}
              value={draft}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask how to apply, which documents you need..."
              aria-label="Message the assistant"
            />
          </div>
          <Button type="submit" disabled={!draft.trim() || isSending} aria-label="Send" className="mb-0.5 px-3">
            <Send className="size-4" />
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-slate-400">
          AI assistant - it can make mistakes. Check important details with staff in Messages.
        </p>
      </form>
    </section>
  )
}

function Welcome({ onPick }: { onPick: (question: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">Hi! I'm your Student Assistant.</p>
        <p className="mt-1">
          I can check your profile, documents and applications and tell you exactly what to do next - how to apply,
          where to upload your photo, and which documents are required.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {SUGGESTIONS.map((question) => (
          <button
            key={question}
            onClick={() => onPick(question)}
            className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-left text-sm text-brand-700 transition-colors hover:bg-brand-100"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  onAction,
  onNavigate,
}: {
  message: AssistantMessage
  onAction: (action: AgentAction) => void
  onNavigate: () => void
}) {
  const isUser = message.role === 'user'

  return (
    <div className={clsx('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
      <div
        className={clsx(
          'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm break-words',
          isUser && 'rounded-br-md bg-brand-600 whitespace-pre-wrap text-white',
          !isUser && !message.isError && 'rounded-bl-md border border-slate-200 bg-white text-slate-700',
          message.isError && 'rounded-bl-md border border-red-200 bg-red-50 text-red-700',
        )}
      >
        {isUser ? message.content : <AssistantMarkdown content={message.content} onNavigate={onNavigate} />}
      </div>

      {!!message.actions?.length && (
        <div className="flex max-w-[88%] flex-wrap gap-1.5">
          {message.actions.map((action) => (
            <button
              key={action.route}
              onClick={() => onAction(action)}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {action.label}
              <ArrowRight className="size-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-3" aria-label="Assistant is typing">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="size-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  )
}
