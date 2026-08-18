import clsx from 'clsx'
import { formatTime } from '@/utils/formatters'
import type { Message } from '@/types'

export function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={clsx('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
      {!isOwn && <span className="mb-1 px-1 text-xs font-medium text-slate-500">{message.senderName}</span>}
      <div
        className={clsx(
          'max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm',
          isOwn ? 'rounded-br-sm bg-brand-600 text-white' : 'rounded-bl-sm bg-slate-100 text-slate-800',
        )}
      >
        {message.content}
      </div>
      <span className="mt-1 px-1 text-[11px] text-slate-400">
        {formatTime(message.sentAt)}
        {message.isEdited && ' · edited'}
      </span>
    </div>
  )
}
