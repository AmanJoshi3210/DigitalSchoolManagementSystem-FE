import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useStartDirectConversationMutation, useStartQueryConversationMutation } from '@/hooks/useMessaging'
import { getErrorMessage } from '@/utils/errors'
import type { Contact, Portal } from '@/types'

type Mode = 'direct' | 'query'

export function NewConversationModal({
  open,
  onClose,
  portal,
  contacts,
  defaultRecipientId,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  portal: Portal
  contacts: Contact[]
  defaultRecipientId?: number | null
  onCreated: (conversationId: number) => void
}) {
  const [mode, setMode] = useState<Mode>('direct')
  const [recipientType, setRecipientType] = useState<'Student' | 'Staff'>('Staff')
  const [recipientUserId, setRecipientUserId] = useState<number | ''>('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const startDirect = useStartDirectConversationMutation()
  const startQuery = useStartQueryConversationMutation()
  const submitting = startDirect.isPending || startQuery.isPending

  useEffect(() => {
    if (!open) return
    setMode('direct')
    setSubject('')
    setMessage('')
    setError(null)
    if (defaultRecipientId) {
      setRecipientUserId(defaultRecipientId)
      const contact = contacts.find((c) => c.userId === defaultRecipientId)
      if (contact?.role === 'Student') setRecipientType('Student')
    } else {
      setRecipientUserId('')
    }
  }, [open, defaultRecipientId, contacts])

  // Staff can message Staff or Student; students can only ever message Staff (contacts already reflects that).
  const visibleContacts = portal === 'staff' ? contacts.filter((c) => c.role === recipientType) : contacts

  async function handleSubmit() {
    setError(null)
    if (!recipientUserId) {
      setError('Choose a recipient.')
      return
    }
    if (!message.trim()) {
      setError('Write a message before sending.')
      return
    }
    if (mode === 'query' && !subject.trim()) {
      setError('Give your query a subject.')
      return
    }

    try {
      const conversation =
        mode === 'query'
          ? await startQuery.mutateAsync({ staffUserId: recipientUserId, subject: subject.trim(), initialMessage: message.trim() })
          : await startDirect.mutateAsync({ recipientUserId, initialMessage: message.trim() })

      toast.success(mode === 'query' ? 'Query submitted' : 'Message sent')
      onCreated(conversation.id)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not start this conversation.'))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Message" size="md">
      <div className="flex flex-col gap-4">
        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {portal === 'student' && (
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            {(['direct', 'query'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === m ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'direct' ? 'Message Staff' : 'Raise a Query'}
              </button>
            ))}
          </div>
        )}

        {portal === 'staff' && (
          <Select
            label="Recipient Type"
            value={recipientType}
            onChange={(e) => {
              setRecipientType(e.target.value as 'Student' | 'Staff')
              setRecipientUserId('')
            }}
          >
            <option value="Staff">Staff</option>
            <option value="Student">Student</option>
          </Select>
        )}

        <Select
          label="Recipient"
          required
          value={recipientUserId}
          onChange={(e) => setRecipientUserId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Select a recipient…</option>
          {visibleContacts.map((c) => (
            <option key={c.userId} value={c.userId}>
              {c.fullName} {c.subtitle ? `· ${c.subtitle}` : ''}
            </option>
          ))}
        </Select>

        {mode === 'query' && (
          <Input label="Subject" required maxLength={200} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Doubt in Chapter 4" />
        )}

        <Textarea label="Message" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message…" />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={submitting}>
            {mode === 'query' ? 'Submit Query' : 'Send Message'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
