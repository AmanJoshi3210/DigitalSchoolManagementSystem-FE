import { ArrowLeft } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Select } from '@/components/ui/Select'
import { useUpdateConversationStatusMutation } from '@/hooks/useMessaging'
import { ConversationStatus, ConversationStatusLabels, ConversationType } from '@/types'
import type { Conversation, Portal } from '@/types'

export function ConversationHeader({
  conversation,
  currentUserId,
  portal,
  onBack,
}: {
  conversation: Conversation
  currentUserId: number
  portal: Portal
  onBack: () => void
}) {
  const other = conversation.participants.find((p) => p.userId !== currentUserId) ?? conversation.participants[0]
  const [firstName, ...rest] = (other?.fullName ?? 'Unknown').split(' ')
  const statusMutation = useUpdateConversationStatusMutation(conversation.id)

  const isQuery = conversation.type === ConversationType.Query
  const canManageStatus = portal === 'staff' && isQuery

  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onBack} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 md:hidden" aria-label="Back to conversations">
          <ArrowLeft className="size-4" />
        </button>
        <Avatar firstName={firstName} lastName={rest.join(' ')} imageUrl={other?.profileImageUrl} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{other?.fullName ?? 'Unknown'}</p>
          <p className="truncate text-xs text-slate-500">{isQuery ? conversation.subject : other?.role}</p>
        </div>
      </div>

      {canManageStatus ? (
        <Select
          value={conversation.status}
          onChange={(e) => statusMutation.mutate({ status: Number(e.target.value) as ConversationStatus })}
          className="w-32 py-1.5 text-xs"
          disabled={statusMutation.isPending}
        >
          {Object.entries(ConversationStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      ) : isQuery ? (
        <span className="shrink-0 text-xs font-medium text-slate-500">{ConversationStatusLabels[conversation.status]}</span>
      ) : null}
    </div>
  )
}
