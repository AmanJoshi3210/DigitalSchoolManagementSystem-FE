import { useState, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { useSendMessageMutation } from '@/hooks/useMessaging'
import { getErrorMessage } from '@/utils/errors'

export function MessageComposer({ conversationId, disabled, disabledReason }: { conversationId: number; disabled?: boolean; disabledReason?: string }) {
  const [content, setContent] = useState('')
  const mutation = useSendMessageMutation(conversationId)

  async function send() {
    const trimmed = content.trim()
    if (!trimmed || mutation.isPending) return
    try {
      setContent('')
      await mutation.mutateAsync({ content: trimmed })
    } catch (err) {
      setContent(trimmed)
      toast.error(getErrorMessage(err, 'Could not send your message.'))
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  if (disabled) {
    return (
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
        {disabledReason ?? 'You cannot send messages in this conversation.'}
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2 border-t border-slate-100 p-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message… (Enter to send, Shift+Enter for a new line)"
        rows={1}
        className="max-h-32 flex-1 resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      <Button onClick={send} loading={mutation.isPending} disabled={!content.trim()}>
        <Send className="size-4" />
      </Button>
    </div>
  )
}
