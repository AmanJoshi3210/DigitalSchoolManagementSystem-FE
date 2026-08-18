import { useState } from 'react'
import { Bell, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useMarkAllNotificationsReadMutation, useNotificationsQuery, useUnreadCountQuery } from '@/hooks/useNotifications'
import { formatRelativeTime } from '@/utils/formatters'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Portal } from '@/types'

export function NotificationBell({ portal }: { portal: Portal }) {
  const [open, setOpen] = useState(false)
  const { data: unreadCount } = useUnreadCountQuery()
  const { data: notifications, isPending, isError } = useNotificationsQuery()
  const markAllRead = useMarkAllNotificationsReadMutation()

  const messagesPath = portal === 'student' ? '/student/messages' : '/staff/messages'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex size-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        {!!unreadCount && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              {!!unreadCount && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  <Check className="size-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {isPending ? (
                <Spinner />
              ) : isError ? (
                <p className="px-4 py-6 text-center text-sm text-slate-500">Couldn&apos;t load notifications.</p>
              ) : notifications && notifications.length > 0 ? (
                notifications.slice(0, 8).map((n) => (
                  <Link
                    key={n.id}
                    to={n.conversationId ? messagesPath : '#'}
                    onClick={() => setOpen(false)}
                    className={clsx('block border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50', !n.isRead && 'bg-brand-50/40')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      {!n.isRead && <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-500" />}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.body}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{formatRelativeTime(n.createdAt)}</p>
                  </Link>
                ))
              ) : (
                <EmptyState title="No notifications" description="You're all caught up." />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
