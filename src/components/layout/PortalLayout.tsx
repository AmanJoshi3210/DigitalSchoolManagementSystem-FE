import { useState, type ComponentType } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { GraduationCap, Menu, X } from 'lucide-react'
import clsx from 'clsx'
import { NotificationBell } from './NotificationBell'
import { UserMenu } from './UserMenu'
import { useUnreadCountQuery } from '@/hooks/useNotifications'
import type { Portal } from '@/types'

export interface NavItem {
  label: string
  to: string
  icon: ComponentType<{ className?: string }>
  showUnreadBadge?: boolean
  // Overrides showUnreadBadge's shared message-unread-count with a caller-supplied count
  // (e.g. the Action Hub's pending-items total), so the badge isn't hardcoded to messages.
  badgeCount?: number
}

export function PortalLayout({
  portal,
  portalLabel,
  navItems,
}: {
  portal: Portal
  portalLabel: string
  navItems: NavItem[]
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: unreadCount } = useUnreadCountQuery()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarContent portal={portal} portalLabel={portalLabel} navItems={navItems} unreadCount={unreadCount} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white">
            <div className="flex justify-end p-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent
              portal={portal}
              portalLabel={portalLabel}
              navItems={navItems}
              unreadCount={unreadCount}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <NotificationBell portal={portal} />
            <div className="h-6 w-px bg-slate-200" />
            <UserMenu />
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  portal,
  portalLabel,
  navItems,
  unreadCount,
  onNavigate,
}: {
  portal: Portal
  portalLabel: string
  navItems: NavItem[]
  unreadCount?: number
  onNavigate?: () => void
}) {
  return (
    <>
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <GraduationCap className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">DSMS</p>
          <p className="text-xs text-slate-500">{portalLabel}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, to, icon: Icon, showUnreadBadge, badgeCount }) => {
          const count = badgeCount ?? (showUnreadBadge ? unreadCount : undefined)
          return (
            <NavLink
              key={to}
              to={to}
              end={to === `/${portal}/dashboard`}
              onClick={onNavigate}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100',
                )
              }
            >
              <span className="flex items-center gap-2.5">
                <Icon className="size-4.5" />
                {label}
              </span>
              {!!count && (
                <span className="flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
