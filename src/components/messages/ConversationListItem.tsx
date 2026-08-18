import clsx from 'clsx'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeTime } from '@/utils/formatters'
import { ConversationStatus, ConversationStatusLabels, ConversationType, enumLabel } from '@/types'
import type { Conversation } from '@/types'

export function ConversationListItem({
  conversation,
  currentUserId,
  active,
  onClick,
}: {
  conversation: Conversation
  currentUserId: number
  active: boolean
  onClick: () => void
}) {
  const other = conversation.participants.find((p) => p.userId !== currentUserId) ?? conversation.participants[0]
  const [firstName, ...rest] = (other?.fullName ?? 'Unknown').split(' ')

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors',
        active ? 'bg-brand-50' : 'hover:bg-slate-50',
      )}
    >
      <Avatar firstName={firstName} lastName={rest.join(' ')} imageUrl={other?.profileImageUrl} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-slate-900">{other?.fullName ?? 'Unknown'}</p>
          {conversation.lastMessageAt && (
            <span className="shrink-0 text-[11px] text-slate-400">{formatRelativeTime(conversation.lastMessageAt)}</span>
          )}
        </div>
        {conversation.type === ConversationType.Query && conversation.subject && (
          <p className="truncate text-xs font-medium text-purple-600">{conversation.subject}</p>
        )}
        <p className="truncate text-xs text-slate-500">{conversation.lastMessagePreview ?? 'No messages yet'}</p>
        <div className="mt-1 flex items-center gap-1.5">
          {conversation.type === ConversationType.Query && (
            <Badge tone={conversation.status === ConversationStatus.Open ? 'blue' : conversation.status === ConversationStatus.Resolved ? 'green' : 'gray'}>
              {enumLabel(ConversationStatusLabels, conversation.status)}
            </Badge>
          )}
          {conversation.unreadCount > 0 && (
            <span className="flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
